// Real-time Notifications System
class RealtimeNotifications {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.websocket = null;
        this.notificationQueue = [];
        this.maxNotifications = 5;
    }

    init() {
        this.createContainer();
        this.setupWebSocket();
        this.requestNotificationPermission();
        this.setupServiceWorker();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'realtime-notifications';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupWebSocket() {
        // Simulate WebSocket connection for real-time notifications
        // In production, this would connect to your WebSocket server
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance every interval
                this.simulateRealTimeNotification();
            }
        }, 5000);
    }

    simulateRealTimeNotification() {
        const notifications = [
            { type: 'security', message: 'New login from Chrome browser', priority: 'medium' },
            { type: 'update', message: 'Security update available', priority: 'high' },
            { type: 'info', message: 'Password will expire in 7 days', priority: 'low' },
            { type: 'warning', message: 'Suspicious activity detected', priority: 'high' }
        ];
        
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        this.show(notification.message, notification.type, notification.priority);
    }

    show(message, type = 'info', priority = 'medium', duration = 5000) {
        const notificationId = Date.now().toString();
        
        const notification = this.createNotificationElement(notificationId, message, type, priority);
        
        // Add to container
        this.container.appendChild(notification);
        this.notifications.set(notificationId, notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notificationId);
            }, duration);
        }
        
        // Show browser notification if permission granted
        this.showBrowserNotification(message, type);
        
        // Manage queue
        this.manageNotificationQueue();
        
        return notificationId;
    }

    createNotificationElement(id, message, type, priority) {
        const notification = document.createElement('div');
        notification.className = `realtime-notification ${type} priority-${priority}`;
        notification.style.cssText = `
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-left: 4px solid var(--color-primary);
            border-radius: var(--border-radius);
            padding: 16px;
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            min-width: 300px;
        `;
        
        // Set border color based on type
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            security: '#8b5cf6'
        };
        
        if (colors[type]) {
            notification.style.borderLeftColor = colors[type];
        }
        
        // Set priority styling
        if (priority === 'high') {
            notification.style.animation = 'pulse 1s infinite';
        }
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            security: 'fas fa-shield-alt'
        };
        
        notification.innerHTML = `
            <div class="notification-header">
                <i class="${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}; margin-right: 8px;"></i>
                <span class="notification-type">${type.toUpperCase()}</span>
                <button class="notification-close" onclick="window.advancedFeatures.notifications.remove('${id}')" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: 4px;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message" style="margin-top: 8px; color: var(--color-text-primary);">
                ${message}
            </div>
            <div class="notification-timestamp" style="
                margin-top: 8px;
                font-size: 12px;
                color: var(--color-text-secondary);
            ">
                ${new Date().toLocaleTimeString()}
            </div>
        `;
        
        // Click to dismiss
        notification.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close')) {
                this.remove(id);
            }
        });
        
        return notification;
    }

    remove(notificationId) {
        const notification = this.notifications.get(notificationId);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(notificationId);
            }, 300);
        }
    }

    showBrowserNotification(message, type) {
        if (Notification.permission === 'granted') {
            const notification = new Notification('Portal Notification', {
                body: message,
                icon: '/favicon.ico',
                tag: type,
                requireInteraction: type === 'security'
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);
        }
    }

    manageNotificationQueue() {
        if (this.notifications.size > this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }
    }

    clear() {
        this.notifications.forEach((_, id) => this.remove(id));
    }

    getCount() {
        return this.notifications.size;
    }
}

// Smart Onboarding System
class SmartOnboarding {
    constructor() {
        this.steps = [];
        this.currentStep = 0;
        this.userProgress = {};
        this.isActive = false;
    }

    init() {
        this.loadUserProgress();
        this.setupOnboardingSteps();
        this.checkIfOnboardingNeeded();
    }

    setupOnboardingSteps() {
        this.steps = [
            {
                id: 'welcome',
                title: 'Welcome to Portal!',
                content: 'Let us guide you through the amazing features of our secure login system.',
                target: '.logo',
                position: 'bottom',
                action: null
            },
            {
                id: 'theme-toggle',
                title: 'Theme Toggle',
                content: 'Switch between light and dark modes for the best viewing experience.',
                target: '#themeToggle',
                position: 'bottom',
                action: () => this.highlightElement('#themeToggle')
            },
            {
                id: 'security-features',
                title: 'Advanced Security',
                content: 'We use AI-powered security, biometric authentication, and advanced password protection.',
                target: '.password-input',
                position: 'top',
                action: () => this.showSecurityDemo()
            },
            {
                id: 'shortcuts',
                title: 'Keyboard Shortcuts',
                content: 'Use Ctrl+K for quick search, Ctrl+/ for help, and Ctrl+D for dashboard overview.',
                target: 'body',
                position: 'center',
                action: () => this.showShortcutDemo()
            },
            {
                id: 'complete',
                title: 'You\'re All Set!',
                content: 'Enjoy using Portal with all its advanced features. Need help? Press Ctrl+/ anytime!',
                target: 'body',
                position: 'center',
                action: () => this.completeOnboarding()
            }
        ];
    }

    checkIfOnboardingNeeded() {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setTimeout(() => this.start(), 2000); // Start after 2 seconds
        }
    }

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.createOnboardingOverlay();
        this.showStep(0);
    }

    createOnboardingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        
        const tooltip = document.createElement('div');
        tooltip.id = 'onboarding-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-lg);
            padding: 20px;
            max-width: 320px;
            box-shadow: var(--shadow-xl);
            z-index: 10001;
            pointer-events: auto;
        `;
        document.body.appendChild(tooltip);
    }

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[stepIndex];
        const tooltip = document.getElementById('onboarding-tooltip');
        const overlay = document.getElementById('onboarding-overlay');
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight target element
        if (step.target !== 'body') {
            this.highlightElement(step.target);
        }
        
        // Update tooltip content
        tooltip.innerHTML = `
            <div class="onboarding-header">
                <h3 style="margin: 0 0 10px 0; color: var(--color-text-primary);">${step.title}</h3>
                <div class="step-indicator" style="
                    display: flex;
                    gap: 4px;
                    margin-bottom: 15px;
                ">
                    ${this.steps.map((_, i) => `
                        <div style="
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: ${i === stepIndex ? 'var(--color-primary)' : 'var(--color-border)'};
                        "></div>
                    `).join('')}
                </div>
            </div>
            <div class="onboarding-content">
                <p style="margin: 0 0 20px 0; color: var(--color-text-secondary); line-height: 1.5;">
                    ${step.content}
                </p>
                <div class="onboarding-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                    ${stepIndex > 0 ? '<button class="onboarding-btn secondary" onclick="window.advancedFeatures.onboarding.previousStep()">Previous</button>' : ''}
                    <button class="onboarding-btn primary" onclick="window.advancedFeatures.onboarding.nextStep()">
                        ${stepIndex === this.steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                    <button class="onboarding-btn skip" onclick="window.advancedFeatures.onboarding.skip()">Skip Tour</button>
                </div>
            </div>
        `;
        
        // Position tooltip
        this.positionTooltip(tooltip, step.target, step.position);
        
        // Execute step action
        if (step.action) {
            step.action();
        }
        
        this.currentStep = stepIndex;
    }

    positionTooltip(tooltip, targetSelector, position) {
        if (targetSelector === 'body') {
            // Center on screen
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.warn('Onboarding target not found:', targetSelector);
            return;
        }
        
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - 10;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = targetRect.bottom + 10;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.left - tooltipRect.width - 10;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.right + 10;
                break;
            default:
                top = targetRect.bottom + 10;
                left = targetRect.left;
        }
        
        // Ensure tooltip stays within viewport
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        
        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
        tooltip.style.transform = 'none';
    }

    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.position = 'relative';
            element.style.zIndex = '10002';
            element.style.boxShadow = '0 0 0 4px var(--color-primary), 0 0 20px rgba(16, 163, 127, 0.3)';
            element.style.borderRadius = 'var(--border-radius)';
            element.classList.add('onboarding-highlight');
        }
    }

    clearHighlights() {
        const highlighted = document.querySelectorAll('.onboarding-highlight');
        highlighted.forEach(el => {
            el.style.position = '';
            el.style.zIndex = '';
            el.style.boxShadow = '';
            el.classList.remove('onboarding-highlight');
        });
    }

    nextStep() {
        this.showStep(this.currentStep + 1);
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    skip() {
        this.complete();
    }

    complete() {
        this.isActive = false;
        this.clearHighlights();
        
        const overlay = document.getElementById('onboarding-overlay');
        const tooltip = document.getElementById('onboarding-tooltip');
        
        if (overlay) overlay.remove();
        if (tooltip) tooltip.remove();
        
        localStorage.setItem('hasSeenOnboarding', 'true');
        
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Onboarding completed! Welcome to Portal!',
                'success'
            );
        }
    }

    showSecurityDemo() {
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Security features are now active and monitoring',
                'security'
            );
        }
    }

    showShortcutDemo() {
        const shortcuts = [
            'Ctrl+K: Quick Search',
            'Ctrl+/: Help Menu',
            'Ctrl+D: Dashboard',
            'Esc: Close Modal'
        ];
        
        shortcuts.forEach((shortcut, index) => {
            setTimeout(() => {
                if (window.advancedFeatures?.notifications) {
                    window.advancedFeatures.notifications.show(shortcut, 'info', 'low', 3000);
                }
            }, index * 500);
        });
    }

    completeOnboarding() {
        this.complete();
    }

    loadUserProgress() {
        const stored = localStorage.getItem('onboardingProgress');
        this.userProgress = stored ? JSON.parse(stored) : {};
    }

    saveUserProgress() {
        localStorage.setItem('onboardingProgress', JSON.stringify(this.userProgress));
    }

    restart() {
        localStorage.removeItem('hasSeenOnboarding');
        this.start();
    }
}

// Social Authentication
class SocialAuthentication {
    constructor() {
        this.providers = {
            google: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                scope: 'email profile'
            },
            facebook: {
                appId: 'YOUR_FACEBOOK_APP_ID',
                scope: 'email'
            },
            github: {
                clientId: 'YOUR_GITHUB_CLIENT_ID',
                scope: 'user:email'
            },
            microsoft: {
                clientId: 'YOUR_MICROSOFT_CLIENT_ID',
                scope: 'https://graph.microsoft.com/user.read'
            }
        };
    }

    init() {
        this.addSocialLoginButtons();
        this.loadSDKs();
    }

    addSocialLoginButtons() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        // Check if social login already exists to prevent duplicates
        if (loginForm.querySelector('.social-login-container')) return;
        
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-login-container';
        socialContainer.innerHTML = `
            <div class="social-divider">
                <span>Or continue with</span>
            </div>
            <div class="social-buttons">
                <button type="button" class="social-btn google" onclick="window.advancedFeatures.socialAuth.loginWith('google')">
                    <i class="fab fa-google"></i>
                    <span>Google</span>
                </button>
                <button type="button" class="social-btn github" onclick="window.advancedFeatures.socialAuth.loginWith('github')">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                </button>
                <button type="button" class="social-btn microsoft" onclick="window.advancedFeatures.socialAuth.loginWith('microsoft')">
                    <i class="fab fa-microsoft"></i>
                    <span>Microsoft</span>
                </button>
            </div>
        `;
        
        const submitButton = loginForm.querySelector('.submit-button');
        if (submitButton) {
            submitButton.parentNode.insertBefore(socialContainer, submitButton);
        }
    }

    loadSDKs() {
        // Load Google SDK
        this.loadScript('https://accounts.google.com/gsi/client', () => {
            this.initializeGoogle();
        });
        
        // Load Facebook SDK
        this.loadScript('https://connect.facebook.net/en_US/sdk.js', () => {
            this.initializeFacebook();
        });
    }

    loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = () => console.error('Failed to load script:', src);
        document.head.appendChild(script);
    }

    initializeGoogle() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: this.providers.google.clientId,
                callback: this.handleGoogleResponse.bind(this)
            });
        }
    }

    initializeFacebook() {
        if (typeof FB !== 'undefined') {
            FB.init({
                appId: this.providers.facebook.appId,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
        }
    }

    async loginWith(provider) {
        try {
            switch (provider) {
                case 'google':
                    await this.loginWithGoogle();
                    break;
                case 'facebook':
                    await this.loginWithFacebook();
                    break;
                case 'github':
                    await this.loginWithGitHub();
                    break;
                case 'microsoft':
                    await this.loginWithMicrosoft();
                    break;
                default:
                    throw new Error('Unsupported provider');
            }
        } catch (error) {
            console.error('Social login error:', error);
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    `${provider} login failed: ${error.message}`,
                    'error'
                );
            }
        }
    }

    async loginWithGoogle() {
        // Simulate Google OAuth flow
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Redirecting to Google for authentication...',
                'info'
            );
        }
        
        // In a real implementation, this would trigger the actual OAuth flow
        setTimeout(() => {
            this.simulateSocialLogin('Google', {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                picture: 'https://via.placeholder.com/120/4f46e5/ffffff?text=JD'
            });
        }, 2000);
    }

    async loginWithFacebook() {
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Redirecting to Facebook for authentication...',
                'info'
            );
        }
        
        setTimeout(() => {
            this.simulateSocialLogin('Facebook', {
                name: 'Jane Smith',
                email: 'jane.smith@facebook.com',
                picture: 'https://via.placeholder.com/120/1877f2/ffffff?text=JS'
            });
        }, 2000);
    }

    async loginWithGitHub() {
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Redirecting to GitHub for authentication...',
                'info'
            );
        }
        
        setTimeout(() => {
            this.simulateSocialLogin('GitHub', {
                name: 'Developer User',
                email: 'developer@github.com',
                picture: 'https://via.placeholder.com/120/333/ffffff?text=DEV'
            });
        }, 2000);
    }

    async loginWithMicrosoft() {
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Redirecting to Microsoft for authentication...',
                'info'
            );
        }
        
        setTimeout(() => {
            this.simulateSocialLogin('Microsoft', {
                name: 'Corporate User',
                email: 'user@outlook.com',
                picture: 'https://via.placeholder.com/120/00a1f1/ffffff?text=CU'
            });
        }, 2000);
    }

    simulateSocialLogin(provider, userData) {
        // Create a user object from social login data
        const socialUser = {
            id: Date.now(),
            fullName: userData.name,
            email: userData.email,
            avatar: userData.picture,
            provider: provider.toLowerCase(),
            emailVerified: true,
            registrationDate: new Date().toISOString(),
            totalLogins: 1,
            socialLogin: true
        };
        
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(socialUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                `Successfully signed in with ${provider}!`,
                'success'
            );
        }
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    handleGoogleResponse(response) {
        // Handle Google OAuth response
        console.log('Google response:', response);
        // Process the JWT token and extract user information
        // This would decode the JWT and create a user session
    }

    logout(provider) {
        switch (provider) {
            case 'google':
                if (typeof google !== 'undefined') {
                    google.accounts.id.disableAutoSelect();
                }
                break;
            case 'facebook':
                if (typeof FB !== 'undefined') {
                    FB.logout();
                }
                break;
            default:
                break;
        }
    }
}

// Intelligent Search System
class IntelligentSearch {
    constructor() {
        this.searchIndex = new Map();
        this.searchHistory = [];
        this.suggestions = [];
        this.isActive = false;
    }

    init() {
        this.buildSearchIndex();
        this.loadSearchHistory();
        this.setupQuickSearch();
    }

    buildSearchIndex() {
        // Index searchable content
        const searchableElements = document.querySelectorAll('[data-searchable], h1, h2, h3, label, button');
        
        searchableElements.forEach(element => {
            const text = element.textContent.trim().toLowerCase();
            const id = element.id || `element-${Math.random().toString(36).substr(2, 9)}`;
            
            if (text.length > 0) {
                this.searchIndex.set(text, {
                    element,
                    id,
                    text,
                    type: element.tagName.toLowerCase(),
                    keywords: this.extractKeywords(text)
                });
            }
        });
        
        console.log(`🔍 Search index built with ${this.searchIndex.size} items`);
    }

    extractKeywords(text) {
        return text.split(/\s+/)
                  .filter(word => word.length > 2)
                  .map(word => word.replace(/[^\w]/g, ''));
    }

    setupQuickSearch() {
        // Create quick search overlay
        const overlay = document.createElement('div');
        overlay.id = 'quick-search-overlay';
        overlay.className = 'quick-search-overlay hidden';
        overlay.innerHTML = `
            <div class="quick-search-modal">
                <div class="search-input-container">
                    <i class="fas fa-search"></i>
                    <input type="text" id="quick-search-input" placeholder="Search anything..." autocomplete="off">
                    <button class="search-close" onclick="window.advancedFeatures.smartSearch.closeQuickSearch()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-results" id="search-results"></div>
                <div class="search-footer">
                    <div class="search-shortcuts">
                        <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>Esc</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup search input handler
        const searchInput = document.getElementById('quick-search-input');
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchNavigation(e);
        });
    }

    openQuickSearch() {
        const overlay = document.getElementById('quick-search-overlay');
        const input = document.getElementById('quick-search-input');
        
        overlay.classList.remove('hidden');
        input.focus();
        this.isActive = true;
        
        // Show recent searches
        this.showRecentSearches();
    }

    closeQuickSearch() {
        const overlay = document.getElementById('quick-search-overlay');
        const input = document.getElementById('quick-search-input');
        
        overlay.classList.add('hidden');
        input.value = '';
        this.isActive = false;
        
        // Clear results
        document.getElementById('search-results').innerHTML = '';
    }

    performSearch(query) {
        if (query.length < 2) {
            this.showRecentSearches();
            return;
        }
        
        const results = this.fuzzySearch(query);
        this.displaySearchResults(results, query);
    }

    fuzzySearch(query) {
        const queryLower = query.toLowerCase();
        const results = [];
        
        this.searchIndex.forEach((item) => {
            let score = 0;
            
            // Exact match
            if (item.text.includes(queryLower)) {
                score += 100;
            }
            
            // Keyword match
            const matchingKeywords = item.keywords.filter(keyword => 
                keyword.toLowerCase().includes(queryLower)
            );
            score += matchingKeywords.length * 20;
            
            // Fuzzy match
            score += this.calculateFuzzyScore(queryLower, item.text);
            
            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    matchingKeywords
                });
            }
        });
        
        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }

    calculateFuzzyScore(query, text) {
        let score = 0;
        let queryIndex = 0;
        
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                score += 1;
                queryIndex++;
            }
        }
        
        return score;
    }

    displaySearchResults(results, query) {
        const container = document.getElementById('search-results');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = results.map((result, index) => `
            <div class="search-result-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                <div class="result-icon">
                    <i class="fas fa-${this.getIconForType(result.type)}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${this.highlightText(result.text, query)}</div>
                    <div class="result-type">${result.type.toUpperCase()}</div>
                </div>
                <div class="result-score">${result.score}</div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.selectSearchResult(results[index]);
            });
        });
    }

    showRecentSearches() {
        const container = document.getElementById('search-results');
        
        if (this.searchHistory.length === 0) {
            container.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-history"></i>
                    <p>Start typing to search...</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="search-section-title">Recent Searches</div>
            ${this.searchHistory.slice(-5).reverse().map((search, index) => `
                <div class="search-result-item recent" data-query="${search.query}">
                    <div class="result-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <div class="result-content">
                        <div class="result-title">${search.query}</div>
                        <div class="result-type">Recent Search</div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getIconForType(type) {
        const icons = {
            'button': 'hand-pointer',
            'input': 'edit',
            'h1': 'heading',
            'h2': 'heading',
            'h3': 'heading',
            'label': 'tag',
            'div': 'square',
            'span': 'font'
        };
        return icons[type] || 'circle';
    }

    handleSearchNavigation(e) {
        const results = document.querySelectorAll('.search-result-item');
        const selected = document.querySelector('.search-result-item.selected');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selected) {
                const nextIndex = Math.min(
                    parseInt(selected.dataset.index || '0') + 1,
                    results.length - 1
                );
                this.selectResultByIndex(nextIndex);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selected) {
                const prevIndex = Math.max(
                    parseInt(selected.dataset.index || '0') - 1,
                    0
                );
                this.selectResultByIndex(prevIndex);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selected && selected.dataset.index) {
                // Get the corresponding result and select it
                // This would need access to the current results array
                this.activateSelectedResult();
            }
        } else if (e.key === 'Escape') {
            this.closeQuickSearch();
        }
    }

    selectResultByIndex(index) {
        const results = document.querySelectorAll('.search-result-item');
        results.forEach(item => item.classList.remove('selected'));
        
        if (results[index]) {
            results[index].classList.add('selected');
            results[index].scrollIntoView({ block: 'nearest' });
        }
    }

    selectSearchResult(result) {
        // Add to search history
        this.searchHistory.push({
            query: result.text,
            timestamp: Date.now()
        });
        this.saveSearchHistory();
        
        // Scroll to element
        if (result.element) {
            result.element.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the element briefly
            result.element.style.background = 'var(--color-primary)';
            result.element.style.color = 'white';
            result.element.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                result.element.style.background = '';
                result.element.style.color = '';
            }, 2000);
        }
        
        this.closeQuickSearch();
    }

    activateSelectedResult() {
        const selected = document.querySelector('.search-result-item.selected');
        if (selected) {
            selected.click();
        }
    }

    provideAutoComplete(input) {
        const value = input.value.toLowerCase();
        if (value.length < 2) return;
        
        // Find matching suggestions
        const suggestions = Array.from(this.searchIndex.values())
            .filter(item => item.text.includes(value))
            .slice(0, 5)
            .map(item => item.text);
        
        this.showAutoCompleteSuggestions(input, suggestions);
    }

    showAutoCompleteSuggestions(input, suggestions) {
        let dropdown = input.parentNode.querySelector('.autocomplete-dropdown');
        
        if (suggestions.length === 0) {
            if (dropdown) dropdown.remove();
            return;
        }
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'autocomplete-dropdown';
            input.parentNode.appendChild(dropdown);
        }
        
        dropdown.innerHTML = suggestions.map(suggestion => `
            <div class="autocomplete-item" onclick="this.parentNode.previousElementSibling.value = '${suggestion}'; this.parentNode.remove();">
                ${suggestion}
            </div>
        `).join('');
        
        // Position dropdown
        const inputRect = input.getBoundingClientRect();
        dropdown.style.cssText = `
            position: absolute;
            top: ${inputRect.height}px;
            left: 0;
            width: 100%;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;
    }

    loadSearchHistory() {
        const stored = localStorage.getItem('searchHistory');
        this.searchHistory = stored ? JSON.parse(stored) : [];
    }

    saveSearchHistory() {
        // Keep only last 50 searches
        if (this.searchHistory.length > 50) {
            this.searchHistory = this.searchHistory.slice(-50);
        }
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
}

// Export classes for use in advanced-features.js
window.RealtimeNotifications = RealtimeNotifications;
window.SmartOnboarding = SmartOnboarding;
window.SocialAuthentication = SocialAuthentication;
window.IntelligentSearch = IntelligentSearch;
