# 📧 Email Verification Setup Guide

## Current Status
Your login portal now includes email verification functionality! Currently, it's set up with email simulation (shows in console and toast), but you can easily configure it to send real emails.

## 🔧 How to Enable Real Email Sending

### Option 1: EmailJS (Recommended - Free & Easy)

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account (100 emails/month)

2. **Setup Email Service**
   - Add an email service (Gmail, Outlook, etc.)
   - Note down your `Service ID`

3. **Create Email Template**
   - Create a new template with these variables:
     - `{{to_email}}` - recipient email
     - `{{to_name}}` - recipient name
     - `{{verification_code}}` - the 6-digit code
     - `{{app_name}}` - Portal Login System
   - Note down your `Template ID`

4. **Get Public Key**
   - Go to Account > API Keys
   - Copy your `Public Key`

5. **Update Configuration**
   - Open `script.js`
   - Find the `EmailService` class constructor
   - Replace these values:
     ```javascript
     this.serviceId = 'your_service_id_here';
     this.templateId = 'your_template_id_here';
     this.publicKey = 'your_public_key_here';
     ```

6. **Enable Real Email**
   - In `showEmailVerification()` function, replace:
     ```javascript
     emailService.simulateEmailSend(userEmail, verificationCode);
     ```
   - With:
     ```javascript
     emailService.sendVerificationCode(userEmail, userName, verificationCode);
     ```

### Option 2: Alternative Email Services

You can also integrate other email services:
- **SendGrid** - Professional email API
- **Mailgun** - Developer-friendly email service
- **AWS SES** - Amazon's email service
- **Nodemailer** (requires backend)

## 📧 Sample Email Template

```
Subject: Your Portal Verification Code

Hello {{to_name}},

Your verification code for {{app_name}} is:

{{verification_code}}

This code will expire in 10 minutes for security reasons.

If you didn't request this code, please ignore this email.

Best regards,
Portal Team
```

## 🧪 Testing

Currently, the system uses email simulation which:
- ✅ Shows verification code in console
- ✅ Displays email content in console
- ✅ Shows user-friendly toast notifications
- ✅ Works without any setup

## 🔒 Security Notes

- Verification codes expire (implement 10-minute timeout)
- Codes are 6 digits (100,000 - 999,999)
- Each code is unique per session
- Codes are regenerated on resend

## 🎯 Current Features

- ✅ Email verification during registration
- ✅ Resend verification code
- ✅ Email simulation for testing
- ✅ Fallback to screen display
- ✅ User-friendly error handling
- ✅ Ready for real email integration

## 📝 Next Steps

1. **For Testing**: Current setup works perfectly - codes appear in console and notifications
2. **For Production**: Follow EmailJS setup above to send real emails
3. **For Advanced Users**: Integrate with your preferred email service

Your verification system is now fully functional! 🎉
