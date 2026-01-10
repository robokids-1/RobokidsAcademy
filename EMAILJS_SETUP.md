# EmailJS Setup Guide

This guide will help you configure EmailJS to send enrollment form submissions to botbeesacademy@gmail.com.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month on free tier)
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Follow the connection steps to connect your Gmail account
5. **Copy the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use the following template:

**Template Name:** Enrollment Form

**Subject:**
```
{{subject}}
```

**Content:**
```
From: {{from_name}}
Email: {{reply_to}}

{{message}}
```

4. **Copy the Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (also called User ID)
3. **Copy the Public Key**

## Step 5: Update the Code

Open `src/enroll-script.js` and replace the following placeholders:

1. **Line 7:** Replace `YOUR_PUBLIC_KEY` with your EmailJS Public Key
2. **Line 161:** Replace `YOUR_SERVICE_ID` with your Service ID
3. **Line 161:** Replace `YOUR_TEMPLATE_ID` with your Template ID

Example:
```javascript
emailjs.init("abc123xyz"); // Your Public Key

// ...

emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## Step 6: Test

1. Open the enrollment form on your website
2. Fill out and submit a test enrollment
3. Check botbeesacademy@gmail.com for the email

## Troubleshooting

- **Emails not sending?** Check the browser console for error messages
- **Service ID/Template ID not working?** Make sure you copied them correctly (they usually start with `service_` and `template_`)
- **Public Key issues?** Make sure you're using the Public Key, not the Private Key
- **Rate limits?** Free tier allows 200 emails/month. Upgrade if needed.

## Alternative: Use Formspree (Simpler Setup)

If you prefer a simpler setup without API keys:

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up and create a new form
3. Get your form endpoint URL
4. Replace the EmailJS code with a simple fetch() call to Formspree

---

**Note:** The email will be sent to `botbeesacademy@gmail.com` as configured in the code.

