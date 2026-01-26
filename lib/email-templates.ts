// Email templates for enquiry notifications

interface EnquiryItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
}

interface CustomerEnquiryData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  customizationNotes: string;
  expectedQuantity: number;
  deliveryTimeline: string;
  items: EnquiryItem[];
}

/**
 * Customer confirmation email template
 */
export function getCustomerConfirmationEmail(data: CustomerEnquiryData) {
  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subject: `Enquiry Received - ${data.companyName} | Hyderabad Networks`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Hyderabad Networks
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Premium Clock Manufacturer
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">
                Thank You for Your Enquiry! 🎉
              </h2>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Dear <strong>${data.name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                We have successfully received your enquiry for <strong>${data.companyName}</strong>. Our team will review your requirements and get back to you with a detailed quotation shortly.
              </p>
              
              <!-- Enquiry Summary -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px;">Enquiry Summary</h3>
                    
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 180px;">
                          <strong>Company:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${data.companyName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Total Items:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${totalItems} units across ${data.items.length} products
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Expected Quantity:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${data.expectedQuantity} units
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Delivery Timeline:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${data.deliveryTimeline}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Products List -->
              <h3 style="margin: 25px 0 15px; color: #333333; font-size: 18px;">Requested Products</h3>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; color: #666666; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e0e0e0;">Product</th>
                    <th style="padding: 12px; text-align: left; color: #666666; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e0e0e0;">Variant</th>
                    <th style="padding: 12px; text-align: right; color: #666666; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e0e0e0;">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items.map((item, index) => `
                    <tr style="border-bottom: ${index < data.items.length - 1 ? '1px solid #e0e0e0' : 'none'};">
                      <td style="padding: 12px; color: #333333; font-size: 14px;">${item.productName}</td>
                      <td style="padding: 12px; color: #666666; font-size: 14px;">${item.variantName}</td>
                      <td style="padding: 12px; text-align: right; color: #333333; font-size: 14px; font-weight: 600;">${item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              ${data.customizationNotes ? `
                <div style="margin: 25px 0; padding: 15px; background-color: #fff9e6; border-left: 4px solid #ffa500; border-radius: 4px;">
                  <h4 style="margin: 0 0 8px; color: #333333; font-size: 14px; font-weight: 600;">Customization Notes:</h4>
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">${data.customizationNotes}</p>
                </div>
              ` : ''}
              
              <!-- Next Steps -->
              <div style="margin: 30px 0; padding: 20px; background-color: #f0f7ff; border-radius: 6px;">
                <h3 style="margin: 0 0 12px; color: #333333; font-size: 16px;">What Happens Next?</h3>
                <ol style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                  <li>Our team will review your requirements</li>
                  <li>We'll prepare a detailed quotation with pricing</li>
                  <li>You'll receive the quotation via email within 24-48 hours</li>
                  <li>Feel free to discuss customization or visit our store</li>
                </ol>
              </div>
              
              <p style="margin: 25px 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any immediate questions or need to modify your enquiry, please don't hesitate to contact us.
              </p>
              
              <p style="margin: 10px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong>Hyderabad Networks Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 13px;">
                📧 Email: info@hyderabadnetworks.com | 📞 Phone: +91 XXX XXX XXXX
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Hyderabad Networks. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Dear ${data.name},

Thank you for your enquiry!

We have successfully received your enquiry for ${data.companyName}. Our team will review your requirements and get back to you with a detailed quotation shortly.

ENQUIRY SUMMARY
Company: ${data.companyName}
Total Items: ${totalItems} units across ${data.items.length} products
Expected Quantity: ${data.expectedQuantity} units
Delivery Timeline: ${data.deliveryTimeline}

REQUESTED PRODUCTS
${data.items.map(item => `- ${item.productName} (${item.variantName}) - Quantity: ${item.quantity}`).join('\n')}

${data.customizationNotes ? `\nCUSTOMIZATION NOTES\n${data.customizationNotes}\n` : ''}

WHAT HAPPENS NEXT?
1. Our team will review your requirements
2. We'll prepare a detailed quotation with pricing
3. You'll receive the quotation via email within 24-48 hours
4. Feel free to discuss customization or visit our store

Best regards,
Hyderabad Networks Team

Email: info@hyderabadnetworks.com
Phone: +91 XXX XXX XXXX
    `
  };
}

/**
 * Admin notification email template
 */
export function getAdminNotificationEmail(data: CustomerEnquiryData, enquiryId: number) {
  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedValue = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    subject: `🔔 New B2B Enquiry #${enquiryId} - ${data.companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🔔 New B2B Enquiry Received
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">
                Enquiry #${enquiryId}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Alert Box -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 600;">
                  ⚡ Action Required: New customer enquiry needs review and quotation
                </p>
              </div>
              
              <!-- Customer Information -->
              <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                Customer Information
              </h3>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 180px;">
                    <strong>Company:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                    <strong style="font-size: 16px;">${data.companyName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                    <strong>Contact Person:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                    ${data.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                    <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                    <strong>Phone:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                    <a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
              </table>
              
              <!-- Enquiry Details -->
              <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                Enquiry Details
              </h3>
              
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 180px;">
                      <strong>Total Products:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${data.items.length} different models
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Total Units:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600;">
                      ${totalItems} units
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Expected Quantity:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${data.expectedQuantity} units
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Delivery Timeline:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${data.deliveryTimeline}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Estimated Value:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 16px; font-weight: 700;">
                      ₹${estimatedValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Products Table -->
              <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                Requested Products
              </h3>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; margin-bottom: 25px;">
                <thead>
                  <tr style="background-color: #667eea; color: white;">
                    <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600;">Variant</th>
                    <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items.map((item, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'}; border-bottom: ${index < data.items.length - 1 ? '1px solid #e0e0e0' : 'none'};">
                      <td style="padding: 12px; color: #333333; font-size: 14px;">${item.productName}</td>
                      <td style="padding: 12px; color: #666666; font-size: 13px;">${item.variantName}</td>
                      <td style="padding: 12px; text-align: right; color: #333333; font-size: 14px; font-weight: 600;">${item.quantity}</td>
                      <td style="padding: 12px; text-align: right; color: #666666; font-size: 13px;">₹${item.price.toLocaleString('en-IN')}</td>
                      <td style="padding: 12px; text-align: right; color: #22c55e; font-size: 14px; font-weight: 700;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #f5f5f5; font-weight: bold;">
                    <td colspan="4" style="padding: 12px; text-align: right; color: #333333; font-size: 14px;">TOTAL:</td>
                    <td style="padding: 12px; text-align: right; color: #22c55e; font-size: 16px; font-weight: 700;">₹${estimatedValue.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
              
              ${data.customizationNotes ? `
                <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
                  Customization Requirements
                </h3>
                <div style="background-color: #fff9e6; border-left: 4px solid #ffa500; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                  <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.customizationNotes}</p>
                </div>
              ` : ''}
              
              <!-- Action Items -->
              <div style="background-color: #e8f4fd; border-radius: 6px; padding: 20px; margin-top: 25px;">
                <h4 style="margin: 0 0 12px; color: #333333; font-size: 16px;">📋 Action Items:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                  <li>Review customer requirements and product list</li>
                  <li>Prepare detailed quotation with pricing</li>
                  <li>Contact customer within 24-48 hours</li>
                  <li>Update enquiry status in database</li>
                </ul>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 13px;">
                  Enquiry received on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated notification from Hyderabad Networks B2B System
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
NEW B2B ENQUIRY #${enquiryId}

CUSTOMER INFORMATION
Company: ${data.companyName}
Contact Person: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

ENQUIRY DETAILS
Total Products: ${data.items.length} different models
Total Units: ${totalItems} units
Expected Quantity: ${data.expectedQuantity} units
Delivery Timeline: ${data.deliveryTimeline}
Estimated Value: ₹${estimatedValue.toLocaleString('en-IN')}

REQUESTED PRODUCTS
${data.items.map(item => `- ${item.productName} (${item.variantName}) - Qty: ${item.quantity} - Price: ₹${item.price} - Total: ₹${item.price * item.quantity}`).join('\n')}

TOTAL: ₹${estimatedValue.toLocaleString('en-IN')}

${data.customizationNotes ? `\nCUSTOMIZATION REQUIREMENTS\n${data.customizationNotes}\n` : ''}

ACTION ITEMS:
- Review customer requirements and product list
- Prepare detailed quotation with pricing
- Contact customer within 24-48 hours
- Update enquiry status in database

Enquiry received on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
    `
  };
}
