# Implementation Guides - Holy Cross Convent School

## 📧 Email Service Implementation

### Step 1: Install Dependencies
```bash
cd backend
npm install nodemailer @types/nodemailer
```

### Step 2: Create Email Service
Create `backend/src/services/emailService.ts`:

```typescript
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Application confirmation email
export async function sendApplicationConfirmation(
  email: string,
  applicationId: number,
  applicantName: string
) {
  const mailOptions = {
    from: `"Holy Cross Convent School" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Application Received - Holy Cross Convent School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a237e;">Thank You for Your Application</h2>
        <p>Dear ${applicantName},</p>
        <p>We have successfully received your application for admission to Holy Cross Convent School Brooklyn.</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p>Our admissions team will review your application and contact you within 5-7 business days.</p>
        <p>If you have any questions, please contact us at admin@holycrossbrooklyn.co.za</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Holy Cross Convent School Brooklyn<br>
          162 Koeberg Road, Brooklyn 7405<br>
          Phone: 021 5114337
        </p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
}

// Admin notification email
export async function sendAdminApplicationNotification(applicationData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@holycrossbrooklyn.co.za';
  
  const mailOptions = {
    from: `"Application System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Application Received - ID: ${applicationData.id}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #1a237e;">New Application Received</h2>
        <p><strong>Applicant:</strong> ${applicationData.christianName} ${applicationData.surname}</p>
        <p><strong>Grade Applying:</strong> ${applicationData.gradeApplying}</p>
        <p><strong>Year:</strong> ${applicationData.year}</p>
        <p><strong>Application ID:</strong> ${applicationData.id}</p>
        <p>Please review this application in the admin panel.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
}

// Contact form confirmation
export async function sendContactConfirmation(
  email: string,
  name: string,
  inquiryType: string
) {
  const mailOptions = {
    from: `"Holy Cross Convent School" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Thank You for Contacting Us',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a237e;">Message Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your ${inquiryType} inquiry. We have received your message and will respond within 24-48 hours.</p>
        <p>If this is urgent, please call us at 021 5114337</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Holy Cross Convent School Brooklyn
        </p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
}

// Contact form admin notification
export async function sendAdminContactNotification(contactData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@holycrossbrooklyn.co.za';
  
  const mailOptions = {
    from: `"Contact Form" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New ${contactData.inquiryType} Inquiry from ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #1a237e;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
        <p><strong>Inquiry Type:</strong> ${contactData.inquiryType}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
}

export default {
  sendApplicationConfirmation,
  sendAdminApplicationNotification,
  sendContactConfirmation,
  sendAdminContactNotification
};
```

### Step 3: Update Backend Routes

**Update `backend/src/routes/admissions.ts`:**
```typescript
import emailService from '../services/emailService';

// In POST /submit route, after creating application:
await emailService.sendApplicationConfirmation(
  validatedData.motherEmail || validatedData.fatherEmail,
  application.id,
  `${validatedData.christianName} ${validatedData.surname}`
);

await emailService.sendAdminApplicationNotification(application);
```

**Update `backend/src/routes/contact.ts`:**
```typescript
import emailService from '../services/emailService';

// In POST /submit route, after creating contact message:
await emailService.sendContactConfirmation(
  email,
  `${firstName} ${lastName}`,
  inquiryType
);

await emailService.sendAdminContactNotification(contactMessage);
```

### Step 4: Environment Variables
Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=admin@holycrossbrooklyn.co.za
```

### Step 5: Gmail Setup
1. Enable 2-factor authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password (not regular password) in SMTP_PASS

---

## 💳 PayFast Payment Integration

### Step 1: Sign Up for PayFast
1. Go to https://payfast.co.za
2. Create merchant account
3. Get Merchant ID and Merchant Key from dashboard
4. Set up return/cancel/notify URLs

### Step 2: Install PayFast SDK
```bash
cd backend
npm install payfast-sdk-js
```

### Step 3: Create Payment Service
Create `backend/src/services/paymentService.ts`:

```typescript
import PayFast from 'payfast-sdk-js';

const payfast = new PayFast({
  merchantId: process.env.PAYFAST_MERCHANT_ID!,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
  passPhrase: process.env.PAYFAST_PASSPHRASE, // Optional
  sandbox: process.env.NODE_ENV !== 'production'
});

export interface CreatePaymentData {
  amount: number;
  itemName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  emailAddress: string;
  customInt1?: number; // Application ID if applicable
  customStr1?: string; // Payment type: 'DONATION' or 'APPLICATION_FEE'
}

export async function createPayment(data: CreatePaymentData) {
  try {
    const paymentData = {
      amount: data.amount.toFixed(2),
      item_name: data.itemName,
      return_url: data.returnUrl,
      cancel_url: data.cancelUrl,
      notify_url: data.notifyUrl,
      email_address: data.emailAddress,
      ...(data.customInt1 && { custom_int1: data.customInt1 }),
      ...(data.customStr1 && { custom_str1: data.customStr1 })
    };

    const response = await payfast.payments.create(paymentData);
    return response;
  } catch (error) {
    console.error('PayFast payment creation error:', error);
    throw error;
  }
}

export function verifyPayFastSignature(data: any, signature: string): boolean {
  // Implement PayFast signature verification
  // See PayFast documentation for details
  return true; // Placeholder
}

export default {
  createPayment,
  verifyPayFastSignature
};
```

### Step 4: Create Payment Routes
Create `backend/src/routes/payments.ts`:

```typescript
import express from 'express';
import { PrismaClient } from '@prisma/client';
import paymentService from '../services/paymentService';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Create payment
router.post('/create', async (req, res) => {
  try {
    const { amount, itemName, emailAddress, paymentType, applicationId, donationId } = req.body;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        currency: 'ZAR',
        status: 'PENDING',
        paymentType,
        donorEmail: emailAddress,
        applicationId: applicationId ? parseInt(applicationId) : null,
        donationId: donationId || null
      }
    });

    // Create PayFast payment
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const payfastPayment = await paymentService.createPayment({
      amount: parseFloat(amount),
      itemName,
      emailAddress,
      returnUrl: `${baseUrl}/payment/success?paymentId=${payment.id}`,
      cancelUrl: `${baseUrl}/payment/cancel?paymentId=${payment.id}`,
      notifyUrl: `${process.env.API_URL || 'http://localhost:5000'}/api/payments/webhook`,
      customInt1: payment.id,
      customStr1: paymentType
    });

    res.json({
      success: true,
      paymentUrl: payfastPayment.url,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, error: 'Payment creation failed' });
  }
});

// PayFast webhook
router.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    
    // Verify signature
    const isValid = paymentService.verifyPayFastSignature(data, req.headers['signature']);
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }

    // Update payment status
    if (data.payment_status === 'COMPLETE') {
      await prisma.payment.update({
        where: { id: parseInt(data.custom_int1) },
        data: { 
          status: 'PAID',
          payfastToken: data.pf_payment_id
        }
      });

      // Update related application or donation
      if (data.custom_str1 === 'APPLICATION_FEE') {
        await prisma.application.update({
          where: { id: parseInt(data.custom_int1) },
          data: { paymentStatus: 'PAID' }
        });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

export default router;
```

### Step 5: Update Server
Add to `backend/src/server.ts`:
```typescript
import paymentsRoutes from './routes/payments';
app.use('/api/payments', paymentsRoutes);
```

### Step 6: Create Payment Schema
Add to `backend/prisma/schema.prisma`:
```prisma
model Payment {
  id          String   @id @default(cuid())
  amount      Float
  currency    String   @default("ZAR")
  status      String   // PENDING, PAID, FAILED, CANCELLED
  paymentType String   // DONATION, APPLICATION_FEE
  donorName   String?
  donorEmail  String?
  applicationId Int?
  donationId  String?
  payfastToken String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  application Application? @relation(fields: [applicationId], references: [id])

  @@map("payments")
}
```

Run migration:
```bash
npx prisma migrate dev --name add_payment_model
```

### Step 7: Environment Variables
Add to `backend/.env`:
```env
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase  # Optional
```

---

## 📱 Social Media Integration

### Facebook Integration

#### Step 1: Get Facebook Page ID
1. Go to your Facebook page
2. Click "About" section
3. Find "Page ID" (or use page username)

#### Step 2: Update Footer Links
Update `frontend/src/components/Layout.tsx`:
```typescript
<Link 
  href="https://www.facebook.com/YourPageName" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Facebook />
</Link>
```

#### Step 3: Facebook Page Plugin (Optional)
The `FacebookEmbed.tsx` component already exists. Update with your page ID:
```typescript
// Update pageId prop
<FacebookEmbed pageId="your-page-id" />
```

### Contact Form Integration
The backend is already set up. Just need to:
1. Update email service (see Email Service section above)
2. Test form submission
3. Verify emails are sent

---

## ✅ Checklist Before Go-Live

### Technical Setup
- [ ] Production database configured
- [ ] Environment variables set in production
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible

### Email Setup
- [ ] SMTP credentials configured
- [ ] Test emails sent and received
- [ ] Application confirmation emails working
- [ ] Admin notification emails working
- [ ] Contact form emails working

### Payment Setup
- [ ] PayFast account created
- [ ] Merchant ID and Key configured
- [ ] Test payment completed
- [ ] Webhook URL configured
- [ ] Payment success/cancel pages created

### Testing
- [ ] Application form submission tested
- [ ] Document upload tested
- [ ] Email delivery verified
- [ ] Payment flow tested (test mode)
- [ ] Admin login tested
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing

### Content
- [ ] All images uploaded
- [ ] Mission/Vision statements uploaded
- [ ] Contact information verified
- [ ] Social media links updated
- [ ] Staff information complete

---

**Need help implementing any of these? Let me know which one you'd like to tackle first!**

