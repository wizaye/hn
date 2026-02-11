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
    subject: `Enquiry Received - ${data.companyName} | Hyderabad Network`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px 30px; border-bottom: 3px solid #000000;">
        <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
          Hyderabad Network
        </h1>
        <p style="margin: 8px 0 0; color: #666666; font-size: 15px; font-weight: 400;">
          Premium Clock Manufacturer
        </p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="margin: 0 0 24px; color: #000000; font-size: 24px; font-weight: 600;">
          Thank You for Your Enquiry
        </h2>
        
        <p style="margin: 0 0 16px; color: #333333; font-size: 15px; line-height: 1.6;">
          Dear <strong>${data.name}</strong>,
        </p>
        
        <p style="margin: 0 0 24px; color: #333333; font-size: 15px; line-height: 1.6;">
          We have successfully received your enquiry for <strong>${data.companyName}</strong>. Our team will review your requirements and get back to you with a detailed quotation shortly.
        </p>
        
        <!-- Enquiry Summary -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; margin: 24px 0;">
          <tr>
            <td style="padding: 20px; background-color: #f9f9f9; border-bottom: 1px solid #e0e0e0;">
              <h3 style="margin: 0; color: #000000; font-size: 16px; font-weight: 600;">Enquiry Summary</h3>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 160px;">
                    Company
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
                    ${data.companyName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                    Total Items
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
                    ${totalItems} units across ${data.items.length} products
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                    Delivery Timeline
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
                    ${data.deliveryTimeline}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Products List -->
        <h3 style="margin: 32px 0 16px; color: #000000; font-size: 16px; font-weight: 600;">Requested Products</h3>
        
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0;">
          <thead>
            <tr style="background-color: #000000; color: #ffffff;">
              <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Product</th>
              <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Variant</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e0e0e0; background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
                <td style="padding: 12px; color: #000000; font-size: 14px; border-right: 1px solid #e0e0e0;">${item.productName}</td>
                <td style="padding: 12px; color: #333333; font-size: 14px; border-right: 1px solid #e0e0e0;">${item.variantName}</td>
                <td style="padding: 12px; text-align: right; color: #000000; font-size: 14px; font-weight: 600;">${item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${data.customizationNotes ? `
          <div style="margin: 24px 0; padding: 16px; background-color: #f9f9f9; border-left: 3px solid #000000;">
            <h4 style="margin: 0 0 8px; color: #000000; font-size: 14px; font-weight: 600;">Customization Notes</h4>
            <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.5;">${data.customizationNotes}</p>
          </div>
        ` : ''}
        
        <!-- Next Steps -->
        <div style="margin: 32px 0; padding: 20px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
          <h3 style="margin: 0 0 12px; color: #000000; font-size: 16px; font-weight: 600;">What Happens Next?</h3>
          <ol style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
            <li>Our team will review your requirements</li>
            <li>We'll prepare a detailed quotation with pricing</li>
            <li>You'll receive the quotation via email within 24-48 hours</li>
            <li>Feel free to discuss customization or visit our store</li>
          </ol>
        </div>
        
        <p style="margin: 24px 0 8px; color: #333333; font-size: 14px; line-height: 1.6;">
          If you have any immediate questions or need to modify your enquiry, please don't hesitate to contact us.
        </p>
        
        <p style="margin: 8px 0 0; color: #333333; font-size: 14px; line-height: 1.6;">
          Best regards,<br>
          <strong>Hyderabad Network Team</strong>
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #000000; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0 0 12px; color: #ffffff; font-size: 14px; font-weight: 700; text-align: center; letter-spacing: 1px;">
          HYDERABAD NETWORK
        </p>
        <p style="margin: 0 0 8px; color: #cccccc; font-size: 12px; text-align: center;">
          Premium Clock Manufacturer
        </p>
        <p style="margin: 0 0 8px; color: #cccccc; font-size: 12px; text-align: center;">
          Email: info@hyderabadnetwork.com | Phone: +91 XXX XXX XXXX
        </p>
        <p style="margin: 0; color: #999999; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} Hyderabad Network. All rights reserved.
        </p>
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
Hyderabad Network Team

Email: info@hyderabadnetwork.com
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
    subject: `New B2B Enquiry #${enquiryId} - ${data.companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px 30px; border-bottom: 3px solid #000000;">
        <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
          New B2B Enquiry #${enquiryId}
        </h1>
        <p style="margin: 8px 0 0; color: #666666; font-size: 15px; font-weight: 400;">
          Action Required: Review and Respond
        </p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        
        <!-- Alert Box -->
        <div style="background-color: #f9f9f9; border-left: 4px solid #000000; padding: 16px; margin-bottom: 32px;">
          <p style="margin: 0; color: #000000; font-size: 14px; font-weight: 600;">
            New customer enquiry needs review and quotation
          </p>
        </div>
        
        <!-- Customer Information -->
        <h3 style="margin: 0 0 16px; color: #000000; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">
          Customer Information
        </h3>
        
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
          <tr>
            <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 160px;">
              Company
            </td>
            <td style="padding: 6px 0; color: #000000; font-size: 16px; font-weight: 600;">
              ${data.companyName}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-size: 14px;">
              Contact Person
            </td>
            <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
              ${data.name}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-size: 14px;">
              Email
            </td>
            <td style="padding: 6px 0; color: #000000; font-size: 14px;">
              <a href="mailto:${data.email}" style="color: #000000; text-decoration: underline;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-size: 14px;">
              Phone
            </td>
            <td style="padding: 6px 0; color: #000000; font-size: 14px;">
              <a href="tel:${data.phone}" style="color: #000000; text-decoration: underline;">${data.phone}</a>
            </td>
          </tr>
        </table>
        
        <!-- Enquiry Details -->
        <h3 style="margin: 0 0 16px; color: #000000; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">
          Enquiry Details
        </h3>
        
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; margin-bottom: 32px;">
          <tr>
            <td style="padding: 20px; background-color: #f9f9f9;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 160px;">
                    Total Products
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
                    ${data.items.length} different models
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                    Total Units
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">
                    ${totalItems} units
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                    Delivery Timeline
                  </td>
                  <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">
                    ${data.deliveryTimeline}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 0; color: #666666; font-size: 14px;">
                    Estimated Value
                  </td>
                  <td style="padding: 8px 0 0; color: #000000; font-size: 18px; font-weight: 700;">
                    ₹${estimatedValue.toLocaleString('en-IN')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Products Table -->
        <h3 style="margin: 0 0 16px; color: #000000; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">
          Requested Products
        </h3>
        
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #000000; margin-bottom: 32px;">
          <thead>
            <tr style="background-color: #000000; color: #ffffff;">
              <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Product</th>
              <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Variant</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Qty</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; border-right: 1px solid #333333;">Price</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'}; border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px; color: #000000; font-size: 14px; border-right: 1px solid #e0e0e0;">${item.productName}</td>
                <td style="padding: 12px; color: #333333; font-size: 13px; border-right: 1px solid #e0e0e0;">${item.variantName}</td>
                <td style="padding: 12px; text-align: right; color: #000000; font-size: 14px; font-weight: 600; border-right: 1px solid #e0e0e0;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; color: #333333; font-size: 13px; border-right: 1px solid #e0e0e0;">₹${item.price.toLocaleString('en-IN')}</td>
                <td style="padding: 12px; text-align: right; color: #000000; font-size: 14px; font-weight: 700;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
            <tr style="background-color: #000000; color: #ffffff; font-weight: bold;">
              <td colspan="4" style="padding: 12px; text-align: right; font-size: 14px;">TOTAL</td>
              <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: 700;">₹${estimatedValue.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        ${data.customizationNotes ? `
          <h3 style="margin: 0 0 16px; color: #000000; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">
            Customization Requirements
          </h3>
          <div style="background-color: #f9f9f9; border-left: 4px solid #000000; padding: 16px; margin-bottom: 32px;">
            <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.customizationNotes}</p>
          </div>
        ` : ''}
        
        <!-- Action Items -->
        <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 20px; margin-top: 32px;">
          <h4 style="margin: 0 0 12px; color: #000000; font-size: 16px; font-weight: 600;">Action Items</h4>
          <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
            <li>Review customer requirements and product list</li>
            <li>Prepare detailed quotation with pricing</li>
            <li>Contact customer within 24-48 hours</li>
            <li>Update enquiry status in database</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
          <p style="margin: 0; color: #666666; font-size: 13px;">
            Enquiry received on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #000000; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0 0 8px; color: #ffffff; font-size: 14px; font-weight: 700; text-align: center; letter-spacing: 1px;">
          HYDERABAD NETWORK — B2B SYSTEM
        </p>
        <p style="margin: 0; color: #999999; font-size: 11px; text-align: center;">
          Automated notification &bull; ${new Date().getFullYear()}
        </p>
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
