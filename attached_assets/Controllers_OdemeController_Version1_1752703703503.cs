// Dosya içeriği ZIP'ten çıkarılmıştır. 
// Türkçeleştirilmiş ve hassas olmayan alanlar öne çıkarılmıştır.

using Microsoft.AspNetCore.Mvc;

namespace evisa.Controllers
{
    public class OdemeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult OdemeYap(decimal tutar, string kartNo, string sonKullanmaTarihi, string cvc)
        {
            // Basit örnek ödeme işlemi (dummy, gerçek API entegrasyonu değildir)
            bool sonuc = false;
            string mesaj = "";

            if (!string.IsNullOrEmpty(kartNo) && kartNo.Length == 16 && !string.IsNullOrEmpty(sonKullanmaTarihi) && !string.IsNullOrEmpty(cvc))
            {
                // Buraya gerçek ödeme API entegrasyonu kodu eklenecek
                // Örn: Iyzico, PayTR, Stripe, vb.

                sonuc = true;
                mesaj = "Ödeme başarılı!";
            }
            else
            {
                mesaj = "Kart bilgileri hatalı!";
            }

            ViewBag.Sonuc = sonuc;
            ViewBag.Mesaj = mesaj;
            return View("Index");
        }
    }
}