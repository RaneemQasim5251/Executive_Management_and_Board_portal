# IT Department Instructions - Power BI Integration Setup

## 📋 **COPY AND SEND THIS TO YOUR IT DEPARTMENT**

---

**To: IT Department / Azure Administrator**  
**Subject: Azure AD App Permissions Required for Executive Management Portal**

Hello IT Team,

We need to configure Power BI permissions for our Executive Management Portal. Please follow these steps to grant the necessary permissions for our existing Azure AD application.

## 🔧 **Required Actions**

### **Step 1: Locate the Application**
1. **Go to**: [Azure Portal](https://portal.azure.com)
2. **Navigate to**: `Azure Active Directory` → `App registrations`
3. **Find application**: **"Azure Portal"** 
4. **Application ID**: `c44b4083-3bb0-49c1-b47d-c974e5d8b0b3`

### **Step 2: Add Power BI API Permissions** ⚡
1. **Click** on the "Azure Portal" application
2. **Go to**: `API permissions` (left sidebar)
3. **Click**: `+ Add a permission`
4. **Select**: `APIs my organization uses`
5. **Search for**: `Power BI Service`
6. **Click**: `Power BI Service`
7. **Select**: `Delegated permissions`
8. **Add ALL these permissions**:
   - ✅ `Dataset.Read.All`
   - ✅ `Dataset.ReadWrite.All`
   - ✅ `Report.Read.All`
   - ✅ `Report.ReadWrite.All`
   - ✅ `Workspace.Read.All`
   - ✅ `Dashboard.Read.All`
   - ✅ `Content.Create`
   - ✅ `Metadata.View_Any`

### **Step 3: Grant Admin Consent** 🔐
1. **After adding permissions**, click `Grant admin consent for [Your Organization]`
2. **Click**: `Yes` to confirm
3. **Verify**: All permissions show "Granted for [Your Organization]" in green

### **Step 4: Generate Client Secret**
1. **Go to**: `Certificates & secrets` (left sidebar)
2. **Click**: `+ New client secret`
3. **Description**: `Power BI Integration - Executive Portal`
4. **Expires**: `24 months` (recommended)
5. **Click**: `Add`
6. **⚠️ IMPORTANT**: Copy the **VALUE** (not the ID) immediately
7. **Send the secret value securely** to the development team

### **Step 5: Power BI Service Settings** 📊
1. **Go to**: [Power BI Admin Portal](https://app.powerbi.com/admin-portal)
2. **Navigate to**: `Tenant settings`
3. **Find**: `Developer settings` section
4. **Enable**: `Embed content in apps`
5. **Set to**: `The entire organization` or specific security groups
6. **Enable**: `Allow service principals to use Power BI APIs`
7. **Add**: The application ID `c44b4083-3bb0-49c1-b47d-c974e5d8b0b3` to allowed applications

### **Step 6: Security Group (Optional but Recommended)**
If you prefer more granular control:
1. **Create** a security group: `PowerBI-Executive-Portal-Users`
2. **Add** authorized users to this group
3. **In Power BI admin settings**, use this group instead of "entire organization"

## 📝 **Information Needed from IT**

Please provide the development team with:

1. **✅ Client Secret Value** (from Step 4)
2. **✅ Workspace ID** (where the Power BI reports are located)
3. **✅ Report IDs** for each business unit:
   - JTC Transport & Logistics
   - Al Jeri Investment Portfolio  
   - J:Oil Petroleum Operations
   - Time & Attendance System
   - 45 Degrees Cafe
   - Shaheen Rent a Car
   - Group Revenue Dashboard

## 🔒 **Security Notes**

- ✅ **Client Secret**: Keep secure, store in backend environment only
- ✅ **Permissions**: These are read-only permissions for embedding reports
- ✅ **Access Control**: Power BI reports will respect existing row-level security
- ✅ **Audit**: All access will be logged in Azure AD and Power BI audit logs

## 🎯 **Expected Result**

After completion, the Executive Management Portal will:
- ✅ Display Power BI reports without login prompts
- ✅ Allow executives to view real-time business intelligence
- ✅ Maintain all existing security and access controls
- ✅ Provide seamless integration with corporate identity

## 📞 **Support Contacts**

If you have questions:
- **Development Team**: [Your Contact]
- **Microsoft Documentation**: [Power BI Embedded Authentication](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-tokens)

---

**⏰ Priority**: High - Required for executive dashboard functionality  
**Timeline**: Please complete within 2-3 business days  
**Testing**: Development team will validate integration after completion

Thank you for your support!

---

## 🔍 **Troubleshooting for IT**

### Common Issues:
1. **"App not found"**: Ensure Application ID is correct
2. **"Power BI Service not available"**: Check if Power BI is enabled for organization
3. **"Permission denied"**: Verify admin consent was granted
4. **"Reports not loading"**: Check workspace permissions and report IDs

### Verification Steps:
1. **Azure AD**: Permissions show as "Granted" with green checkmarks
2. **Power BI**: Service principal appears in tenant settings
3. **Testing**: Development team confirms reports load without authentication prompts