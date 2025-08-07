# Power BI Workspace Access Setup Guide

## 🎯 Goal
To grant your Azure AD App (Service Principal) access to view the reports in your Power BI Workspace.

## 🔑 Your Details
- **Service Principal (Client ID)**: `ab13106b-99f4-416d-aa53-a0ca9d3175ca`
- **Power BI Workspace**: The workspace containing the report with ID `de40b238-ed32-4ca6-abe5-7383e5785ddf`

## Why is this necessary?
Your application authenticates as a "service principal," which is like a robot user. Just like a human user, this robot user needs to be given permission to see the content inside a specific Power BI workspace. Without this step, Power BI will block access, resulting in an infinite loading screen.

## 🔧 Step-by-Step Instructions

### Step 1: Go to your Power BI Workspace
1.  Navigate to the [Power BI Service](https://app.powerbi.com).
2.  In the left navigation pane, find and click on the workspace that holds your reports.

### Step 2: Open the "Access" Pane
1.  At the top-right corner of the workspace view, click the **Access** button.

    ![Access Button](https://i.imgur.com/2Y4zH5g.png)

### Step 3: Add the Service Principal
1.  In the "Access" pane, type the name of your Azure AD application registration. The Client ID is `ab13106b-99f4-416d-aa53-a0ca9d3175ca`. The name is likely "Executive-Management-Portal" or similar.
2.  As you type, your application should appear in the dropdown list. It will have an **(App)** suffix.
3.  Select the application.

    ![Add Service Principal](https://i.imgur.com/3b4kL9C.png)

### Step 4: Assign a Role
1.  From the dropdown menu next to the name, assign a role.
2.  For viewing reports, the **Viewer** role is sufficient and recommended for security (Principle of Least Privilege).
3.  Click **Add**.

    ![Assign Role](https://i.imgur.com/5J3P0fM.png)

### Step 5: Verify Access
1.  Your service principal should now be listed under the "Access" list with the "Viewer" role.
2.  **Wait 5-10 minutes.** It can take a few minutes for the permissions to apply across Microsoft's services.

### Step 6: Test Your Application
1.  Go back to your running application.
2.  Perform a hard refresh (press `Ctrl` + `F5` or `Cmd` + `Shift` + `R`).
3.  The Power BI report should now load correctly instead of showing the loading icon.

## ✅ Success!
Once completed, your application will have the necessary permissions to embed and display reports from your workspace. This is the final configuration step required for a secure and functional Power BI embedded analytics setup.
