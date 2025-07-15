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
    const fromEmail = 'info@evisatr.xyz'; // SendGrid'de doğrulanmış domain olmalı
    
    await sgMail.send({
      to: params.to,
      from: fromEmail,
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
      subject: "Türkiye E-Vize Başvurunuz Alındı",
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
              <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: bold;">TÜRKİYE CUMHURİYETİ</h1>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">E-Vize Başvuru Sistemi</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 20px;">Sayın ${firstName} ${lastName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                Türkiye Cumhuriyeti E-Vize başvurunuz başarıyla alınmıştır. 
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
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Durum:</td>
                    <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">⏳ İNCELENİYOR</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                  <strong>Bilgilendirme:</strong> Başvurunuzun işlem süreci hakkında bilgi almak için başvuru numaranızı kullanarak sorgulama yapabilirsiniz.
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
                © 2025 Türkiye Cumhuriyeti E-Vize Sistemi
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Sayın ${firstName} ${lastName},

Türkiye Cumhuriyeti E-Vize başvurunuz başarıyla alınmıştır.

Başvuru Numarası: ${applicationNumber}
Başvuru Sahibi: ${firstName} ${lastName}
Durum: ONAYLANDI

E-vizenizi web sitemizden indirip yazdırmanız ve seyahat sırasında yanınızda bulundurmanız gerekmektedir.

Herhangi bir sorunuz olması halinde müşteri hizmetlerimizle iletişime geçebilirsiniz.

Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
© 2025 Türkiye Cumhuriyeti E-Vize Sistemi
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