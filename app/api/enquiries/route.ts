import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Email configuration - Using Resend API
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hyderabadnetworks.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@hyderabadnetworks.com';

interface EnquiryItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
}

interface EnquiryFormData {
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
 * POST /api/enquiries
 * Submits a new B2B enquiry, stores it in D1 database, and sends email notifications
 */
export async function POST(request: Request) {
  try {
    const data: EnquiryFormData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.companyName || !data.email || !data.phone || !data.items || data.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Calculate total items
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Store enquiry in D1 database
    const itemsJson = JSON.stringify(data.items);
    
    const insertSql = `
      INSERT INTO enquiries (
        customer_name,
        company_name,
        email,
        phone,
        delivery_timeline,
        customization_notes,
        items,
        total_items,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    const params = [
      data.name,
      data.companyName,
      data.email,
      data.phone,
      data.deliveryTimeline,
      data.customizationNotes || '',
      itemsJson,
      totalItems
    ];

    await queryD1(insertSql, params);
    
    // Get the inserted enquiry ID
    const lastIdResult = await queryD1<{ id: number }>('SELECT last_insert_rowid() as id');
    const enquiryId = lastIdResult[0]?.id || 0;

    // Send emails (only if RESEND_API_KEY is configured)
    let emailsSent = false;
    if (RESEND_API_KEY) {
      try {
        const { getCustomerConfirmationEmail, getAdminNotificationEmail } = await import('@/lib/email-templates');
        
        const customerEmail = getCustomerConfirmationEmail(data);
        const adminEmail = getAdminNotificationEmail(data, enquiryId);
        
        // Send customer confirmation email
        const customerEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: data.email,
            subject: customerEmail.subject,
            html: customerEmail.html,
            text: customerEmail.text,
          }),
        });

        // Send admin notification email
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: adminEmail.subject,
            html: adminEmail.html,
            text: adminEmail.text,
          }),
        });

        emailsSent = customerEmailResponse.ok && adminEmailResponse.ok;
        
        if (!emailsSent) {
          const customerError = customerEmailResponse.ok ? null : await customerEmailResponse.text();
          const adminError = adminEmailResponse.ok ? null : await adminEmailResponse.text();
          console.warn('Failed to send some emails, but enquiry was saved');
          console.error('Customer email error:', customerError);
          console.error('Admin email error:', adminError);
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiryId,
      emailsSent,
      data: {
        id: enquiryId,
        customerName: data.name,
        companyName: data.companyName,
        email: data.email,
        totalItems,
      },
    });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit enquiry',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/enquiries
 * Retrieves all enquiries (for admin dashboard)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM enquiries';
    const params: any[] = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const enquiries = await queryD1(sql, params);

    // Parse items JSON for each enquiry
    const parsedEnquiries = enquiries.map((enquiry: any) => ({
      ...enquiry,
      items: enquiry.items ? JSON.parse(enquiry.items) : [],
    }));

    // Get total count
    const countSql = status 
      ? 'SELECT COUNT(*) as count FROM enquiries WHERE status = ?'
      : 'SELECT COUNT(*) as count FROM enquiries';
    const countParams = status ? [status] : [];
    const countResult = await queryD1<{ count: number }>(countSql, countParams);
    const totalCount = countResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: parsedEnquiries,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch enquiries',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
