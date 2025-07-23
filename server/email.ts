import sgMail from '@sendgrid/mail';

// SendGrid API anahtarını ayarla
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await sgMail.send(options);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY E-VISA</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #dee2e6;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>Your Turkey Electronic Visa application has been successfully received and recorded.</strong><br>
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

Your Turkey Electronic Visa application has been successfully received and recorded.

Application Number: ${applicationNumber}

You can check your application status at: https://getvisa.tr/status?ref=${applicationNumber}
    `
  };
}

export function generateVisaApprovalEmail(
  firstName: string,
  lastName: string,
  applicationNumber: string,
  pdfAttachment?: string
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
    subject: `[${applicationNumber}] Turkey E-Visa Approved - Your E-Visa is Ready`,
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
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">✅ TURKEY E-VISA APPROVED</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">ELECTRONIC VISA SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #dcfdf7 0%, #bbf7d0 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #10B981;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>🎉 Congratulations! Your Turkey Electronic Visa has been APPROVED and is ready for use.</strong><br>
                <span style="color: #047857; font-size: 14px;">Your e-visa document is attached to this email or can be downloaded below.</span>
              </p>
            </div>
            
            <!-- Visa Information -->
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">📋 E-VISA DETAILS</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <table style="width: 100%; border-collapse: collapse; color: white;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Application Number:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: monospace; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Visa Holder:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${firstName} ${lastName}</td>
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
                • Your official e-visa document is attached to this email as a PDF<br>
                • Please download and print your e-visa before traveling<br>
                • You must present the printed e-visa along with your passport at the Turkish border
              </p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #10B981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                📄 Download E-Visa
              </a>
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                🔍 Check Status
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${firstName} ${lastName},

Congratulations! Your Turkey Electronic Visa has been APPROVED.

Application Number: ${applicationNumber}
Visa Holder: ${firstName} ${lastName}
Status: APPROVED
Issue Date: ${new Date().toLocaleDateString('en-US')}

Download your e-visa at: https://getvisa.tr/status?ref=${applicationNumber}

This email was sent automatically. For questions, contact us at info@getvisa.tr
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
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #0284c7; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
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
                📧 Email: info@getvisa.tr<br>
                🌐 Website: https://getvisa.tr<br>
                📱 24/7 Customer Service Available
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

This email was sent automatically. For questions, contact us at info@getvisa.tr
    `
  };
}