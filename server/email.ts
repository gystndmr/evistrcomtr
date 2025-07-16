import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // SendGrid doğrulanmış gönderen e-postası gerektirir
    const fromEmail = 'info@em7659.visatanzania.org'; // Geçici: DNS propagate olana kadar
    
    await sgMail.send({
      to: params.to,
      from: {
        email: fromEmail,
        name: 'Turkey E-Visa System (evisatr.xyz)'
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    
    // Hata detaylarını yazdır
    if (error.response && error.response.body) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body, null, 2));
    }
    
    // Hata durumunda e-posta içeriğini konsola yazdıralım
    console.log('Email details:');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('Text:', params.text?.substring(0, 200) + '...');
    
    return false;
  }
}

export function generateVisaReceivedEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  applicationData: any,
  language: string = 'tr'
): { subject: string; html: string; text: string } {
  
  const turkeyFlagSvg = `
    <svg width="40" height="30" viewBox="0 0 40 30" style="margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <rect width="40" height="30" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="12" cy="15" r="5"/>
        <circle cx="14" cy="15" r="4" fill="#E30A17"/>
        <path d="M22 10 L24.5 12.5 L27 10 L25.5 13.5 L29 15 L25.5 16.5 L27 20 L24.5 17.5 L22 20 L23.5 16.5 L20 15 L23.5 13.5 Z"/>
      </g>
    </svg>
  `;

  if (language === 'en') {
    return {
      subject: `[${applicationNumber}] Turkey E-Visa Application Received`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Vize Onayı</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">REPUBLIC OF TURKEY</h1>
              <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Official Government Portal - evisatr.xyz</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
              
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #dee2e6;">
                <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                  <strong>Your Republic of Turkey Electronic Visa application has been successfully received and recorded.</strong><br>
                  <span style="color: #666; font-size: 14px;">Your application has been forwarded to the Ministry of Interior for evaluation.</span>
                </p>
              </div>
              
              <!-- Application Summary -->
              <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">📋 APPLICATION SUMMARY</h3>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                  <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${applicationNumber}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Application Reference Number</p>
                </div>
              </div>

              <!-- Personal Information -->
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">👤 PERSONAL INFORMATION</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Full Name:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${firstName} ${lastName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Date of Birth:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).toLocaleDateString('en-US') : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Gender:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.gender === 'male' ? 'Male' : applicationData.gender === 'female' ? 'Female' : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Nationality:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.nationality || 'Not specified'}</td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Email:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.email || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Phone:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.phone || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Passport No:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.passportNumber || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Document Type:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.documentType === 'passport' ? 'Passport' : applicationData.documentType === 'id_card' ? 'ID Card' : 'Not specified'}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Travel Information -->
              <div style="background-color: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #0284c7;">
                <h3 style="color: #0284c7; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 10px;">✈️ TRAVEL INFORMATION</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Arrival Date:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString('en-US') : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Departure Date:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.departureDate ? new Date(applicationData.departureDate).toLocaleDateString('en-US') : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Duration of Stay:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.arrivalDate && applicationData.departureDate ? Math.ceil((new Date(applicationData.departureDate) - new Date(applicationData.arrivalDate)) / (1000 * 60 * 60 * 24)) + ' days' : 'Not specified'}</td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Purpose of Visit:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.purposeOfVisit === 'tourism' ? 'Tourism' : applicationData.purposeOfVisit === 'business' ? 'Business' : applicationData.purposeOfVisit === 'transit' ? 'Transit' : 'Other'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Accommodation:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.hasAccommodation ? 'Yes' : 'No'}</td>
                      </tr>
                      ${applicationData.accommodationDetails ? `
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Accommodation Details:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.accommodationDetails}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>
                </div>
              </div>

              <!-- Process Information -->
              <div style="background-color: #fef3c7; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">⚙️ PROCESSING INFORMATION</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Processing Type:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.processingType === 'standard' ? 'Standard Processing (1-3 days)' : applicationData.processingType === 'urgent' ? 'Urgent Processing (24 hours)' : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Application Status:</td>
                        <td style="padding: 12px 0; color: #f59e0b; font-weight: bold;">⏳ UNDER REVIEW</td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Total Amount:</td>
                        <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.totalAmount ? '$' + applicationData.totalAmount : 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #666; font-weight: bold;">Payment Method:</td>
                        <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.paymentMethod === 'credit_card' ? 'Credit Card' : applicationData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Not specified'}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f59e0b;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 22%;">Application Date:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                  <strong>⚠️ Important Information:</strong><br>
                  • Your application evaluation takes an average of 1-3 business days<br>
                  • You can check the current status of your application using your application number<br>
                  • When your e-visa is approved, you will be automatically notified via email
                </p>
              </div>
              
              <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px;">📋 Required Documents and Rules:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                  <li>Your passport must be valid for at least 60 days</li>
                  <li>You must print your e-visa and carry it with you during travel</li>
                  <li>You must present your e-visa along with your passport when entering Turkey</li>
                  <li>If your travel dates change, you may need to make a new application</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://evisatr.xyz/status" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                  🔍 Check Application Status
                </a>
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">💬 Customer Service:</h4>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  If you have any questions, please contact our <strong>24/7 customer service</strong>:<br>
                  📧 Email: info@evisatr.xyz<br>
                  🌐 Website: https://evisatr.xyz
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; border-top: 3px solid #DC2626;">
              <div style="margin-bottom: 20px;">
                ${turkeyFlagSvg}
              </div>
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">REPUBLIC OF TURKEY</h3>
                <p style="margin: 0; font-size: 16px; opacity: 0.9; font-weight: 500;">ELECTRONIC VISA SYSTEM</p>
              </div>
              
              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
                <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; flex-wrap: wrap;">
                  <div style="text-align: center; min-width: 200px;">
                    <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #DC2626;">Official Website</p>
                    <p style="margin: 0; font-size: 13px; opacity: 0.8;">https://evisatr.xyz</p>
                  </div>
                  <div style="text-align: center; min-width: 200px;">
                    <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #DC2626;">Customer Support</p>
                    <p style="margin: 0; font-size: 13px; opacity: 0.8;">info@evisatr.xyz</p>
                  </div>
                </div>
                
                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; margin-top: 15px;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; opacity: 0.7;">
                    This email was sent automatically. Please do not reply to this email.
                  </p>
                  <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                    © 2025 Republic of Turkey E-Visa System. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
TÜRKİYE CUMHURİYETİ E-VİZE SİSTEMİ

Sayın ${firstName} ${lastName},

Türkiye Cumhuriyeti Elektronik Vize başvurunuz başarıyla alınmış ve kayıt altına alınmıştır.

BAŞVURU DETAYLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Başvuru Referans No: ${applicationNumber}
Başvuru Sahibi: ${firstName} ${lastName}
Pasaport Numarası: ${applicationData.passportNumber || 'Belirtilmemiş'}
Uyruk: ${applicationData.nationality || 'Belirtilmemiş'}
Giriş Tarihi: ${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
Çıkış Tarihi: ${applicationData.departureDate ? new Date(applicationData.departureDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
Ziyaret Amacı: ${applicationData.purposeOfVisit === 'tourism' ? 'Turizm' : applicationData.purposeOfVisit === 'business' ? 'İş' : 'Diğer'}
İşlem Türü: ${applicationData.processingType === 'standard' ? 'Standart İşlem' : applicationData.processingType === 'urgent' ? 'Acil İşlem' : 'Belirtilmemiş'}
Başvuru Durumu: İNCELEME AŞAMASINDA
Başvuru Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ÖNEMLİ BİLGİLENDİRME:
• Başvurunuzun değerlendirilmesi ortalama 1-3 iş günü sürmektedir
• İşlem süreci hakkında güncel bilgi almak için başvuru numaranızı kullanarak sorgulama yapabilirsiniz
• E-vizeniz onaylandığında size otomatik olarak bilgilendirme e-postası gönderilecektir

GEREKLI BELGELER VE KURALLAR:
• Pasaportunuzun geçerlilik süresi en az 60 gün olmalıdır
• E-vizenizi yazdırıp seyahat sırasında yanınızda bulundurmanız zorunludur
• Türkiye'ye giriş sırasında pasaportunuzla birlikte e-vizenizi göstermelisiniz
• Seyahat tarihlerinizde değişiklik olması halinde yeni başvuru yapmanız gerekebilir

BAŞVURU DURUMU SORGULAMA:
https://evisatr.xyz/status

MÜŞTERİ HİZMETLERİ (7/24):
E-posta: info@evisatr.xyz
Web: https://evisatr.xyz

Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
© 2025 evisatr.xyz - Türkiye Cumhuriyeti E-Vize Sistemi
      `
    };
  } else {
    return {
      subject: "Your Turkey E-Visa Application Has Been Approved",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Visa Approval</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">REPUBLIC OF TURKEY</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">E-Visa Application System</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Dear ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Your Turkey E-Visa application has been successfully approved. 
                Your application details are provided below.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 16px;">Application Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Application Number:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Applicant:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">✓ APPROVED</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Important Note:</strong> You must download and print your e-visa from our website and carry it with you during your travel.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Download Your E-Visa
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If you have any questions, please contact our customer service.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                This email was sent automatically. Please do not reply.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                © 2025 Republic of Turkey E-Visa System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${firstName} ${lastName},

Your Turkey E-Visa application has been successfully approved.

Application Number: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Status: APPROVED

You must download and print your e-visa from our website and carry it with you during your travel.

If you have any questions, please contact our customer service.

This email was sent automatically. Please do not reply.
© 2025 Republic of Turkey E-Visa System
      `
    };
  }
}

export function generateInsuranceReceivedEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  productName: string,
  language: string = 'tr'
): { subject: string; html: string; text: string } {
  
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;

  if (language === 'tr') {
    return {
      subject: "Türkiye Seyahat Sigortası Başvurunuz Alındı",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sigorta Başvurusu Alındı</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">TÜRKİYE CUMHURİYETİ</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Seyahat Sigortası Sistemi</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Sayın ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Türkiye seyahat sigortası başvurunuz başarıyla alınmıştır. 
                Başvurunuz değerlendirilmek üzere sisteme kaydedilmiştir.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 16px;">Başvuru Bilgileri</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Başvuru Numarası:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Başvuru Sahibi:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Sigorta Ürünü:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Durum:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">⏳ İNCELENİYOR</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                  <strong>Bilgilendirme:</strong> Sigorta başvurunuzun durumu hakkında bilgi almak için başvuru numaranızı kullanarak sorgulama yapabilirsiniz.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Başvuru Durumunu Sorgula
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Herhangi bir sorunuz olması halinde müşteri hizmetlerimizle iletişime geçebilirsiniz.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                © 2025 Türkiye Cumhuriyeti Seyahat Sigortası Sistemi
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Sayın ${firstName} ${lastName},

Türkiye seyahat sigortası başvurunuz başarıyla alınmıştır.

Başvuru Numarası: ${applicationNumber}
Başvuru Sahibi: ${firstName} ${lastName}
Sigorta Ürünü: ${productName}
Durum: İNCELENİYOR

Sigorta başvurunuzun durumu hakkında bilgi almak için başvuru numaranızı kullanarak sorgulama yapabilirsiniz.

Herhangi bir sorunuz olması halinde müşteri hizmetlerimizle iletişime geçebilirsiniz.

Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
© 2025 Türkiye Cumhuriyeti Seyahat Sigortası Sistemi
      `
    };
  } else {
    return {
      subject: "Your Turkey Travel Insurance Application Received",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Insurance Application Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">REPUBLIC OF TURKEY</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Travel Insurance System</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Dear ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Your Turkey travel insurance application has been successfully received. 
                Your application has been registered in the system for evaluation.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 16px;">Application Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Application Number:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Applicant:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Insurance Product:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">⏳ UNDER REVIEW</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                  <strong>Information:</strong> You can check the status of your insurance application by using your application number.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Check Application Status
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If you have any questions, please contact our customer service.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                This email was sent automatically. Please do not reply.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                © 2025 Republic of Turkey Travel Insurance System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${firstName} ${lastName},

Your Turkey travel insurance application has been successfully received.

Application Number: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Insurance Product: ${productName}
Status: UNDER REVIEW

You can check the status of your insurance application by using your application number.

If you have any questions, please contact our customer service.

This email was sent automatically. Please do not reply.
© 2025 Republic of Turkey Travel Insurance System
      `
    };
  }
}

export function generateInsuranceApprovalEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  productName: string,
  language: string = 'tr'
): { subject: string; html: string; text: string } {
  
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;

  if (language === 'tr') {
    return {
      subject: "Seyahat Sigortası Başvurunuz Onaylandı",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sigorta Onayı</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">TÜRKİYE CUMHURİYETİ</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Seyahat Sigortası Sistemi</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Sayın ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Seyahat sigortası başvurunuz başarıyla alınmıştır. 
                Sigorta detaylarınız aşağıda yer almaktadır.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 16px;">Sigorta Bilgileri</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Başvuru Numarası:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Sigorta Sahibi:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Sigorta Paketi:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Durum:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">⏳ İNCELENİYOR</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Önemli Not:</strong> Sigorta poliçenizi web sitemizden indirip yazdırmanız ve seyahat sırasında yanınızda bulundurmanız gerekmektedir.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Poliçenizi İndirin
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Herhangi bir sorunuz olması halinde müşteri hizmetlerimizle iletişime geçebilirsiniz.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                © 2025 Türkiye Cumhuriyeti Seyahat Sigortası Sistemi
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Sayın ${firstName} ${lastName},

Seyahat sigortası başvurunuz başarıyla alınmıştır.

Başvuru Numarası: ${applicationNumber}
Sigorta Sahibi: ${firstName} ${lastName}
Sigorta Paketi: ${productName}
Durum: ONAYLANDI

Sigorta poliçenizi web sitemizden indirip yazdırmanız ve seyahat sırasında yanınızda bulundurmanız gerekmektedir.

Herhangi bir sorunuz olması halinde müşteri hizmetlerimizle iletişime geçebilirsiniz.

Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
© 2025 Türkiye Cumhuriyeti Seyahat Sigortası Sistemi
      `
    };
  } else {
    return {
      subject: "Your Travel Insurance Application Has Been Approved",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Insurance Approval</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
              ${turkeyFlagSvg}
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">REPUBLIC OF TURKEY</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Travel Insurance System</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Dear ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Your travel insurance application has been successfully approved. 
                Your insurance details are provided below.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #DC2626; margin-top: 0; font-size: 16px;">Insurance Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Application Number:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Policy Holder:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Insurance Package:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">✓ APPROVED</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Important Note:</strong> You must download and print your insurance policy from our website and carry it with you during your travel.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Download Your Policy
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If you have any questions, please contact our customer service.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                This email was sent automatically. Please do not reply.
              </p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                © 2025 Republic of Turkey Travel Insurance System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${firstName} ${lastName},

Your travel insurance application has been successfully approved.

Application Number: ${applicationNumber}
Policy Holder: ${firstName} ${lastName}
Insurance Package: ${productName}
Status: APPROVED

You must download and print your insurance policy from our website and carry it with you during your travel.

If you have any questions, please contact our customer service.

This email was sent automatically. Please do not reply.
© 2025 Republic of Turkey Travel Insurance System
      `
    };
  }
}