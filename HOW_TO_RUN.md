# 🚀 How to Run the Interactive Login Portal

## 📋 Prerequisites

Before running the project, ensure you have:
- ✅ A modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ The project files in a folder on your computer
- ✅ No additional software installation required (pure HTML/CSS/JavaScript)

## 📁 Project Structure

Make sure you have all these files in your project folder:
```
Login Portal/
├── index.html          # Main login page
├── dashboard.html       # Dashboard page (opens after login)
├── styles.css          # Styling for login page
├── dashboard.css       # Styling for dashboard
├── script.js           # Login functionality
├── dashboard.js        # Dashboard functionality
└── README.md           # Documentation
```

## 🎯 Method 1: Direct File Opening (Easiest)

### Step 1: Open the Main File
1. Navigate to your project folder: `c:\Users\LENOVO\OneDrive\Desktop\Login Portal`
2. **Double-click on `index.html`**
3. Your default browser will open the login portal

### Step 2: Alternative Browser Opening
If double-clicking doesn't work:
1. **Right-click** on `index.html`
2. Select **"Open with"**
3. Choose your preferred browser (Chrome recommended)

## 🌐 Method 2: Using File:// URL

1. Open your web browser
2. Press `Ctrl + L` (or `Cmd + L` on Mac) to focus the address bar
3. Type: `file:///c:/Users/LENOVO/OneDrive/Desktop/Login Portal/index.html`
4. Press Enter

## 🛠️ Method 3: Using VS Code Live Server (Recommended for Development)

If you have VS Code installed:

1. **Open VS Code**
2. **File → Open Folder** → Select your `Login Portal` folder
3. **Install Live Server extension** (if not already installed):
   - Go to Extensions (Ctrl + Shift + X)
   - Search for "Live Server"
   - Install it
4. **Right-click on `index.html`**
5. Select **"Open with Live Server"**
6. Portal will open at `http://127.0.0.1:5500/index.html`

## 💻 Method 4: Using PowerShell/Command Line

### Option A: Simple Python Server
If you have Python installed:
```powershell
# Navigate to project folder
cd "c:\Users\LENOVO\OneDrive\Desktop\Login Portal"

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open: `http://localhost:8000`

### Option B: Using Node.js
If you have Node.js installed:
```powershell
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to project folder
cd "c:\Users\LENOVO\OneDrive\Desktop\Login Portal"

# Start server
http-server

# Or specify port
http-server -p 8080
```
Then open: `http://localhost:8080`

## ✅ Quick Start Guide

### For Immediate Testing:
1. **Double-click `index.html`** in your file explorer
2. The login portal will open in your browser
3. Use demo credentials:
   - **Email:** `demo@example.com`
   - **Password:** `demo123`

### For New User Registration:
1. Click **"Register here"** on the login page
2. Fill in all required fields:
   - Username
   - Email address
   - Mobile number (10 digits)
   - Password (8+ characters)
   - Confirm password
3. Click **"Register"**
4. Enter verification code (shown in browser console)
5. You'll be redirected to the dashboard

## 🔧 Troubleshooting

### Issue: Files Not Loading Properly
**Solution:** Make sure all files are in the same folder:
```
✅ index.html
✅ dashboard.html  
✅ styles.css
✅ dashboard.css
✅ script.js
✅ dashboard.js
```

### Issue: JavaScript Not Working
**Solutions:**
1. **Enable JavaScript** in your browser
2. **Check browser console** (F12) for errors
3. **Try a different browser**
4. **Clear browser cache** (Ctrl + F5)

### Issue: Styles Not Loading
**Solutions:**
1. **Refresh the page** (F5)
2. **Clear browser cache**
3. **Check file paths** are correct
4. **Ensure CSS files are in same folder**

### Issue: Can't Access Dashboard
**Solutions:**
1. **Complete registration** first
2. **Verify email** with the code
3. **Try demo login** credentials
4. **Check browser console** for errors

## 🎨 Customization While Running

### Change Colors/Themes:
Edit `styles.css` and `dashboard.css` files, then refresh browser

### Modify Functionality:
Edit `script.js` and `dashboard.js` files, then refresh browser

### Add New Features:
Modify HTML files and corresponding JS/CSS files

## 📱 Mobile Testing

### To test on mobile devices:
1. **Use Method 3 or 4** (Live Server or local server)
2. **Find your computer's IP address**:
   ```powershell
   ipconfig
   ```
3. **Access from mobile**: `http://YOUR_IP:PORT`
   - Example: `http://192.168.1.100:8000`

## 🔒 Security Notes

### For Development/Testing:
- ✅ Current setup is perfect for local testing
- ✅ No internet connection required
- ✅ Data stored in browser localStorage

### For Production Deployment:
- 🔄 Replace localStorage with real database
- 🔄 Implement server-side authentication
- 🔄 Use HTTPS
- 🔄 Add proper session management

## 🎯 Success Indicators

You'll know it's working when you see:
1. **Login form loads** with gradient background
2. **Demo login works** with provided credentials
3. **Registration form** accepts new users
4. **Email verification** shows 6-digit codes in console
5. **Dashboard opens** after successful login
6. **No console errors** (check with F12)

## 📞 Quick Help Commands

### Check if files are present:
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Login Portal"
dir
```

### Open in default browser:
```powershell
start index.html
```

### Open folder in VS Code:
```powershell
code .
```

## 🎉 You're Ready!

The simplest way to get started:
1. **Go to your folder**: `c:\Users\LENOVO\OneDrive\Desktop\Login Portal`
2. **Double-click**: `index.html`
3. **Login with**: `demo@example.com` / `demo123`
4. **Enjoy your portal!** 🚀

---

*Need help? Check the browser console (F12) for any error messages!*
