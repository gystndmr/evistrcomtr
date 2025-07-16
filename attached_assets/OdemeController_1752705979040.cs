using Microsoft.AspNetCore.Mvc;
using vize.Models;
using System.Data;
using System.Web;
using Fatura_Odeme_Web.QueryTools.Vallet_Class;
using Newtonsoft.Json.Linq;
using ValletComTR_Ornek;
using Newtonsoft.Json;
using System;
using System.Globalization;


namespace vize.Controllers
{
    public class OdemeController(sql sql) : BaseController(sql)
    {
        public IActionResult OdemeSayfasi()
        {

            string guid = Request.Cookies["guid"].ToString();
            sql.SP_INS_LOG_VIZE(guid, "OdemeSayfasi", "OdemeSayfasi sayfasinda.");

            string ip = GetIPAddress(HttpContext);
            DataSet SP_SLC_POS_BILGILERI_WID = sql.SP_SLC_POS_BILGILERI_WID(2);
            string userName = SP_SLC_POS_BILGILERI_WID.Tables[0].Rows[0]["userName"].ToString();
            string password = SP_SLC_POS_BILGILERI_WID.Tables[0].Rows[0]["password"].ToString();
            string shopCode = SP_SLC_POS_BILGILERI_WID.Tables[0].Rows[0]["shopCode"].ToString();
            string hash = SP_SLC_POS_BILGILERI_WID.Tables[0].Rows[0]["hash"].ToString();


            DataSet SP_SLC_BASVURU = sql.SP_SLC_BASVURU(guid);
            if (BosControl(SP_SLC_BASVURU))
            {
                string ad = SP_SLC_BASVURU.Tables[0].Rows[0]["ad"].ToString();
                string soyad = SP_SLC_BASVURU.Tables[0].Rows[0]["soyad"].ToString();
                string eposta = SP_SLC_BASVURU.Tables[0].Rows[0]["eposta"].ToString();
                string tel = SP_SLC_BASVURU.Tables[0].Rows[0]["tel"].ToString();
                string adres = SP_SLC_BASVURU.Tables[0].Rows[0]["adres"].ToString();

                string sigorta_fiyat_id = Convert.ToInt32(SP_SLC_BASVURU.Tables[0].Rows[0]["sigorta_fiyat_id"]).ToString(CultureInfo.InvariantCulture);
                string vize_fiyat_id = Convert.ToInt32(SP_SLC_BASVURU.Tables[0].Rows[0]["vize_fiyat_id"]).ToString(CultureInfo.InvariantCulture);
                string vize_fiyat_detay_id = Convert.ToInt32(SP_SLC_BASVURU.Tables[0].Rows[0]["vize_fiyat_detay_id"]).ToString(CultureInfo.InvariantCulture);
                int destekleyici_belge = Convert.ToInt32(SP_SLC_BASVURU.Tables[0].Rows[0]["destekleyici_belge"]);
                string fiyat = "";

                if (sigorta_fiyat_id != "-1")
                {
                    DataSet SP_SLC_SIGORTA_FIYAT_WID = sql.SP_SLC_SIGORTA_FIYAT_WID(Convert.ToInt32(sigorta_fiyat_id));
                    fiyat = SP_SLC_SIGORTA_FIYAT_WID.Tables[0].Rows[0]["fiyat"].ToString();
                }
                else
                {
                    if (vize_fiyat_id != "-1")
                    {
                        DataSet SP_SLC_VIZE_FIYATLARI_WID = _sql.SP_SLC_VIZE_FIYATLARI_WID(Convert.ToInt32(vize_fiyat_id));
                        fiyat = SP_SLC_VIZE_FIYATLARI_WID.Tables[0].Rows[0]["fiyat"].ToString();
                        if (vize_fiyat_id == "4" && vize_fiyat_detay_id != "-1")
                        {
                            DataSet SP_SLC_VIZE_FIYATLARI_DETAY_WID = _sql.SP_SLC_VIZE_FIYATLARI_DETAY_WID(Convert.ToInt32(vize_fiyat_detay_id));
                            fiyat = SP_SLC_VIZE_FIYATLARI_DETAY_WID.Tables[0].Rows[0]["fiyat"].ToString();
                        }
                    }
                }
                decimal pdf_belge_ucreti_fiyat = 00.00m;
                decimal bankacilik_komisyon_ucreti_fiyat = 00.00m;
                DataSet SP_SLC_EK_FIYATLAR = _sql.SP_SLC_EK_FIYATLAR();
                if (SP_SLC_EK_FIYATLAR != null && SP_SLC_EK_FIYATLAR.Tables.Count > 0)
                {
                    if (SP_SLC_EK_FIYATLAR.Tables[0].Rows.Count > 1)
                        bankacilik_komisyon_ucreti_fiyat = Convert.ToDecimal(SP_SLC_EK_FIYATLAR.Tables[0].Rows[1]["fiyat"]);
                    if (!(destekleyici_belge == -1 || destekleyici_belge == 2))
                        if (SP_SLC_EK_FIYATLAR.Tables[0].Rows.Count > 0)
                            pdf_belge_ucreti_fiyat = Convert.ToDecimal(SP_SLC_EK_FIYATLAR.Tables[0].Rows[0]["fiyat"]);

                }
                string dolar = WebRequestIste("https://webapi.tmgrup.com.tr/Economy/GetMarketExchangeRatesBy?symbols=SUSD&delimiter=,");
                decimal fiyatDecimal = Convert.ToDecimal(fiyat) + pdf_belge_ucreti_fiyat + bankacilik_komisyon_ucreti_fiyat;

                decimal dolarDecimal = Convert.ToDecimal(dolar, CultureInfo.InvariantCulture);

                decimal sonuc = fiyatDecimal;
                string formattedPrice = sonuc.ToString("F2").Replace(",", ".").Replace("٫", ".");

                string locale = Thread.CurrentThread.CurrentCulture.Name.ToString().Replace("-", "_");
                locale = locale.Split('_')[0].ToLower();

                //POS TABLOSUNA ILK INSERT
                string insertId = "";
                DataSet SP_INS_POS = sql.SP_INS_POS(guid, 1, "", sonuc, 00, dolarDecimal);
                if (BosControl(SP_INS_POS))
                {
                    insertId = SP_INS_POS.Tables[0].Rows[0]["id"].ToString();
                    CookieOptions options = new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(1),
                        HttpOnly = true,
                        Secure = true
                    };
                    Response.Cookies.Append("insertId", insertId, options);
                }
                //POS HAREKET TABLOSUNA INSERT
                sql.SP_INS_POS_HAREKET(Convert.ToInt32(insertId), 1, 0);

                ValletConfig valletConfig = new ValletConfig();
                valletConfig.userName = userName;
                valletConfig.password = password;
                valletConfig.shopCode = shopCode;
                valletConfig.hash = hash;

                List<ProductData> productData = new List<ProductData>
            {
                new ProductData { productName = "VIZE BASVURU", productPrice = formattedPrice, productType = "DIJITAL_URUN" },
            };

                PostData postData = new PostData();
                postData.productData = productData;
                postData.orderId = guid;
                postData.conversationId = insertId;

                string domain = HttpContext.Request.Host.Value;

                //BAKILACAK!!!
                /*bu bilgilerin https://www.vallet.com.tr/merchant/api-manager/api-information.html adresinden girilmesi lazım*/
                postData.referer = domain;


                postData.callbackOkUrl = "https://" + domain + "/Odeme/OdemeBasarili";
                postData.callbackFailUrl = "https://" + domain + "/Odeme/OdemeBasarisiz";

                postData.buyerMail = eposta;
                postData.buyerGsmNo = tel;
                postData.buyerName = ad;
                postData.buyerSurName = soyad;
                postData.buyerCountry = "Türkiye";
                postData.buyerCity = "";
                postData.buyerDistrict = "";
                postData.buyerAdress = adres;
                postData.buyerIp = ip;
                postData.currency = "USD"; //TRY,EUR,USD
                postData.locale = locale; //en,de,ru


                postData.orderPrice = formattedPrice;
                postData.productName = "VIZE BASVURU";
                postData.productType = "DIJITAL_URUN";
                postData.productsTotalPrice = formattedPrice;

                ValletRequest valletRequest = new ValletRequest(valletConfig);
                string postDatajson = JsonConvert.SerializeObject(postData);

                bool donen = sql.SP_INS_LOG_VIZE(guid, "OdemeSayfasi", "POSTDATA OLUŞTURULDU:  " + postDatajson);

                var r = valletRequest.Create_payment_link(postData);


                sql.SP_INS_LOG_VIZE(guid, "OdemeSayfasi", "RESPONSE DONEN CEVAP:  " + r.ToString());


                string responseText = r.ToString().Trim();
                if (responseText.StartsWith("{") || responseText.StartsWith("["))
                {
                    var json = JValue.Parse(responseText);
                    // Yeni format: paymentLink, Eski format: payment_page_url
                    string payment_page_url = null;
                    if (json["payment_page_url"] != null)
                    {
                        payment_page_url = json["payment_page_url"].ToString();
                    }
                    else if (json["paymentLink"] != null)
                    {
                        payment_page_url = json["paymentLink"].ToString();
                    }

                    if (!string.IsNullOrEmpty(payment_page_url) && payment_page_url != "yok")
                    {
                        return Redirect(payment_page_url);
                    }
                    else
                    {
                        if (json["errorMessage"] != null)
                        {
                            return Json(new { errorMessage = json["errorMessage"].ToString() });
                        }
                        else if (json["message"] != null)
                        {
                            return Json(new { message = json["message"].ToString() });
                        }
                        else
                        {
                            return Json(new { message = "No error" });
                        }
                    }
                }
                else if (responseText.StartsWith("<!DOCTYPE html") || responseText.StartsWith("<html"))
                {
                    return Content(responseText, "text/html");
                }
                else
                {
                    sql.SP_INS_LOG_VIZE(guid, "OdemeSayfasi", "Bilinmeyen formatta cevap: " + responseText);
                    return Content("Servisten beklenmeyen formatta yanıt alındı.");
                }
            }
            return View();
        }
        public IActionResult GPayResult(string payload)
        {
            string guid = "";
            try
            {
                if (!string.IsNullOrEmpty(payload))
                {
                    var urlDecoded = System.Net.WebUtility.UrlDecode(payload);
                    var base64Decoded = System.Convert.FromBase64String(urlDecoded);
                    var jsonString = System.Text.Encoding.UTF8.GetString(base64Decoded);

                    // GPay payload JSON'u
                    dynamic jsonObj = JsonConvert.DeserializeObject(jsonString);

                    // Logla
                    sql.SP_INS_LOG_VIZE(guid, "GPayResult", "GELEN CEVAP:  " + jsonString);

                    // GPay payload alanları
                    string status = jsonObj.status;
                    string transactionId = jsonObj.transactionId;
                    string refNo = jsonObj["ref"] != null ? jsonObj["ref"].ToString() : "";
                    decimal amount = jsonObj.amount;

                    // Kendi sisteminde ilgili başvuruyu güncelle
                    // (örnek: status == "successful" ise POS'u güncelle)
                    if (status == "completed")
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(refNo), 5, status, amount);
                        sql.SP_INS_LOG_VIZE(guid, "GPayResult", "POS GÜNCELLENDİ.(BAŞARILI)  :  " + status);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(refNo), 5, amount);
                    }
                    else if (status == "failed" || status == "error")
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(refNo), 4, status, amount);
                        sql.SP_INS_LOG_VIZE(guid, "GPayResult", "POS GÜNCELLENDİ.(BAŞARISIZ)  :  " + status);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(refNo), 4, amount);
                    }
                    // Diğer durumlar için de benzer şekilde...

                    ViewBag.mesaj = "OK";
                    return View();
                }
                else
                {
                    sql.SP_INS_LOG_VIZE(guid, "GPayResult", "payload BOŞ GELDİ!!!  :  ");
                    return Content("Payload yok!");
                }
            }
            catch (Exception ex)
            {
                sql.SP_INS_LOG_VIZE(guid, "GPayResult", " HATA!!! :  " + ex);
                throw;
            }
        }

        public IActionResult ValletResaultPage(ValletPosResponse valletPosResponse)
        {
            //pos_hareket log koy.
            string guid = "";
            try
            {
                if (valletPosResponse != null)
                {
                    string postDatajson = JsonConvert.SerializeObject(valletPosResponse);
                    bool donen = sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "GELEN CEVAP:  " + postDatajson);

                    guid = valletPosResponse.OrderId.ToString();
                    string insertId = valletPosResponse.ConversationId.ToString();
                    string paymentStatus = valletPosResponse.PaymentStatus.ToString();
                    decimal paymentAmount = valletPosResponse.PaymentAmount;

                    bool donen1 = sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "ValletResaultPage Başlıyor  :  ");

                    if (paymentStatus == "paymentOk") //basarili islem
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(insertId), 5, paymentStatus, paymentAmount);
                        sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "POS GÜNCELLENDİ.(BAŞARILI)  :  " + paymentStatus);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(insertId), 5, paymentAmount);

                    }
                    else if (paymentStatus == "paymentNotPaid")  //basarisiz islem
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(insertId), 4, paymentStatus, paymentAmount);
                        sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "POS GÜNCELLENDİ.(BAŞARISIZ)  :  " + paymentStatus);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(insertId), 4, paymentAmount);

                    }
                    else if (paymentStatus == "paymentVerification") //islemde
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(insertId), 1, paymentStatus, paymentAmount);
                        sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "POS GÜNCELLENDİ.(İŞLEMDE)  :  " + paymentStatus);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(insertId), 1, paymentAmount);
                    }
                    else if (paymentStatus == "paymentWait") //islemde
                    {
                        sql.SP_UPT_POS(Convert.ToInt32(insertId), 1, paymentStatus, paymentAmount);
                        sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "POS GÜNCELLENDİ.(İŞLEMDE)  :  " + paymentStatus);
                        sql.SP_INS_POS_HAREKET(Convert.ToInt32(insertId), 1, paymentAmount);
                    }
                    else
                    {
                        bool donen2 = sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "paymentStatus gelmedi!!!  :  ");
                    }
                }
                else
                {
                    bool donen = sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", "valletPosResponse  BOŞ GELDİ!!!  :  ");
                }
            }
            catch (Exception ex)
            {
                bool donen = sql.SP_INS_LOG_VIZE(guid, "ValletResaultPage", " ValletResaultPage HATA!!! :  " + ex);
                throw;
            }

            ViewBag.mesaj = "OK";
            return View();
        }
        public IActionResult OdemeBasarili(string payload)
        {
            string guid = Request.Cookies["guid"].ToString();
            string pos_id = Request.Cookies["insertId"].ToString();
            if (string.IsNullOrEmpty(payload))
            {
                return Content("Payload yok!");
            }



            try
            {
                // 1. URL Decode (gerekirse)
                var urlDecoded = System.Net.WebUtility.UrlDecode(payload);

                // 2. Base64 Decode
                var base64Decoded = Convert.FromBase64String(urlDecoded);

                // 3. JSON Parse
                var jsonString = System.Text.Encoding.UTF8.GetString(base64Decoded);
                dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonString);

                // 4. Logla ve işle
                sql.SP_INS_LOG_VIZE(guid, "OdemeBasarili", "Odeme Basarili  :  " + pos_id);

                string status = jsonObj.status;
                string transactionId = jsonObj.transactionId;
                string refNo = jsonObj["ref"] != null ? jsonObj["ref"].ToString() : "";
                decimal amount = jsonObj.amount;


                int sigorta_fiyat_id = 0;
                string gun = "";
                DataSet SP_SLC_BASVURU = null;

                SP_SLC_BASVURU = sql.SP_SLC_BASVURU(guid);
                sigorta_fiyat_id = Convert.ToInt32(SP_SLC_BASVURU.Tables[0].Rows[0]["sigorta_fiyat_id"]);
                if (sigorta_fiyat_id != -1)
                {
                    DataSet SP_SLC_SIGORTA_FIYAT_WID = sql.SP_SLC_SIGORTA_FIYAT_WID(Convert.ToInt32(sigorta_fiyat_id));
                    gun = SP_SLC_SIGORTA_FIYAT_WID.Tables[0].Rows[0]["gun"].ToString();
                }
                sql.SP_UPT_POS(Convert.ToInt32(pos_id), 3, "OdemeBasariliCnt", 0);
                sql.SP_INS_LOG_VIZE(guid, "OdemeBasarili", "POS GÜNCELLENDİ.(OdemeBasariliCnt)  :  ");
                sql.SP_INS_POS_HAREKET(Convert.ToInt32(pos_id), 3, 0);

                ViewBag.SP_SLC_BASVURU = SP_SLC_BASVURU;
                ViewBag.gun = gun;

                return View();
            }
            catch (Exception ex)
            {
                // sql.SP_INS_LOG_VIZE("", "GPayResult", " HATA!!! :  " + ex);
                return Content("Hata oluştu: " + ex.Message);
            }
        }
        public IActionResult OdemeBasarisiz(string payload)
        {
            string guid = Request.Cookies["guid"].ToString();
            string pos_id = Request.Cookies["insertId"].ToString();

            if (string.IsNullOrEmpty(payload))
            {
                // Logla ve hata dön
                return Content("Payload yok!");
            }

            try
            {
                // 1. URL Decode (gerekirse)
                var urlDecoded = System.Net.WebUtility.UrlDecode(payload);

                // 2. Base64 Decode
                var base64Decoded = Convert.FromBase64String(urlDecoded);

                // 3. JSON Parse
                var jsonString = System.Text.Encoding.UTF8.GetString(base64Decoded);
                dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonString);

                // 4. Logla ve işle
                string status = jsonObj.status;
                string transactionId = jsonObj.transactionId;
                string refNo = jsonObj["ref"] != null ? jsonObj["ref"].ToString() : "";
                decimal amount = jsonObj.amount ?? 0;

                // POS'u ve logları güncelle (başarısız)
                if (!string.IsNullOrEmpty(refNo))
                {
                    sql.SP_UPT_POS(Convert.ToInt32(pos_id), 4, "OdemeBasarisizCnt", 0);
                    sql.SP_INS_LOG_VIZE(guid, "OdemeBasarisiz", "Odeme Basarisiz!!!  :  " + pos_id);
                    sql.SP_INS_POS_HAREKET(Convert.ToInt32(pos_id), 4, 0);
                }

                return View();
            }
            catch (Exception ex)
            {
                // Hata logla
                sql.SP_INS_LOG_VIZE("", "OdemeBasarisiz", "HATA!!! :  " + ex);
                return Content("Hata oluştu: " + ex.Message);
            }
        }
    }
}
