// Advanced UI Features - Clean Version
// Real-time Notifications, Smart Onboarding, Social Authentication, Intelligent Search

// Real-time Notifications System
class RealtimeNotifications {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.requestPermission();
    }

    createContainer() {
        this.container = document.getElementById('notificationsPanel');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationsPanel';
            this.container.className = 'notifications-panel hidden';
            document.body.appendChild(this.container);
        }

        // Add notification button listener
        const notifyBtn = document.getElementById('notificationsButton');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => this.toggleNotifications());
        }
    }

    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    show(title, message, type = 'info', action = null) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            action,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(notification);
        this.updateUI();
        this.showToast(notification);

        // Browser notification for important alerts
        if (type === 'error' || type === 'warning') {
            this.showBrowserNotification(title, message);
        }

        // Auto-remove after 5 seconds for toast
        setTimeout(() => {
            this.removeToast(notification.id);
        }, 5000);
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.id = `toast-${notification.id}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close" onclick="window.advancedFeatures.realtimeNotifications.removeToast(${notification.id})">
                <i class="fas fa-times"></i>
            </button>
        `;

        if (notification.action) {
            toast.addEventListener('click', notification.action);
            toast.style.cursor = 'pointer';
        }

        const container = document.getElementById('toastContainer') || document.body;
        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
    }

    removeToast(id) {
        const toast = document.getElementById(`toast-${id}`);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }

    showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    toggleNotifications() {
        if (this.container.classList.contains('hidden')) {
            this.showNotifications();
        } else {
            this.hideNotifications();
        }
    }

    showNotifications() {
        this.container.classList.remove('hidden');
        this.updateUI();
    }

    hideNotifications() {
        this.container.classList.add('hidden');
    }

    updateUI() {
        const badge = document.getElementById('notificationBadge');
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        this.renderNotifications();
    }

    renderNotifications() {
        const content = this.container.querySelector('.notifications-content');
        if (!content) return;

        if (this.notifications.length === 0) {
            content.innerHTML = '<div class="no-notifications">No notifications</div>';
            return;
        }

        content.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 onclick="window.advancedFeatures.realtimeNotifications.markAsRead(${notification.id})">
                <div class="notification-icon">
                    <i class="fas fa-${this.getIconForType(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getIconForType(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'bell';
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
        return timestamp.toLocaleDateString();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.updateUI();
        }
    }

    clear() {
        this.notifications = [];
        this.updateUI();
    }
}

// Smart Onboarding System
class SmartOnboarding {
    constructor() {
        this.steps = [
            {
                target: '#loginEmail',
                title: 'Welcome to Portal!',
                description: 'Let\'s start with entering your email address.',
                position: 'bottom'
            },
            {
                target: '#themeToggle',
                title: 'Dark Mode',
                description: 'Toggle between light and dark themes for your comfort.',
                position: 'bottom'
            },
            {
                target: '.social-login-container',
                title: 'Quick Login',
                description: 'Use social login for faster access to your account.',
                position: 'top'
            },
            {
                target: '#searchButton',
                title: 'Smart Search',
                description: 'Use intelligent search to find anything quickly.',
                position: 'bottom'
            },
            {
                target: '#analyticsButton',
                title: 'Analytics',
                description: 'View your usage analytics and insights here.',
                position: 'bottom'
            }
        ];
        this.currentStep = 0;
        this.overlay = null;
        this.tooltip = null;
    }

    start() {
        if (localStorage.getItem('onboarding_completed')) return;
        
        this.createOverlay();
        this.showStep(0);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.id = 'onboardingOverlay';
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'onboarding-tooltip';
        this.tooltip.id = 'onboardingTooltip';
        
        this.overlay.appendChild(this.tooltip);
        document.body.appendChild(this.overlay);
    }

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[stepIndex];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextStep();
            return;
        }

        this.currentStep = stepIndex;
        this.highlightElement(target);
        this.positionTooltip(target, step);
        this.updateTooltipContent(step);
        this.overlay.classList.remove('hidden');
    }

    highlightElement(element) {
        // Remove previous highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });
        
        element.classList.add('onboarding-highlight');
    }

    positionTooltip(target, step) {
        const rect = target.getBoundingClientRect();
        const tooltip = this.tooltip;
        
        // Reset classes
        tooltip.className = 'onboarding-tooltip';
        
        switch (step.position) {
            case 'top':
                tooltip.style.top = `${rect.top - 120}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - 150}px`;
                tooltip.classList.add('position-top');
                break;
            case 'bottom':
                tooltip.style.top = `${rect.bottom + 20}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - 150}px`;
                tooltip.classList.add('position-bottom');
                break;
            case 'left':
                tooltip.style.top = `${rect.top + rect.height / 2 - 60}px`;
                tooltip.style.left = `${rect.left - 320}px`;
                tooltip.classList.add('position-left');
                break;
            case 'right':
                tooltip.style.top = `${rect.top + rect.height / 2 - 60}px`;
                tooltip.style.left = `${rect.right + 20}px`;
                tooltip.classList.add('position-right');
                break;
        }
    }

    updateTooltipContent(step) {
        this.tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
            <div class="tooltip-actions">
                <button class="onboarding-btn skip" onclick="window.advancedFeatures.smartOnboarding.skipTour()">Skip Tour</button>
                <div class="tooltip-nav">
                    <span class="step-indicator">${this.currentStep + 1} of ${this.steps.length}</span>
                    ${this.currentStep > 0 ? '<button class="onboarding-btn prev" onclick="window.advancedFeatures.smartOnboarding.prevStep()">Previous</button>' : ''}
                    <button class="onboarding-btn next" onclick="window.advancedFeatures.smartOnboarding.nextStep()">
                        ${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;
    }

    nextStep() {
        this.showStep(this.currentStep + 1);
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    skipTour() {
        this.complete();
    }

    complete() {
        localStorage.setItem('onboarding_completed', 'true');
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });
        
        if (this.overlay) {
            this.overlay.classList.add('hidden');
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        }

        // Show completion notification
        if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
            window.advancedFeatures.realtimeNotifications.show(
                'Tour Complete!',
                'You\'re all set to explore Portal\'s features.',
                'success'
            );
        }
    }

    restart() {
        localStorage.removeItem('onboarding_completed');
        this.start();
    }
}

// Social Authentication (Clean Version)
class SocialAuthentication {
    constructor() {
        this.providers = {
            google: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                scope: 'email profile'
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
    }

    loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = () => console.error(`Failed to load script: ${src}`);
        document.head.appendChild(script);
    }

    initializeGoogle() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: this.providers.google.clientId,
                callback: (response) => this.handleGoogleResponse(response)
            });
        }
    }

    async loginWith(provider) {
        try {
            switch (provider) {
                case 'google':
                    await this.loginWithGoogle();
                    break;
                case 'github':
                    await this.loginWithGitHub();
                    break;
                case 'microsoft':
                    await this.loginWithMicrosoft();
                    break;
                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Social login error (${provider}):`, error);
            if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
                window.advancedFeatures.realtimeNotifications.show(
                    'Login Failed',
                    `Unable to login with ${provider}. Please try again.`,
                    'error'
                );
            }
        }
    }

    async loginWithGoogle() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        } else {
            // Fallback: redirect to Google OAuth
            const params = new URLSearchParams({
                client_id: this.providers.google.clientId,
                redirect_uri: window.location.origin,
                response_type: 'code',
                scope: this.providers.google.scope
            });
            window.location.href = `https://accounts.google.com/oauth/authorize?${params}`;
        }
    }

    async loginWithGitHub() {
        const params = new URLSearchParams({
            client_id: this.providers.github.clientId,
            redirect_uri: window.location.origin,
            scope: this.providers.github.scope
        });
        window.location.href = `https://github.com/login/oauth/authorize?${params}`;
    }

    async loginWithMicrosoft() {
        const params = new URLSearchParams({
            client_id: this.providers.microsoft.clientId,
            redirect_uri: window.location.origin,
            response_type: 'code',
            scope: this.providers.microsoft.scope
        });
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
    }

    handleGoogleResponse(response) {
        // Decode JWT token to get user info
        const userInfo = this.parseJWT(response.credential);
        this.handleSuccessfulLogin('google', userInfo);
    }

    parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    handleSuccessfulLogin(provider, userInfo) {
        // Store user info
        const userData = {
            provider,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        // Show success notification
        if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
            window.advancedFeatures.realtimeNotifications.show(
                'Login Successful',
                `Welcome back via ${provider}!`,
                'success'
            );
        }

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// Intelligent Search System
class IntelligentSearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.searchIndex = [];
        this.isVisible = false;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.setupEventListeners();
    }

    buildSearchIndex() {
        // Build search index from page content
        this.searchIndex = [
            { type: 'page', title: 'Login', description: 'Sign in to your account', url: 'index.html' },
            { type: 'page', title: 'Dashboard', description: 'Your main dashboard', url: 'dashboard.html' },
            { type: 'feature', title: 'Dark Mode', description: 'Toggle dark/light theme' },
            { type: 'feature', title: 'Analytics', description: 'View usage analytics and insights' },
            { type: 'feature', title: 'Notifications', description: 'Real-time alerts and updates' },
            { type: 'feature', title: 'Social Login', description: 'Login with Google, GitHub, Microsoft' },
            { type: 'action', title: 'Edit Profile', description: 'Update your personal information' },
            { type: 'action', title: 'Change Password', description: 'Update account password' },
            { type: 'action', title: 'Account Settings', description: 'Manage preferences and privacy' }
        ];
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.showSearch());
        }

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showSearch();
            }
            if (e.key === 'Escape' && this.isVisible) {
                this.hideSearch();
            }
        });
    }

    showSearch() {
        const overlay = document.getElementById('searchOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.isVisible = true;
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }
        }
    }

    hideSearch() {
        const overlay = document.getElementById('searchOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.isVisible = false;
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showSuggestions();
            return;
        }

        const results = this.search(query);
        this.displayResults(results);
    }

    search(query) {
        const normalizedQuery = query.toLowerCase();
        const results = [];

        this.searchIndex.forEach(item => {
            let score = 0;
            
            // Exact title match
            if (item.title.toLowerCase().includes(normalizedQuery)) {
                score += 10;
            }
            
            // Description match
            if (item.description.toLowerCase().includes(normalizedQuery)) {
                score += 5;
            }
            
            // Fuzzy match for typos
            if (this.fuzzyMatch(item.title.toLowerCase(), normalizedQuery)) {
                score += 3;
            }

            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }

    fuzzyMatch(text, pattern) {
        const textLen = text.length;
        const patternLen = pattern.length;
        
        if (patternLen > textLen) return false;
        if (patternLen === textLen) return text === pattern;
        
        let textIdx = 0;
        let patternIdx = 0;
        
        while (textIdx < textLen && patternIdx < patternLen) {
            if (text[textIdx] === pattern[patternIdx]) {
                patternIdx++;
            }
            textIdx++;
        }
        
        return patternIdx === patternLen;
    }

    showSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;

        const recentSearches = this.searchHistory.slice(0, 5);
        const popularItems = this.searchIndex.slice(0, 6);

        suggestionsContainer.innerHTML = `
            ${recentSearches.length > 0 ? `
                <div class="suggestion-group">
                    <h4>Recent Searches</h4>
                    ${recentSearches.map(search => `
                        <div class="suggestion-item" onclick="window.advancedFeatures.intelligentSearch.handleSearch('${search}')">
                            <i class="fas fa-history"></i>
                            <span>${search}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="suggestion-group">
                <h4>Quick Actions</h4>
                ${popularItems.map(item => `
                    <div class="suggestion-item" onclick="window.advancedFeatures.intelligentSearch.selectItem('${item.title}')">
                        <i class="fas fa-${this.getIconForType(item.type)}"></i>
                        <div>
                            <div class="suggestion-title">${item.title}</div>
                            <div class="suggestion-desc">${item.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <div class="result-item" onclick="window.advancedFeatures.intelligentSearch.selectItem('${result.title}')">
                <i class="fas fa-${this.getIconForType(result.type)}"></i>
                <div class="result-content">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                    <div class="result-type">${result.type}</div>
                </div>
            </div>
        `).join('');
    }

    selectItem(title) {
        // Add to search history
        if (!this.searchHistory.includes(title)) {
            this.searchHistory.unshift(title);
            this.saveSearchHistory();
        }

        // Handle the selection based on item type
        const item = this.searchIndex.find(i => i.title === title);
        if (item) {
            if (item.url) {
                window.location.href = item.url;
            } else {
                // Trigger feature action
                this.triggerFeature(item.title);
            }
        }

        this.hideSearch();
    }

    triggerFeature(featureName) {
        switch (featureName) {
            case 'Dark Mode':
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) themeToggle.click();
                break;
            case 'Analytics':
                const analyticsBtn = document.getElementById('analyticsButton');
                if (analyticsBtn) analyticsBtn.click();
                break;
            case 'Notifications':
                const notificationsBtn = document.getElementById('notificationsButton');
                if (notificationsBtn) notificationsBtn.click();
                break;
            default:
                if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
                    window.advancedFeatures.realtimeNotifications.show(
                        'Feature',
                        `${featureName} selected`,
                        'info'
                    );
                }
        }
    }

    getIconForType(type) {
        const icons = {
            page: 'file-alt',
            feature: 'cog',
            action: 'play',
            user: 'user'
        };
        return icons[type] || 'search';
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RealtimeNotifications,
        SmartOnboarding,
        SocialAuthentication,
        IntelligentSearch
    };
}
