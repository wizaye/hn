# B2B Enquiry System Setup Guide

This guide will help you set up the complete B2B enquiry system with email notifications and database storage.

## Features

✅ **Database Storage** - All enquiries stored in Cloudflare D1 database  
✅ **Customer Confirmation Email** - Professional email template sent to customers  
✅ **Admin Notification Email** - Detailed enquiry notification sent to admin  
✅ **Beautiful Email Templates** - Responsive HTML emails with invoice-style layout  
✅ **Enquiry Tracking** - Store customer details, products, quantities, and timestamps

## Prerequisites

1. Cloudflare account with D1 database set up (already configured)
2. Resend account for sending emails (recommended)
3. Python 3.x installed (for database setup script)

## Step 1: Create Database Table

Run the Python script to create the `enquiries` table in your D1 database:

```bash
cd hn-backend-scripts
python create-enquiries-table.py
```

This will create:
- `enquiries` table with all necessary fields
- Indexes for better query performance  
- A view for quick enquiry summaries

**Table Schema:**
```sql
CREATE TABLE enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    customization_notes TEXT,
    expected_quantity INTEGER,
    delivery_timeline VARCHAR(100),
    items TEXT NOT NULL,  -- JSON format
    total_items INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_notes TEXT,
    quoted_amount DECIMAL(10, 2),
    converted_at TIMESTAMP
)
```

## Step 2: Set Up Email Service (Resend)

### Why Resend?
- ✅ Free tier: 3,000 emails/month
- ✅ Simple API, great DX
- ✅ Works seamlessly with Next.js
- ✅ Better deliverability than SendGrid/Mailgun
- ✅ No credit card required for free tier

### Setup Steps:

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up for free account

2. **Get API Key**
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `re_`)

3. **Verify Domain (Optional but Recommended)**
   - Add your domain in Domains section
   - Add DNS records as instructed
   - This allows sending from your@yourdomain.com instead of onboarding@resend.dev

4. **Add Environment Variables**

Update your `.env` file in the `hn` directory:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=admin@hyderabadnetworks.com
FROM_EMAIL=noreply@hyderabadnetworks.com
```

**Important:** 
- If you haven't verified a domain, use `onboarding@resend.dev` as FROM_EMAIL
- ADMIN_EMAIL is where you'll receive enquiry notifications
- Replace with your actual email addresses

## Step 3: Install Dependencies

The Resend SDK is already configured to work with Next.js API routes (no additional package needed).

## Step 4: Test the System

### Manual Test:

1. Start your dev server:
```bash
cd hn
npm run dev
# or
bun run dev
```

2. Go to http://localhost:3000/products
3. Add products to enquiry cart
4. Go to http://localhost:3000/enquire
5. Fill out the form and submit

### What Should Happen:

1. ✅ Enquiry saved to D1 database
2. ✅ Confirmation email sent to customer
3. ✅ Notification email sent to admin
4. ✅ Success toast message shown
5. ✅ Form cleared and cart emptied

## Step 5: View Enquiries

### Query Database (via Cloudflare Dashboard):

```sql
-- View all enquiries
SELECT * FROM enquiries ORDER BY created_at DESC;

-- View pending enquiries only
SELECT * FROM enquiries WHERE status = 'pending' ORDER BY created_at DESC;

-- Get enquiry summary
SELECT * FROM enquiry_summary;
```

### Via API (for admin dashboard):

```bash
# Get all enquiries
curl http://localhost:3000/api/enquiries

# Get pending enquiries only
curl http://localhost:3000/api/enquiries?status=pending

# With pagination
curl http://localhost:3000/api/enquiries?limit=10&offset=0
```

## Email Templates

### Customer Confirmation Email Includes:
- ✅ Professional header with branding
- ✅ Enquiry summary (company, items, timeline)
- ✅ Product list in table format
- ✅ Customization notes (if provided)
- ✅ Next steps information
- ✅ Contact information

### Admin Notification Email Includes:
- ✅ Alert banner for quick action
- ✅ Complete customer contact details
- ✅ Enquiry details with estimated value
- ✅ Product list with quantities and prices
- ✅ Total estimated value in INR
- ✅ Customization requirements
- ✅ Action items checklist

## API Endpoints

### POST /api/enquiries
Submit a new enquiry

**Request Body:**
```json
{
  "name": "John Doe",
  "companyName": "ABC Corp",
  "email": "john@abccorp.com",
  "phone": "+91 9876543210",
  "customizationNotes": "Need company logo on all clocks",
  "expectedQuantity": 500,
  "deliveryTimeline": "2-4 weeks",
  "items": [
    {
      "productId": "1",
      "productName": "CU-007",
      "variantId": "v1",
      "variantName": "Standard",
      "quantity": 100,
      "price": 9800
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "enquiryId": 1,
  "emailsSent": true,
  "data": {
    "id": 1,
    "customerName": "John Doe",
    "companyName": "ABC Corp",
    "email": "john@abccorp.com",
    "totalItems": 100
  }
}
```

### GET /api/enquiries
Retrieve enquiries (admin only)

**Query Parameters:**
- `status` - Filter by status (pending, contacted, quoted, converted, closed)
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset (default: 0)

## Enquiry Status Workflow

```
pending → contacted → quoted → converted/closed
```

**Status Values:**
- `pending` - New enquiry, not yet reviewed
- `contacted` - Admin has contacted the customer
- `quoted` - Quotation sent to customer
- `converted` - Customer placed order
- `closed` - Enquiry closed without conversion

## Alternative Email Services

If you prefer not to use Resend, you can use:

### 1. SendGrid
```env
SENDGRID_API_KEY=your_key
```

### 2. Mailgun
```env
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=your_domain
```

### 3. AWS SES
```env
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

**Note:** You'll need to modify `/app/api/enquiries/route.ts` to use the specific SDK for your chosen service.

## Production Deployment

### Environment Variables Checklist:

```env
# Cloudflare (Already configured)
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
D1_DATABASE_ID=xxx
R2_PUBLIC_URL=xxx

# Email (New - Add these)
RESEND_API_KEY=re_xxx
ADMIN_EMAIL=your-admin@email.com
FROM_EMAIL=noreply@yourdomain.com
```

### Deploy to Production:

1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Run database setup script against production D1 database
3. Test email sending in production
4. Monitor enquiries in database

## Monitoring & Maintenance

### Regular Tasks:
- Check pending enquiries daily
- Update enquiry status after contact
- Add admin notes for tracking
- Monitor email delivery rates

### Database Queries for Monitoring:

```sql
-- Count enquiries by status
SELECT status, COUNT(*) as count 
FROM enquiries 
GROUP BY status;

-- Recent enquiries (last 7 days)
SELECT * FROM enquiries 
WHERE created_at >= datetime('now', '-7 days')
ORDER BY created_at DESC;

-- High-value enquiries
SELECT *, 
  CAST(SUBSTR(items, 1, 1000) AS TEXT) as items_preview
FROM enquiries 
WHERE total_items > 100
ORDER BY total_items DESC;
```

## Troubleshooting

### Emails Not Sending:
1. Check RESEND_API_KEY is set correctly
2. Verify email addresses are valid
3. Check Resend dashboard for delivery logs
4. Ensure FROM_EMAIL matches verified domain

### Database Errors:
1. Verify table was created successfully
2. Check D1_DATABASE_ID is correct
3. Test connection with simple query

### Form Submission Issues:
1. Check browser console for errors
2. Verify API route is accessible
3. Check request payload format

## Support

For issues or questions:
- Check Resend docs: https://resend.com/docs
- Check Cloudflare D1 docs: https://developers.cloudflare.com/d1/
- Review error logs in browser console and terminal

## Summary

You now have a complete B2B enquiry system that:
- ✅ Stores all enquiry data in database
- ✅ Sends beautiful confirmation emails to customers
- ✅ Notifies admin of new enquiries
- ✅ Tracks enquiry status and timeline
- ✅ Provides API for enquiry management
- ✅ Works seamlessly with your existing product catalog

All communication beyond initial enquiry will be handled via email, phone, or in-store visits as per B2B workflow!
