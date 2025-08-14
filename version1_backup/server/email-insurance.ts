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
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY INSURANCE</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">TURKEY INSURANCE SYSTEM</p>
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
            
            <!-- Application Summary -->
            <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">📋 APPLICATION SUMMARY</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${applicationNumber}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Application Reference Number</p>
              </div>
            </div>

            <!-- Insurance Information -->
            <div style="background-color: #e0f2fe; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #0284c7;">
              <h3 style="color: #0284c7; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 10px;">🛡️ INSURANCE INFORMATION</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Full Name:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${firstName} ${lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Insurance Product:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${productName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Total Amount:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">$${applicationData.totalAmount || 'Not specified'}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Travel Date:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.travelDate ? new Date(applicationData.travelDate).toLocaleDateString('en-US') : 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Return Date:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.returnDate ? new Date(applicationData.returnDate).toLocaleDateString('en-US') : 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Status:</td>
                      <td style="padding: 12px 0; color: #f59e0b; font-weight: bold;">⏳ UNDER REVIEW</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                <strong>⚠️ Important Information:</strong><br>
                • Your insurance application evaluation takes 24-48 hours<br>
                • You can check the current status using your application number<br>
                • When your insurance is approved, you will receive your policy documents via email
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #0284c7; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
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
                If you have any questions, please contact our <strong>24/7 customer service</strong>:<br>
                📧 Email: info@euramedglobal.com<br>
                🌐 Website: https://getvisa.tr
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; border-top: 3px solid #0284c7;">
            <div style="margin-bottom: 20px;">
              ${turkeyFlagSvg}
            </div>
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">TURKEY INSURANCE</h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9; font-weight: 500;">TURKEY INSURANCE SYSTEM</p>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
              <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="text-align: center; min-width: 200px;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #0284c7;">Official Website</p>
                  <p style="margin: 0; font-size: 13px; opacity: 0.8;">https://getvisa.tr</p>
                </div>
                <div style="text-align: center; min-width: 200px;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #0284c7;">Customer Support</p>
                  <p style="margin: 0; font-size: 13px; opacity: 0.8;">info@euramedglobal.com</p>
                </div>
              </div>
              
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; margin-top: 15px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; opacity: 0.7;">
                  This email was sent automatically. Please do not reply to this email.
                </p>
                <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                  © 2025 EURAMED LTD - Turkey Travel Insurance Services. All rights reserved.
                </p>
                <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.7;">
                  EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
TURKEY INSURANCE SYSTEM

Dear ${firstName} ${lastName},

Your Turkey Travel Insurance application has been successfully received and recorded.

APPLICATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Application Reference No: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Insurance Product: ${productName}
Total Amount: $${applicationData.totalAmount || 'Not specified'}
Travel Date: ${applicationData.travelDate ? new Date(applicationData.travelDate).toLocaleDateString('en-US') : 'Not specified'}
Return Date: ${applicationData.returnDate ? new Date(applicationData.returnDate).toLocaleDateString('en-US') : 'Not specified'}
Status: UNDER REVIEW
Application Date: ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT INFORMATION:
• Your insurance application evaluation takes 24-48 hours
• You can check the current status using your application number
• When your insurance is approved, you will receive your policy documents via email

APPLICATION STATUS CHECK:
https://getvisa.tr/status

CUSTOMER SERVICE (24/7):
Email: info@euramedglobal.com
Website: https://getvisa.tr

This email was sent automatically. Please do not reply to this email.

---
EURAMED LTD - Turkey Travel Insurance Services
Contact: info@euramedglobal.com | Website: getvisa.tr
© 2025 EURAMED LTD. All rights reserved.
    `
  };
}