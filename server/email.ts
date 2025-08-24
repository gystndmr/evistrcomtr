import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';

// SendGrid API anahtarını ayarla
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Dedicated function for admin copy emails
async function sendAdminCopyEmail(originalSubject: string, customerEmail: string, emailType: string, originalContent: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('🚨 SENDGRID_API_KEY bulunamadı');
    return false;
  }

  try {
    console.log('🚨 BAŞLAT: Admin kopya email gönderimi...');
    
    // Create a completely independent message
    const adminMessage = {
      to: 'kehfturizm.tr@gmail.com',
      from: {
        email: 'info@getvisa.tr',
        name: 'GetVisa Admin Notifications'
      },
      subject: `🚨 ${emailType} KOPYA: ${originalSubject}`,
      text: `Administrative Notification - ${emailType} Application Copy

Customer Email: ${customerEmail}
Application Type: ${emailType}
Original Subject: ${originalSubject}

This is an automated administrative copy from the Turkey E-Visa Application System.

GetVisa Admin System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📧 YENİ BAŞVURU KOPYA</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">${emailType} BAŞVURU KOPYASI</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-left: 5px solid #dc3545;">
            <h3 style="color: #dc3545; margin-top: 0;">Application Details:</h3>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            <p><strong>Application Type:</strong> ${emailType.toUpperCase()}</p>
            <p><strong>Original Subject:</strong> ${originalSubject}</p>
            <p><strong>Admin Email:</strong> kehfturizm.tr@gmail.com</p>
            <p><strong>Notification Time:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          </div>
          <div style="padding: 20px; background: white; border: 1px solid #dee2e6;">
            <h3>Original Email Content:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
              ${originalContent || '<p>Original email content not available</p>'}
            </div>
          </div>
          <div style="background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            GetVisa.tr Admin Copy System - ${new Date().toISOString()}
          </div>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High', 
        'Importance': 'high',
        'X-Mailer': 'GetVisa Admin System'
      }
    };

    console.log('🚨 Admin email içeriği hazırlandı:', {
      to: adminMessage.to,
      from: adminMessage.from,
      subject: adminMessage.subject,
      hasText: !!adminMessage.text,
      hasHtml: !!adminMessage.html
    });

    // Use the existing SendGrid instance
    const result = await sgMail.send(adminMessage);
    console.log('🚨 SUCCESS: Admin kopya email gönderildi!', result[0]?.statusCode);
    console.log('🚨 Admin Message ID:', result[0]?.headers?.['x-message-id']);
    
    return true;
  } catch (error: any) {
    console.error('🚨 HATA: Admin kopya email gönderilemedi:', error);
    console.error('🚨 Error details:', error.response?.body || error.message);
    return false;
  }
}

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string[];
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

// PDF dosyasını base64 olarak ekleme fonksiyonu
function createPdfAttachment(filePath: string, fileName: string) {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);
      const base64Content = fileContent.toString('base64');
      return {
        content: base64Content,
        filename: fileName,
        type: 'application/pdf',
        disposition: 'attachment'
      };
    }
  } catch (error) {
    console.error('❌ PDF attachment error:', error);
  }
  return null;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  console.log('🔧 SendGrid sendEmail function called');
  console.log('🔧 API Key length:', process.env.SENDGRID_API_KEY?.length || 0);
  console.log('🔧 To address:', options.to);
  console.log('🔧 Subject:', options.subject);
  
  // TEST: Use verified SendGrid sender
  const fromEmail = "noreply@getvisa.tr";
  
  console.log('🔧 From address (FIXED to info@getvisa.tr):', fromEmail);
  
  let customerSuccess = false;
  
  // 1. Müşteriye ana email gönder
  try {
    const customerEmailOptions = {
      ...options,
      from: fromEmail
    };
    
    const customerResult = await sgMail.send(customerEmailOptions);
    console.log('✅ Customer email sent successfully:', customerResult[0]?.statusCode);
    customerSuccess = true;
  } catch (customerError: any) {
    console.error('❌ Customer email error:', customerError);
    console.error('❌ Customer SendGrid error message:', customerError.message);
    console.error('❌ Customer SendGrid error response:', customerError.response?.body);
  }
  
  // 2. Use dedicated admin copy function - ALWAYS RUN
  try {
    const isVisaEmail = options.subject.includes('E-Visa');
    const isInsuranceEmail = options.subject.includes('Insurance');
    const emailType = isVisaEmail ? 'VISA' : (isInsuranceEmail ? 'INSURANCE' : 'APPLICATION');
    
    // Add delay before admin notification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🚨 BAŞLAT: Dedicated admin copy function çağrılıyor...');
    const adminSuccess = await sendAdminCopyEmail(
      options.subject,
      options.to,
      emailType,
      options.html
    );
    
    if (adminSuccess) {
      console.log('🚨 SUCCESS: Dedicated admin copy email sistemi başarılı!');
    } else {
      console.log('🚨 WARNING: Dedicated admin copy email sistemi başarısız!');
    }
    
    if (customerSuccess) {
      console.log('✅ Both emails sent - Customer and DEDICATED Admin Copy');
    } else {
      console.log('✅ DEDICATED Admin Copy sent, but customer email failed');
    }
  } catch (copyError) {
    console.error('❌ Error in dedicated admin copy system:', copyError);
    if (customerSuccess) {
      console.log('✅ Customer email still sent successfully');
    } else {
      console.log('❌ Both customer and admin copy emails failed');
    }
  }
  
  // Only throw error if customer email failed AND it's a critical failure
  if (!customerSuccess) {
    throw new Error('Customer email delivery failed');
  }
}

export function generateVisaReceivedEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  applicationData: any,
  language: string = 'en'
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

  return {
    subject: `[${applicationNumber}] Turkey E-Visa Application Received`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Visa Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY E VISA</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #dee2e6;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>Your Turkey Visa application has been successfully received and recorded.</strong><br>
                <span style="color: #666; font-size: 14px;">Your application has been forwarded for evaluation.</span>
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

            <!-- Visa Information -->
            <div style="background-color: #fef2f2; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #DC2626;">
              <h3 style="color: #DC2626; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">🇹🇷 VISA APPLICATION DETAILS</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Full Name:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${firstName} ${lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Passport Number:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.passportNumber || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Date of Birth:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).toLocaleDateString('en-US') : 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Country of Origin:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.countryOfOrigin || 'Not specified'}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Arrival Date:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString('en-US') : 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Processing Type:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; text-transform: capitalize;">${applicationData.processingType || 'Standard'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Total Amount:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">$${applicationData.totalAmount || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Status:</td>
                      <td style="padding: 12px 0; color: #f59e0b; font-weight: bold;">⏳ UNDER REVIEW</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              ${applicationData.placeOfBirth || applicationData.motherName || applicationData.fatherName || applicationData.address ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #fecaca;">
                <h4 style="color: #DC2626; margin: 0 0 15px 0; font-size: 16px;">👤 PERSONAL INFORMATION</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  ${applicationData.placeOfBirth ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold; width: 30%;">Place of Birth:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.placeOfBirth}</td>
                  </tr>` : ''}
                  ${applicationData.motherName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Mother's Name:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.motherName}</td>
                  </tr>` : ''}
                  ${applicationData.fatherName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Father's Name:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.fatherName}</td>
                  </tr>` : ''}
                  ${applicationData.address ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Address:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.address}</td>
                  </tr>` : ''}
                </table>
              </div>` : ''}
              
              ${applicationData.supportingDocumentType ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #fecaca;">
                <h4 style="color: #DC2626; margin: 0 0 15px 0; font-size: 16px;">📄 SUPPORTING DOCUMENTS</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold; width: 30%;">Document Type:</td>
                    <td style="padding: 8px 0; color: #1a1a1a; text-transform: capitalize;">${applicationData.supportingDocumentType}</td>
                  </tr>
                  ${applicationData.supportingDocumentNumber ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Document Number:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.supportingDocumentNumber}</td>
                  </tr>` : ''}
                  ${applicationData.supportingDocumentStartDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Valid From:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${new Date(applicationData.supportingDocumentStartDate).toLocaleDateString('en-US')}</td>
                  </tr>` : ''}
                  ${applicationData.supportingDocumentEndDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Valid Until:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${new Date(applicationData.supportingDocumentEndDate).toLocaleDateString('en-US')}</td>
                  </tr>` : ''}
                </table>
              </div>` : ''}
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                <strong>⚠️ Important Information:</strong><br>
                • Your e-visa application evaluation takes 3-5 business days<br>
                • You can check the current status using your application number<br>
                • When your e-visa is approved, you will receive your electronic visa via email<br>
                • Processing time may vary based on the selected processing type
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔍 Check Application Status
              </a>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1;">
              <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 16px;">📱 Quick Status Check:</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Visit <strong>https://getvisa.tr/status</strong> and enter your application number:<br>
                <span style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #1e293b;">${applicationNumber}</span>
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">💬 Customer Service:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you have any questions, please visit our website or contact our support team. We're here to help you throughout the application process.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">© 2025 EURAMED LTD - Turkey Visa Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
TURKEY E-ELECTRONIC VISA APPLICATION SYSTEM

Dear ${firstName} ${lastName},

Your Turkey Visa application has been successfully received and recorded.

APPLICATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Application Reference No: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Passport Number: ${applicationData.passportNumber || 'Not specified'}
Date of Birth: ${applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).toLocaleDateString('en-US') : 'Not specified'}
Country of Origin: ${applicationData.countryOfOrigin || 'Not specified'}
Arrival Date: ${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString('en-US') : 'Not specified'}
Processing Type: ${applicationData.processingType || 'Standard'}
Total Amount: $${applicationData.totalAmount || 'Not specified'}
Status: UNDER REVIEW
Application Date: ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT INFORMATION:
• Your e-visa application evaluation takes 3-5 business days
• You can check the current status using your application number
• When your e-visa is approved, you will receive your electronic visa via email
• Processing time may vary based on the selected processing type

CHECK STATUS: https://getvisa.tr/status?ref=${applicationNumber}

Best regards,
Turkey E-Visa Services Team

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}

export function generateVisaRejectionEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  rejectionReason: string = "Your application did not meet the requirements."
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

  return {
    subject: `[${applicationNumber}] Turkey E-Visa Application - Status Update`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Visa Application Status</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY E VISA</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #f87171;">
              <p style="color: #991b1b; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>We regret to inform you that your Turkey Visa application has been reviewed and unfortunately cannot be approved at this time.</strong>
              </p>
            </div>
            
            <!-- Application Summary -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">📋 APPLICATION REFERENCE</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${applicationNumber}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Status: REJECTED</p>
              </div>
            </div>
            
            <!-- Rejection Reason -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">📝 Reason for Rejection:</h4>
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                ${rejectionReason}
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📞 Next Steps:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you believe this decision was made in error, or if you would like to reapply with additional documentation, please contact our support team. We're here to help you with your Turkey visa application process.
              </p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1;">
              <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 16px;">💬 Customer Service:</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                📧 Email: info@euramedglobal.com<br>
                🌐 Website: https://getvisa.tr<br>
                📱 24/7 Customer Service Available
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">© 2025 EURAMED LTD - Turkey Visa Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
TURKEY E-ELECTRONIC VISA APPLICATION SYSTEM

Dear ${firstName} ${lastName},

We regret to inform you that your Turkey Visa application has been reviewed and unfortunately cannot be approved at this time.

APPLICATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Application Reference No: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Status: REJECTED
Review Date: ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REASON FOR REJECTION:
${rejectionReason}

NEXT STEPS:
If you believe this decision was made in error, or if you would like to reapply with additional documentation, please contact our support team.

CUSTOMER SERVICE:
Email: info@euramedglobal.com
Website: https://getvisa.tr
24/7 Customer Service Available

Best regards,
Turkey E-Visa Services Team

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}


export function generateVisaApprovalEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  pdfAttachment?: string,
  language: string = 'en'
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

  return {
    subject: `[${applicationNumber}] Turkey E-Visa Application APPROVED`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Turkey E-Visa Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY E VISA</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Success Banner -->
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 25px; text-align: center; border-bottom: 3px solid #047857;">
            <h2 style="margin: 0; font-size: 28px; font-weight: bold;">✅ APPROVED</h2>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.95;">Your Turkey E-Visa has been approved!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <p style="color: #1a1a1a; line-height: 1.7; margin-bottom: 20px; font-size: 16px;">
              <strong>Congratulations!</strong> Your Turkey Visa application has been <span style="color: #10B981; font-weight: bold;">APPROVED</span> and is ready for use.
            </p>
            
            <!-- Application Details -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #DC2626;">
              <h3 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px;">📋 Visa Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Application Number:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${applicationNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Visa Holder:</td>
                  <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0; color: #10B981; font-weight: bold;">APPROVED</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Issue Date:</td>
                  <td style="padding: 8px 0; color: #1a1a1a;">${new Date().toLocaleDateString('en-US')}</td>
                </tr>
              </table>
            </div>
            
            ${pdfAttachment ? `
            <!-- PDF Attachment Notice -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 25px; margin: 25px 0; border-radius: 8px;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📎 Your E-Visa Document</h3>
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                • Your official e-visa document is <strong>attached to this email as a PDF</strong><br>
                • Please <strong>download and print</strong> your e-visa before traveling to Turkey<br>
                • You must present the <strong>printed e-visa along with your passport</strong> at the Turkish border<br>
                • Keep both digital and printed copies for your travel records
              </p>
            </div>
            ` : ''}
            
            <!-- Important Instructions -->
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 25px; margin: 25px 0; border-radius: 8px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">🛂 Travel Instructions</h3>
              <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
                • Present your printed e-visa and passport to Turkish immigration<br>
                • Ensure your passport is valid for at least 6 months from entry date<br>
                • Your e-visa allows single or multiple entries as specified<br>
                • Keep your e-visa document accessible during your entire stay
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://getvisa.tr/api/download/visa/${applicationNumber}" style="background-color: #10B981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                📄 Download E-Visa
              </a>
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                🔍 Check Status
              </a>
            </div>
            
            <!-- Contact Information -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 6px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                <strong>Need assistance?</strong><br>
                Contact us at <a href="mailto:info@euramedglobal.com" style="color: #DC2626;">info@euramedglobal.com</a><br>
                Visit: <a href="https://getvisa.tr" style="color: #DC2626;">getvisa.tr</a>
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
              Have a wonderful trip to Turkey! 🇹🇷<br>
              <em>This is an automated email. Please do not reply to this message.</em>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 EURAMED LTD - Turkey Visa Services</p>
            
            <p style="margin: 10px 0 0 0; font-size: 11px;">
              EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
[APPROVED] Turkey E-Visa Application ${applicationNumber}

Dear ${firstName} ${lastName},

Congratulations! Your Turkey Visa has been APPROVED.

Visa Details:
- Application Number: ${applicationNumber}
- Visa Holder: ${firstName} ${lastName}
- Status: APPROVED
- Issue Date: ${new Date().toLocaleDateString('en-US')}

${pdfAttachment ? `
IMPORTANT: Your official e-visa document is attached to this email as a PDF.
- Download and print your e-visa before traveling
- Present the printed e-visa along with your passport at the Turkish border
- Keep both digital and printed copies for your records
` : ''}

Travel Instructions:
- Present your printed e-visa and passport to Turkish immigration
- Ensure your passport is valid for at least 6 months from entry date
- Your e-visa allows entry as specified in the document
- Keep your e-visa accessible during your entire stay

Download your e-visa: https://getvisa.tr/status?ref=${applicationNumber}
Check status: https://getvisa.tr/status?ref=${applicationNumber}

Contact: info@euramedglobal.com
Website: getvisa.tr

Have a wonderful trip to Turkey!

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr


This is an automated email. Please do not reply to this message.
    `
  };
}

export function generateInsuranceReceivedEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  productName: string,
  applicationData: any,
  language: string = 'en'
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

  return {
    subject: `[${applicationNumber}] Turkey Travel Insurance Application Received`,
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
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY TRAVEL INSURANCE</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">TRAVEL INSURANCE SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #dee2e6;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>Your Turkey Travel Insurance application has been successfully received and recorded.</strong><br>
                <span style="color: #666; font-size: 14px;">Your application has been forwarded for evaluation.</span>
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔍 Check Application Status
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${firstName} ${lastName},

Your Turkey Travel Insurance application has been successfully received and recorded.

Application Number: ${applicationNumber}

You can check your application status at: https://getvisa.tr/status?ref=${applicationNumber}
    `
  };
}

export function generateInsuranceApprovalEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  productName: string,
  pdfAttachment?: string
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

  return {
    subject: `[${applicationNumber}] Turkey Travel Insurance Approved - Your Policy is Ready`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Turkey Travel Insurance Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">✅ TURKEY TRAVEL INSURANCE APPROVED</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">TRAVEL INSURANCE SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #0284c7;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>🎉 Congratulations! Your Turkey Travel Insurance has been APPROVED and is ready for use.</strong><br>
                <span style="color: #0369a1; font-size: 14px;">Your insurance policy is attached to this email or can be downloaded below.</span>
              </p>
            </div>
            
            <!-- Insurance Information -->
            <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">📋 INSURANCE POLICY DETAILS</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <table style="width: 100%; border-collapse: collapse; color: white;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Application Number:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: monospace; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Policy Holder:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Insurance Package:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Status:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #86efac;">✅ APPROVED</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Issue Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString('en-US')}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            ${pdfAttachment ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                <strong>📎 Important:</strong><br>
                • Your official insurance policy is attached to this email as a PDF<br>
                • Please download and print your policy before traveling<br>
                • Carry the printed policy with you during your trip to Turkey
              </p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/api/download/insurance/${applicationNumber}" style="background-color: #0284c7; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                📄 Download Policy
              </a>
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                🔍 Check Status
              </a>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">💬 Customer Support:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you have any questions about your insurance policy or need assistance:<br>
                📧 Email: info@euramedglobal.com<br>
                🌐 Website: https://getvisa.tr<br>
                📱 24/7 Customer Service Available
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">© 2025 EURAMED LTD - Turkey Travel Insurance Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${firstName} ${lastName},

Congratulations! Your Turkey Travel Insurance has been APPROVED.

Application Number: ${applicationNumber}
Policy Holder: ${firstName} ${lastName}
Insurance Package: ${productName}
Status: APPROVED
Issue Date: ${new Date().toLocaleDateString('en-US')}

Download your policy at: https://getvisa.tr/status?ref=${applicationNumber}

This email was sent automatically. For questions, contact us at info@euramedglobal.com

---
EURAMED LTD - Turkey Travel Insurance Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}