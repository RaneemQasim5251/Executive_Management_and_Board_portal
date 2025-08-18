# Board Mark Module - Complete Deployment Guide

This guide will help you deploy the Board Mark digital signature system for your CEO demo.

## 🗄️ Step 1: Database Setup

1. **Go to your Supabase Dashboard** → SQL Editor
2. **Copy and paste the entire content** of `setup-database.sql` into the SQL Editor
3. **Click "Run"** to execute the script
4. **Verify success** - you should see "Setup completed successfully!" and count results

## 🔧 Step 2: Deploy Edge Functions

### Deploy request-signatures function:
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **"Deploy a new function"** → **"Via Editor"**
3. **Function Name**: `request-signatures`
4. **Delete all default code** in the editor
5. **Copy and paste** the entire content from `supabase/functions/request-signatures/index.ts`
6. Click **"Deploy"**

### Deploy sign function:
1. Click **"Deploy a new function"** → **"Via Editor"** 
2. **Function Name**: `sign`
3. **Delete all default code** in the editor
4. **Copy and paste** the entire content from `supabase/functions/sign/index.ts`
5. Click **"Deploy"**

## 🔐 Step 3: Set SMS Secrets (Optional for Demo)

1. Go to **Project Settings** → **Secrets**
2. Add these secrets (or skip for demo):
   - **Name**: `SMS_USER`, **Value**: `jeriTRC`
   - **Name**: `SMS_PASS`, **Value**: `Aljeri123123`
   - **Name**: `SMS_API_URL`, **Value**: `https://your-sms-gateway.com/send`

## 🌐 Step 4: Configure Environment Variables

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://eijlmsovmbipabufalsp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚀 Step 5: Start the Application

```bash
npm run dev
```

## 🎯 CEO Demo Script (10 minutes)

### 1. Create a Resolution (2 minutes)
- Navigate to **Board Mark** in the sidebar
- Click **"Create Resolution"**
- Select today's date for **Meeting Date**
- Enter **Agreement Details**: "Approval of Q4 2024 Financial Report and Strategic Planning for 2025"
- Click **"Save & Request Signatures"**
- Show success message: "Signature requests sent"

### 2. Check Supabase Logs (1 minute)
- Go to **Supabase Dashboard** → **Edge Functions** → **request-signatures** → **Logs**
- Show the OTP generation and deep links in the logs
- Copy one of the deep links for signing demo

### 3. Digital Signing Demo (4 minutes)

#### First Signatory (Approve):
- Open the deep link in a new tab: `https://localhost:5173/board-mark/RES-xxx/sign?sid=xxx&token=xxx`
- Show the signing interface with resolution details
- Enter the OTP from the logs (6-digit number)
- Select **"Approve"**
- Click **"Submit Signature"**
- Show success message

#### Second Signatory (Reject):
- Use a different signatory's deep link
- Enter the corresponding OTP
- Select **"Reject"**
- Enter **Reason**: "Requires additional financial analysis before approval"
- Click **"Submit Signature"**
- Show success message

### 4. Status Updates Demo (2 minutes)
- Go back to **Board Mark** main page
- Show the resolution status changed to **"Time Limit Exceeded"** (due to rejection)
- Create a new resolution quickly
- Show all signatories approving → status changes to **"Finalized"**

### 5. PDF Generation Demo (1 minute)
- Click **"Preview PDF"** on a finalized resolution
- Show the generated PDF with:
  - Fixed Arabic/English Dabaja and Preamble
  - Variable meeting date and agreement details
  - Signature blocks with timestamps
  - Security barcode at bottom
- Explain the barcode contains: Resolution ID + Last 3 digits of National ID + Job Title

## 🔍 Key Features to Highlight

1. **Bilingual Support**: Arabic and English interfaces
2. **Security**: OTP-based authentication, token verification
3. **Audit Trail**: IP addresses, user agents, timestamps recorded
4. **PDF Generation**: Professional documents with barcodes
5. **Status Tracking**: Real-time resolution status updates
6. **Deadline Management**: 7-day default deadlines with notifications

## 🛠️ Troubleshooting

### CORS Errors:
- Ensure both Edge Functions are deployed with the updated CORS headers
- Check Supabase Function logs for specific errors

### Database Errors:
- Verify the SQL setup script ran successfully
- Check RLS policies are properly configured

### Function Not Found:
- Ensure functions are named exactly `request-signatures` and `sign`
- Verify deployment was successful in Supabase Dashboard

### Environment Issues:
- Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the development server after environment changes

## 📞 Support

If you encounter issues during the demo:
1. Check Supabase Edge Function logs first
2. Verify database tables exist and have data
3. Confirm environment variables are properly set
4. Ensure all functions are deployed with correct names

**The system is now ready for your CEO demonstration!** 🎉
