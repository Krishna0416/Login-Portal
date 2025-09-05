// Advanced Features Module - AI-Powered Login Portal
class AdvancedFeatures {
    constructor() {
        this.securityAnalyzer = new SecurityAnalyzer();
        this.passwordManager = new AdvancedPasswordManager();
        this.realtimeNotifications = new RealtimeNotifications();
        this.smartOnboarding = new SmartOnboarding();
        this.socialAuth = new SocialAuthentication();
        this.intelligentSearch = new IntelligentSearch();
        this.init();
    }

    init() {
        this.initializeAllFeatures();
        this.setupEventListeners();
    }

    initializeAllFeatures() {
        this.securityAnalyzer.init();
        this.passwordManager.init();
        this.realtimeNotifications.init();
        this.smartOnboarding.init();
        this.socialAuth.init();
        this.intelligentSearch.init();
        this.pwManager.init();
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalShortcuts.bind(this));
        
        // Advanced form auto-complete
        this.setupSmartAutoComplete();
        
        // Context menu enhancements
        this.setupContextMenu();
        
        // Gesture support for mobile
        this.setupGestureSupport();
    }

    handleGlobalShortcuts(e) {
        // Ctrl/Cmd + K for quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.smartSearch.openQuickSearch();
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showAdvancedHelp();
        }
        
        // Ctrl/Cmd + D for dashboard quick view
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.analytics.showQuickStats();
        }
    }

    setupSmartAutoComplete() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.smartSearch.provideAutoComplete(e.target);
            });
        });
    }

    setupContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.preventDefault();
                this.showAdvancedContextMenu(e);
            }
        });
    }

    setupGestureSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe gestures
            if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    handleSwipeRight() {
        // Navigate to previous form or open sidebar
        this.notifications.show('Swipe right detected', 'info');
    }

    handleSwipeLeft() {
        // Navigate to next form or close sidebar
        this.notifications.show('Swipe left detected', 'info');
    }

    showAdvancedHelp() {
        const helpModal = new AdvancedModal('Advanced Help & Shortcuts', this.generateHelpContent());
        helpModal.show();
    }

    showAdvancedContextMenu(e) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'advanced-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            min-width: 200px;
        `;
        
        const menuItems = [
            { icon: 'fas fa-key', text: 'Generate Password', action: () => this.passwordManager.generateAndFill(e.target) },
            { icon: 'fas fa-clipboard', text: 'Smart Paste', action: () => this.smartPaste(e.target) },
            { icon: 'fas fa-shield-alt', text: 'Security Check', action: () => this.securityAnalyzer.analyzeField(e.target) },
            { icon: 'fas fa-magic', text: 'Auto Fill', action: () => this.smartAutoFill(e.target) }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
            menuItem.onclick = () => {
                item.action();
                contextMenu.remove();
            };
            contextMenu.appendChild(menuItem);
        });
        
        document.body.appendChild(contextMenu);
        
        // Remove on click outside
        setTimeout(() => {
            document.addEventListener('click', () => contextMenu.remove(), { once: true });
        }, 100);
    }

    generateHelpContent() {
        return `
            <div class="help-content">
                <div class="help-section">
                    <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd>
                            <span>Quick Search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd>
                            <span>Show Help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>D</kbd>
                            <span>Quick Dashboard</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Close Modal</span>
                        </div>
                    </div>
                </div>
                
                <div class="help-section">
                    <h3><i class="fas fa-mobile-alt"></i> Mobile Gestures</h3>
                    <div class="gesture-list">
                        <div class="gesture-item">
                            <i class="fas fa-arrow-right"></i>
                            <span>Swipe Right: Previous form</span>
                        </div>
                        <div class="gesture-item">
                            <i class="fas fa-arrow-left"></i>
                            <span>Swipe Left: Next form</span>
                        </div>
                        <div class="gesture-item">
                            <i class="fas fa-hand-pointer"></i>
                            <span>Long Press: Context menu</span>
                        </div>
                    </div>
                </div>
                
                <div class="help-section">
                    <h3><i class="fas fa-shield-alt"></i> Security Features</h3>
                    <ul>
                        <li>AI-powered threat detection</li>
                        <li>Biometric authentication support</li>
                        <li>Advanced password strength analysis</li>
                        <li>Real-time security monitoring</li>
                        <li>Automatic suspicious activity detection</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// AI-Powered Security Analyzer
class SecurityAnalyzer {
    constructor() {
        this.threatPatterns = [];
        this.behaviorProfile = {};
        this.suspiciousActivities = [];
    }

    init() {
        this.loadThreatPatterns();
        this.startBehaviorAnalysis();
        this.initializeSecurityMonitoring();
    }

    loadThreatPatterns() {
        this.threatPatterns = [
            {
                name: 'SQL Injection',
                pattern: /(\b(union|select|insert|delete|drop|update|script)\b)|(['";])/gi,
                severity: 'high'
            },
            {
                name: 'XSS Attempt',
                pattern: /<script|javascript:|on\w+\s*=/gi,
                severity: 'high'
            },
            {
                name: 'Path Traversal',
                pattern: /(\.\.[\/\\])|(%2e%2e%2f)|(%252e%252e%252f)/gi,
                severity: 'medium'
            },
            {
                name: 'Command Injection',
                pattern: /(\||&|;|`|\$\()/g,
                severity: 'high'
            }
        ];
    }

    analyzeInput(input, value) {
        const threats = [];
        
        this.threatPatterns.forEach(pattern => {
            if (pattern.pattern.test(value)) {
                threats.push({
                    type: pattern.name,
                    severity: pattern.severity,
                    field: input.id,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        if (threats.length > 0) {
            this.handleThreatDetection(threats, input);
        }
        
        return threats;
    }

    handleThreatDetection(threats, input) {
        // Visual warning
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
        
        // Log the threat
        console.warn('🚨 Security threat detected:', threats);
        
        // Show warning notification
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                `Security threat detected: ${threats[0].type}`,
                'error'
            );
        }
        
        // Store for analysis
        this.suspiciousActivities.push(...threats);
        
        // Clear styling after delay
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 3000);
    }

    startBehaviorAnalysis() {
        // Track user behavior patterns
        let keystrokes = [];
        let mouseMovements = [];
        let timingPatterns = [];
        
        document.addEventListener('keydown', (e) => {
            keystrokes.push({
                key: e.key,
                timestamp: Date.now(),
                target: e.target.id
            });
            
            // Analyze typing patterns
            this.analyzeTypingPattern(keystrokes);
        });
        
        document.addEventListener('mousemove', (e) => {
            mouseMovements.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            // Keep only recent movements
            if (mouseMovements.length > 100) {
                mouseMovements = mouseMovements.slice(-50);
            }
        });
        
        // Analyze session timing
        setInterval(() => {
            this.analyzeSessionTiming();
        }, 30000); // Every 30 seconds
    }

    analyzeTypingPattern(keystrokes) {
        if (keystrokes.length < 10) return;
        
        const recentKeystrokes = keystrokes.slice(-10);
        const intervals = [];
        
        for (let i = 1; i < recentKeystrokes.length; i++) {
            intervals.push(recentKeystrokes[i].timestamp - recentKeystrokes[i-1].timestamp);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const isBot = avgInterval < 50 || intervals.every(interval => interval < 30);
        
        if (isBot) {
            this.flagBotBehavior();
        }
    }

    flagBotBehavior() {
        console.warn('🤖 Potential bot behavior detected');
        
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Unusual typing pattern detected',
                'warning'
            );
        }
    }

    analyzeSessionTiming() {
        const sessionStart = localStorage.getItem('sessionStart') || Date.now();
        const sessionDuration = Date.now() - parseInt(sessionStart);
        
        // Flag unusually long sessions
        if (sessionDuration > 3600000) { // 1 hour
            console.warn('⏰ Extended session detected');
        }
    }

    initializeSecurityMonitoring() {
        // Monitor for common attack vectors
        this.monitorConsoleUsage();
        this.monitorDeveloperTools();
        this.monitorNetworkRequests();
    }

    monitorConsoleUsage() {
        const originalConsole = window.console;
        let consoleUsage = 0;
        
        window.console = new Proxy(originalConsole, {
            get(target, prop) {
                if (typeof target[prop] === 'function') {
                    return function(...args) {
                        consoleUsage++;
                        if (consoleUsage > 10) {
                            console.warn('🔍 Excessive console usage detected');
                        }
                        return target[prop].apply(target, args);
                    };
                }
                return target[prop];
            }
        });
    }

    monitorDeveloperTools() {
        let devtools = false;
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtools = true;
                console.warn('🛠️ Developer tools detected');
                return '';
            }
        });
        
        setInterval(() => {
            devtools = false;
            console.log(element);
            if (devtools) {
                this.handleDeveloperToolsDetection();
            }
        }, 1000);
    }

    handleDeveloperToolsDetection() {
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Developer tools detected',
                'info'
            );
        }
    }

    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest;
        
        window.fetch = function(...args) {
            console.log('🌐 Fetch request:', args[0]);
            return originalFetch.apply(this, args);
        };
        
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalSend = xhr.send;
            
            xhr.send = function(...args) {
                console.log('🌐 XHR request:', this.responseURL);
                return originalSend.apply(this, args);
            };
            
            return xhr;
        };
    }

    getSecurityReport() {
        return {
            threats: this.suspiciousActivities,
            behaviorProfile: this.behaviorProfile,
            sessionInfo: {
                duration: Date.now() - (parseInt(localStorage.getItem('sessionStart')) || Date.now()),
                suspicious: this.suspiciousActivities.length > 0
            }
        };
    }
}

// Advanced Password Manager
class AdvancedPasswordManager {
    constructor() {
        this.passwordHistory = [];
        this.strengthAnalyzer = new PasswordStrengthAnalyzer();
        this.breachChecker = new BreachChecker();
    }

    init() {
        this.loadPasswordHistory();
        this.setupPasswordGeneration();
        this.setupStrengthAnalysis();
    }

    generateSecurePassword(options = {}) {
        const defaults = {
            length: 16,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
            excludeSimilar: true,
            excludeAmbiguous: true
        };
        
        const config = { ...defaults, ...options };
        
        let charset = '';
        if (config.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (config.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (config.includeNumbers) charset += '0123456789';
        if (config.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (config.excludeSimilar) {
            charset = charset.replace(/[il1Lo0O]/g, '');
        }
        
        if (config.excludeAmbiguous) {
            charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
        }
        
        let password = '';
        const crypto = window.crypto || window.msCrypto;
        
        for (let i = 0; i < config.length; i++) {
            const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
            password += charset[randomIndex];
        }
        
        // Ensure password meets complexity requirements
        if (config.includeUppercase && !/[A-Z]/.test(password)) {
            password = password.substring(1) + charset.match(/[A-Z]/)[0];
        }
        if (config.includeLowercase && !/[a-z]/.test(password)) {
            password = password.substring(1) + charset.match(/[a-z]/)[0];
        }
        if (config.includeNumbers && !/[0-9]/.test(password)) {
            password = password.substring(1) + charset.match(/[0-9]/)[0];
        }
        if (config.includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            password = password.substring(1) + charset.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)[0];
        }
        
        return password;
    }

    analyzePasswordStrength(password) {
        return this.strengthAnalyzer.analyze(password);
    }

    async checkPasswordBreach(password) {
        return await this.breachChecker.isPasswordCompromised(password);
    }

    generateAndFill(targetInput) {
        const password = this.generateSecurePassword();
        targetInput.value = password;
        
        // Trigger change event for any listeners
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Secure password generated!',
                'success'
            );
        }
    }

    setupPasswordGeneration() {
        // Add password generation buttons to password fields
        const passwordFields = document.querySelectorAll('input[type="password"]');
        
        passwordFields.forEach(field => {
            const container = field.parentNode;
            
            if (!container.querySelector('.password-generate-btn')) {
                const generateBtn = document.createElement('button');
                generateBtn.type = 'button';
                generateBtn.className = 'password-generate-btn';
                generateBtn.innerHTML = '<i class="fas fa-magic"></i>';
                generateBtn.title = 'Generate secure password';
                generateBtn.onclick = () => this.generateAndFill(field);
                
                container.appendChild(generateBtn);
            }
        });
    }

    setupStrengthAnalysis() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        
        passwordFields.forEach(field => {
            field.addEventListener('input', async (e) => {
                const password = e.target.value;
                if (password.length > 0) {
                    const strength = this.analyzePasswordStrength(password);
                    const isBreached = await this.checkPasswordBreach(password);
                    
                    this.displayPasswordAnalysis(field, strength, isBreached);
                }
            });
        });
    }

    displayPasswordAnalysis(field, strength, isBreached) {
        let analysisContainer = field.parentNode.querySelector('.password-analysis');
        
        if (!analysisContainer) {
            analysisContainer = document.createElement('div');
            analysisContainer.className = 'password-analysis';
            field.parentNode.appendChild(analysisContainer);
        }
        
        analysisContainer.innerHTML = `
            <div class="strength-meter">
                <div class="strength-bar strength-${strength.level}"></div>
                <span class="strength-text">${strength.level.toUpperCase()}</span>
            </div>
            ${isBreached ? '<div class="breach-warning">⚠️ This password has been compromised</div>' : ''}
            <div class="strength-tips">
                ${strength.suggestions.map(tip => `<div class="tip">• ${tip}</div>`).join('')}
            </div>
        `;
    }

    loadPasswordHistory() {
        const stored = localStorage.getItem('passwordHistory');
        this.passwordHistory = stored ? JSON.parse(stored) : [];
    }

    savePasswordHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.passwordHistory));
    }
}

// Password Strength Analyzer
class PasswordStrengthAnalyzer {
    analyze(password) {
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
            noRepeats: !/(.)\\1{2,}/.test(password),
            noSequence: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const maxScore = Object.keys(checks).length;
        
        let level, suggestions = [];
        
        if (score < 3) {
            level = 'weak';
            suggestions = [
                'Use at least 12 characters',
                'Include uppercase and lowercase letters',
                'Add numbers and symbols'
            ];
        } else if (score < 5) {
            level = 'fair';
            suggestions = [
                'Avoid common patterns',
                'Add more character types',
                'Increase length for better security'
            ];
        } else if (score < 6) {
            level = 'good';
            suggestions = ['Consider avoiding repeated characters'];
        } else {
            level = 'excellent';
            suggestions = ['Your password is very strong!'];
        }
        
        return {
            score: Math.round((score / maxScore) * 100),
            level,
            suggestions,
            checks
        };
    }
}

// Breach Checker (simulated)
class BreachChecker {
    constructor() {
        this.knownBreaches = new Set([
            'password123',
            '12345678',
            'qwerty',
            'admin',
            'letmein',
            'welcome',
            'monkey',
            'dragon'
        ]);
    }

    async isPasswordCompromised(password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple check against known weak passwords
        const isWeak = this.knownBreaches.has(password.toLowerCase());
        
        // In a real implementation, this would hash the password and check against
        // the HaveIBeenPwned API or similar service
        
        return isWeak;
    }
}

// Initialize advanced features when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.advancedFeatures = new AdvancedFeatures();
    });
} else {
    window.advancedFeatures = new AdvancedFeatures();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFeatures;
}
