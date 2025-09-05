// Email Service Configuration (EmailJS)
class EmailService {
    constructor() {
        this.serviceId = 'service_default'; // Replace with your EmailJS service ID
        this.templateId = 'template_default'; // Replace with your EmailJS template ID
        this.publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
        this.isConfigured = false;
        this.init();
    }

    init() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            this.isConfigured = true;
        }
    }

    async sendVerificationCode(userEmail, userName, verificationCode) {
        if (!this.isConfigured) {
            console.warn('EmailJS not configured. Using fallback method.');
            this.showCodeOnScreen(verificationCode);
            return;
        }

        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            verification_code: verificationCode,
            app_name: 'Portal Login System',
            company_name: 'Portal'
        };

        try {
            showToast('Sending verification code to your email...', 'info');
            
            const result = await emailjs.send(this.serviceId, this.templateId, templateParams);
            
            if (result.status === 200) {
                showToast('Verification code sent to your email successfully!', 'success');
                return true;
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            showToast('Failed to send email. Showing code on screen.', 'warning');
            this.showCodeOnScreen(verificationCode);
            return false;
        }
    }

    showCodeOnScreen(verificationCode) {
        // Fallback: show code on screen if email fails
        showToast(`Verification code: ${verificationCode}`, 'info', 8000);
        console.log('Verification code:', verificationCode);
    }

    // For testing without email service
    simulateEmailSend(userEmail, verificationCode) {
        showToast(`📧 Email sent to ${userEmail}`, 'success');
        console.log(`
=== EMAIL SIMULATION ===
To: ${userEmail}
Subject: Your Portal Verification Code

Hello,

Your verification code is: ${verificationCode}

This code will expire in 10 minutes.

Best regards,
Portal Team
========================`);
        
        // Also show in a more prominent way
        showToast(`Check your email (${userEmail}) for the verification code`, 'info', 6000);
    }
}

// Initialize email service
const emailService = new EmailService();

// DEBUG: Create test user function
async function createTestUser() {
    const testUser = {
        id: Date.now(),
        fullName: 'Test User',
        email: 'admin@test.com',
        passwordHash: MD5Hash.hash('admin123'),
        mobile: '1234567890',
        emailVerified: true,
        registrationDate: new Date().toISOString(),
        totalLogins: 0
    };
    
    // Add to users array and save to file
    users.push(testUser);
    await fileStorage.saveUsers(users);
    
    console.log('✅ Test user created and saved to file:', testUser);
    showToast('Test user created! Login with admin@test.com / admin123', 'success');
}

// Make function globally available for debugging
window.createTestUser = createTestUser;

// DEBUG: Test password hashing
function testPasswordHashing() {
    const testPassword = 'admin123';
    const hash1 = MD5Hash.hash(testPassword);
    const hash2 = MD5Hash.hash(testPassword);
    const verification = MD5Hash.verify(testPassword, hash1);
    
    console.log('🔑 Password Hashing Test:', {
        password: testPassword,
        hash1: hash1,
        hash2: hash2,
        hashesMatch: hash1 === hash2,
        verification: verification,
        md5Available: typeof md5 !== 'undefined'
    });
    
    return { hash1, hash2, verification, consistent: hash1 === hash2 };
}

window.testPasswordHashing = testPasswordHashing;

// User Data Storage (Now using file storage instead of localStorage)
let users = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize file storage on page load
async function initializeStorage() {
    try {
        users = await fileStorage.loadUsers();
        console.log('📁 File storage initialized with', users.length, 'users');
        
        // If no users exist, create demo users
        if (users.length === 0) {
            await addDemoUsers();
            await createTestUser();
        }
    } catch (error) {
        console.error('❌ Failed to initialize file storage:', error);
        users = [];
    }
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initializeStorage);

// Crypto library for password hashing using MD5
class MD5Hash {
    static hash(password) {
        // Use the external md5 library for proper hashing
        if (typeof md5 !== 'undefined') {
            return md5(password + 'salt_key_123'); // Adding salt for security
        } else {
            // Fallback to simple hash if library not loaded
            console.warn('MD5 library not loaded, using fallback hash');
            return this.simpleHash(password + 'salt_key_123');
        }
    }
    
    static verify(password, hash) {
        const hashedPassword = this.hash(password);
        console.log('🔑 Password verification debug:', {
            inputPassword: password,
            hashedInput: hashedPassword,
            storedHash: hash,
            match: hashedPassword === hash
        });
        return hashedPassword === hash;
    }
    
    static simpleHash(str) {
        // Simple fallback hash function
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    static md5(string) {
        // Simple MD5 implementation
        function rotateLeft(value, amount) {
            return (value << amount) | (value >>> (32 - amount));
        }
        
        function addUnsigned(x, y) {
            const mod = 0x100000000;
            return ((x % mod) + (y % mod)) % mod;
        }
        
        function md5Cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3];
            
            a = addUnsigned(a, addUnsigned(addUnsigned((b & c) | ((~b) & d), k[0]), 0xD76AA478));
            a = rotateLeft(a, 7);
            a = addUnsigned(a, b);
            
            d = addUnsigned(d, addUnsigned(addUnsigned((a & b) | ((~a) & c), k[1]), 0xE8C7B756));
            d = rotateLeft(d, 12);
            d = addUnsigned(d, a);
            
            c = addUnsigned(c, addUnsigned(addUnsigned((d & a) | ((~d) & b), k[2]), 0x242070DB));
            c = rotateLeft(c, 17);
            c = addUnsigned(c, d);
            
            b = addUnsigned(b, addUnsigned(addUnsigned((c & d) | ((~c) & a), k[3]), 0xC1BDCEEE));
            b = rotateLeft(b, 22);
            b = addUnsigned(b, c);
            
            return [a, b, c, d];
        }
        
        function stringToWords(string) {
            const words = [];
            for (let i = 0; i < string.length * 8; i += 8) {
                words[i >> 5] |= (string.charCodeAt(i / 8) & 0xFF) << (i % 32);
            }
            return words;
        }
        
        function wordsToHex(words) {
            let hex = '';
            for (let i = 0; i < words.length * 32; i += 8) {
                const value = (words[i >> 5] >>> (i % 32)) & 0xFF;
                hex += ((value < 16 ? '0' : '') + value.toString(16));
            }
            return hex;
        }
        
        const words = stringToWords(string);
        const hash = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
        
        for (let i = 0; i < words.length; i += 16) {
            const chunk = words.slice(i, i + 16);
            const result = md5Cycle(hash.slice(), chunk);
            for (let j = 0; j < 4; j++) {
                hash[j] = addUnsigned(hash[j], result[j]);
            }
        }
        
        return wordsToHex(hash);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Setup theme toggle
    setupThemeToggle();
    
    updateGreeting();
    setupEventListeners();
    setupAvatarUpload();
    
    // Check if user is already logged in
    if (currentUser) {
        showDashboard();
    }
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'success');
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}

// Debounce function to limit excessive function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Forgot password form
    document.getElementById('forgotPasswordFormElement').addEventListener('submit', handleForgotPassword);
    
    // Password strength checker
    document.getElementById('registerPassword').addEventListener('input', checkPasswordStrength);
    
    // Confirm password validation with debounce
    const debouncedPasswordMatch = debounce(validatePasswordMatch, 300);
    document.getElementById('confirmPassword').addEventListener('input', debouncedPasswordMatch);
    
    // Real-time email validation with debounce
    const debouncedEmailValidation = debounce(validateEmail, 300);
    document.getElementById('registerEmail').addEventListener('input', debouncedEmailValidation);
    document.getElementById('registerEmail').addEventListener('blur', validateEmail);
    
    // Mobile number validation
    document.getElementById('registerMobile').addEventListener('input', validateMobileNumber);
    document.getElementById('registerMobile').addEventListener('blur', validateMobileNumber);
}

// Avatar upload functionality
function setupAvatarUpload() {
    document.getElementById('avatarInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('userAvatar').src = e.target.result;
                if (currentUser) {
                    currentUser.avatar = e.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Update greeting based on time
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    
    if (hour < 12) {
        greeting = 'Good Morning!';
    } else if (hour < 17) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }
    
    document.getElementById('greetingText').textContent = greeting;
    if (document.getElementById('dashboardGreeting')) {
        document.getElementById('dashboardGreeting').textContent = greeting;
    }
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0;
    let strengthLabel = '';
    
    // Check password criteria
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update strength indicator
    strengthBar.className = 'strength-bar';
    
    switch (strength) {
        case 0:
        case 1:
            strengthBar.classList.add('weak');
            strengthLabel = 'Weak';
            break;
        case 2:
        case 3:
            strengthBar.classList.add('fair');
            strengthLabel = 'Fair';
            break;
        case 4:
            strengthBar.classList.add('good');
            strengthLabel = 'Good';
            break;
        case 5:
            strengthBar.classList.add('strong');
            strengthLabel = 'Strong';
            break;
    }
    
    strengthText.textContent = `Password Strength: ${strengthLabel}`;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword.length === 0) {
        // Empty field - neutral state
        confirmInput.style.borderColor = '#e1e5e9';
        confirmInput.classList.remove('valid', 'invalid');
    } else if (password === confirmPassword) {
        // Passwords match
        confirmInput.style.borderColor = '#2ed573';
        confirmInput.classList.add('valid');
        confirmInput.classList.remove('invalid');
    } else {
        // Passwords don't match
        confirmInput.style.borderColor = '#ff4757';
        confirmInput.classList.add('invalid');
        confirmInput.classList.remove('valid');
    }
}

// Email validation
function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.length === 0) {
        // Empty field - neutral state
        event.target.style.borderColor = '#e1e5e9';
        event.target.classList.remove('valid', 'invalid');
    } else if (emailRegex.test(email)) {
        // Valid email
        event.target.style.borderColor = '#2ed573';
        event.target.classList.add('valid');
        event.target.classList.remove('invalid');
    } else {
        // Invalid email
        event.target.style.borderColor = '#ff4757';
        event.target.classList.add('invalid');
        event.target.classList.remove('valid');
        
        // Only show toast on blur event with invalid email
        if (event.type === 'blur' && email.length > 0) {
            showToast('Please enter a valid email address', 'warning');
        }
    }
}

// Mobile number validation
function validateMobileNumber(event) {
    const mobile = event.target.value;
    const mobileRegex = /^[0-9]{10}$/;
    
    // Remove non-numeric characters
    const numericOnly = mobile.replace(/\D/g, '');
    event.target.value = numericOnly;
    
    // Limit to 10 digits maximum
    if (numericOnly.length > 10) {
        event.target.value = numericOnly.substring(0, 10);
        return;
    }
    
    // Only show validation feedback, not constant error messages
    if (numericOnly.length === 0) {
        // Empty field - neutral state
        event.target.style.borderColor = '#e1e5e9';
        event.target.classList.remove('valid', 'invalid');
    } else if (mobileRegex.test(numericOnly)) {
        // Valid 10-digit number
        event.target.style.borderColor = '#2ed573';
        event.target.classList.add('valid');
        event.target.classList.remove('invalid');
    } else {
        // Invalid number (less than 10 digits)
        event.target.style.borderColor = '#ffa502';
        event.target.classList.add('invalid');
        event.target.classList.remove('valid');
        
        // Only show toast on blur event, not on every input
        if (event.type === 'blur' && numericOnly.length > 0 && numericOnly.length < 10) {
            showToast('Mobile number must be 10 digits', 'warning');
        }
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('🔍 Login attempt:', { email, passwordLength: password.length });
    console.log('📦 Current users in storage:', users);
    
    showLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user
    const user = users.find(u => u.email === email || u.username === email);
    console.log('👤 Found user:', user ? 'YES' : 'NO');
    
    if (user) {
        console.log('🔑 Password verification:', {
            inputPassword: password,
            storedHash: user.passwordHash,
            isValid: MD5Hash.verify(password, user.passwordHash)
        });
        
        if (MD5Hash.verify(password, user.passwordHash)) {
            console.log('✉️ Email verified:', user.emailVerified);
            
            if (user.emailVerified) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isLoggedIn', 'true'); // Set login flag
                console.log('✅ Login successful, redirecting...');
                showToast('Login successful! Redirecting to dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                console.log('❌ Email not verified');
                showToast('Please verify your email first', 'warning');
                showEmailVerification();
            }
        } else {
            console.log('❌ Invalid password');
            showToast('Invalid password', 'error');
        }
    } else {
        console.log('❌ User not found');
        showToast('User not found. Please register first.', 'error');
    }
    
    showLoading(false);
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const mobile = document.getElementById('registerMobile').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate mobile number
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
        showToast('User already exists', 'error');
        return;
    }
    
    showLoading(true);
    
    // Hash password using MD5
    const passwordHash = MD5Hash.hash(password);
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        mobile,
        passwordHash,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        avatar: document.getElementById('userAvatar').src,
        totalLogins: 0
    };
    
    users.push(newUser);
    await fileStorage.saveUsers(users);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showLoading(false);
    showToast('Registration successful! Please verify your email.', 'success');
    
    // Show email verification
    currentUser = newUser;
    showEmailVerification();
}

// Handle forgot password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    showLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = users.find(u => u.email === email);
    
    if (user) {
        showToast('Password reset link sent to your email!', 'success');
    } else {
        showToast('Email not found', 'error');
    }
    
    showLoading(false);
}

// Show email verification modal
function showEmailVerification() {
    document.getElementById('emailVerificationModal').classList.remove('hidden');
    
    // Generate random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    // Store code temporarily
    window.tempVerificationCode = verificationCode;
    
    // Get user email from the registration form
    const userEmail = document.getElementById('registerEmail').value || currentUser?.email;
    const userName = document.getElementById('registerName').value || currentUser?.fullName || 'User';
    
    // Send verification code via email
    if (userEmail) {
        // Use simulated email for demo (replace with real email service)
        emailService.simulateEmailSend(userEmail, verificationCode);
    } else {
        // Fallback to screen display
        emailService.showCodeOnScreen(verificationCode);
    }
}

// Verify email
async function verifyEmail() {
    const enteredCode = document.getElementById('verificationCode').value;
    
    if (enteredCode === window.tempVerificationCode.toString()) {
        currentUser.emailVerified = true;
        
        // Update user in storage
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        await fileStorage.saveUsers(users);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeModal();
        showToast('Email verified successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showToast('Invalid verification code', 'error');
    }
}

// Resend verification
function resendVerification() {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    window.tempVerificationCode = verificationCode;
    
    // Get user email
    const userEmail = document.getElementById('registerEmail').value || currentUser?.email;
    const userName = document.getElementById('registerName').value || currentUser?.fullName || 'User';
    
    // Send new verification code via email
    if (userEmail) {
        emailService.simulateEmailSend(userEmail, verificationCode);
    } else {
        emailService.showCodeOnScreen(verificationCode);
    }
}

// Close modal
function closeModal() {
    document.getElementById('emailVerificationModal').classList.add('hidden');
}

// Show dashboard
function showDashboard() {
    // Hide all forms
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.add('hidden');
    
    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update dashboard content
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('dashboardAvatar').src = currentUser.avatar;
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.username}!`;
    
    updateGreeting();
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Hide dashboard
    document.getElementById('dashboard').classList.add('hidden');
    
    // Show login form
    showLoginForm();
    
    // Reset forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
    document.getElementById('forgotPasswordFormElement').reset();
    
    showToast('Logged out successfully', 'info');
}

// Clear field errors and validation states
function clearAllFieldErrors() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e5e9';
        input.classList.remove('valid', 'invalid');
    });
    
    // Clear any existing error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

// Form switching functions
function showLoginForm() {
    clearAllFieldErrors();
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.add('hidden');
    document.getElementById('greetingSubtext').textContent = 'Please sign in to your account';
}

function showRegisterForm() {
    clearAllFieldErrors();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('forgotPasswordForm').classList.add('hidden');
    document.getElementById('greetingSubtext').textContent = 'Create your new account';
}

function showForgotPassword() {
    clearAllFieldErrors();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.remove('hidden');
    document.getElementById('greetingSubtext').textContent = 'Reset your password';
}

// Loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    // Prevent duplicate messages
    const existingToasts = container.querySelectorAll('.toast');
    for (let toast of existingToasts) {
        const existingMessage = toast.querySelector('span').textContent;
        if (existingMessage === message) {
            return; // Don't show duplicate toast
        }
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after 3 seconds (reduced from 4)
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Demo function to add some test users
async function addDemoUsers() {
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 1,
                username: 'demo',
                email: 'demo@example.com',
                mobile: '9876543210',
                passwordHash: MD5Hash.hash('demo123'),
                emailVerified: true,
                createdAt: new Date().toISOString(),
                avatar: 'https://via.placeholder.com/120/4f46e5/ffffff?text=DEMO',
                totalLogins: 0
            }
        ];
        
        users.push(...demoUsers);
        await fileStorage.saveUsers(users);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Enter key in verification code input
    if (e.key === 'Enter' && document.activeElement.id === 'verificationCode') {
        verifyEmail();
    }
});

// Auto-focus on verification code input when modal opens
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modal = document.getElementById('emailVerificationModal');
            if (!modal.classList.contains('hidden')) {
                setTimeout(() => {
                    document.getElementById('verificationCode').focus();
                }, 100);
            }
        }
    });
});

observer.observe(document.getElementById('emailVerificationModal'), {
    attributes: true,
    attributeFilter: ['class']
});

// Form validation messages
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = '#ff4757';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4757';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = '#e1e5e9';
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Clear errors on input
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT') {
        clearFieldError(e.target.id);
    }
});

console.log('🚀 Interactive Login Portal Loaded Successfully!');
console.log('💡 Demo credentials: email: demo@example.com, password: demo123');
console.log('📧 Email verification codes will be shown in console for demo purposes');
console.log('🔐 Password encryption: MD5 with salt');
console.log('📱 Mobile number validation: 10-digit numeric only');
console.log('🎯 Login success redirects to dashboard.html');
