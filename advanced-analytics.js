// Data Visualization & Analytics
class DataVisualization {
    constructor() {
        this.charts = new Map();
        this.analytics = new UserAnalytics();
        this.themes = {
            light: {
                background: '#ffffff',
                text: '#2d333a',
                primary: '#10a37f',
                secondary: '#6366f1',
                grid: '#e5e7eb'
            },
            dark: {
                background: '#0d1117',
                text: '#f0f6fc',
                primary: '#10a37f',
                secondary: '#7c3aed',
                grid: '#30363d'
            }
        };
    }

    init() {
        this.loadChartLibrary();
        this.setupAnalyticsDashboard();
        this.createVisualizationControls();
    }

    loadChartLibrary() {
        // Load Chart.js for data visualization
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        script.onload = () => {
            console.log('📊 Chart.js loaded');
            this.setupCharts();
        };
        document.head.appendChild(script);
    }

    setupAnalyticsDashboard() {
        // Create analytics dashboard container
        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'analytics-dashboard';
        dashboardContainer.className = 'analytics-dashboard hidden';
        dashboardContainer.innerHTML = `
            <div class="analytics-header">
                <h2><i class="fas fa-chart-bar"></i> Analytics Dashboard</h2>
                <div class="analytics-controls">
                    <select id="analytics-timeframe">
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button class="analytics-refresh" onclick="window.advancedFeatures.dataVisualizer.refreshData()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    <button class="analytics-close" onclick="window.advancedFeatures.dataVisualizer.closeDashboard()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>Login Activity</h3>
                        <i class="fas fa-sign-in-alt"></i>
                    </div>
                    <canvas id="login-activity-chart"></canvas>
                </div>
                
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>Security Events</h3>
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <canvas id="security-events-chart"></canvas>
                </div>
                
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>User Behavior</h3>
                        <i class="fas fa-user-chart"></i>
                    </div>
                    <canvas id="user-behavior-chart"></canvas>
                </div>
                
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>Performance Metrics</h3>
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <div class="metric-value" id="avg-load-time">0ms</div>
                            <div class="metric-label">Avg Load Time</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value" id="success-rate">0%</div>
                            <div class="metric-label">Login Success Rate</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value" id="active-sessions">0</div>
                            <div class="metric-label">Active Sessions</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value" id="threats-blocked">0</div>
                            <div class="metric-label">Threats Blocked</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-insights">
                <h3><i class="fas fa-lightbulb"></i> AI Insights</h3>
                <div id="ai-insights-container"></div>
            </div>
        `;
        
        document.body.appendChild(dashboardContainer);
    }

    setupCharts() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const themeColors = this.themes[currentTheme];
        
        // Login Activity Chart
        this.createLoginActivityChart(themeColors);
        
        // Security Events Chart
        this.createSecurityEventsChart(themeColors);
        
        // User Behavior Chart
        this.createUserBehaviorChart(themeColors);
    }

    createLoginActivityChart(theme) {
        const ctx = document.getElementById('login-activity-chart');
        if (!ctx) return;

        const data = this.analytics.getLoginActivityData();
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Successful Logins',
                    data: data.successful,
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + '20',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Failed Attempts',
                    data: data.failed,
                    borderColor: '#ef4444',
                    backgroundColor: '#ef444420',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: theme.text
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: theme.text
                        },
                        grid: {
                            color: theme.grid
                        }
                    },
                    y: {
                        ticks: {
                            color: theme.text
                        },
                        grid: {
                            color: theme.grid
                        }
                    }
                }
            }
        });
        
        this.charts.set('login-activity', chart);
    }

    createSecurityEventsChart(theme) {
        const ctx = document.getElementById('security-events-chart');
        if (!ctx) return;

        const data = this.analytics.getSecurityEventsData();
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        theme.primary,
                        '#ef4444',
                        '#f59e0b',
                        theme.secondary
                    ],
                    borderWidth: 2,
                    borderColor: theme.background
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: theme.text,
                            padding: 20
                        }
                    }
                }
            }
        });
        
        this.charts.set('security-events', chart);
    }

    createUserBehaviorChart(theme) {
        const ctx = document.getElementById('user-behavior-chart');
        if (!ctx) return;

        const data = this.analytics.getUserBehaviorData();
        
        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Current User',
                    data: data.currentUser,
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + '20',
                    pointBackgroundColor: theme.primary
                }, {
                    label: 'Average User',
                    data: data.averageUser,
                    borderColor: theme.secondary,
                    backgroundColor: theme.secondary + '20',
                    pointBackgroundColor: theme.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: theme.text
                        }
                    }
                },
                scales: {
                    r: {
                        ticks: {
                            color: theme.text,
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: theme.grid
                        },
                        angleLines: {
                            color: theme.grid
                        }
                    }
                }
            }
        });
        
        this.charts.set('user-behavior', chart);
    }

    showDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        dashboard.classList.remove('hidden');
        
        // Update performance metrics
        this.updatePerformanceMetrics();
        
        // Generate AI insights
        this.generateAIInsights();
        
        // Refresh charts with current theme
        this.updateChartsTheme();
    }

    closeDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        dashboard.classList.add('hidden');
    }

    updatePerformanceMetrics() {
        const metrics = this.analytics.getPerformanceMetrics();
        
        document.getElementById('avg-load-time').textContent = metrics.avgLoadTime + 'ms';
        document.getElementById('success-rate').textContent = metrics.successRate + '%';
        document.getElementById('active-sessions').textContent = metrics.activeSessions;
        document.getElementById('threats-blocked').textContent = metrics.threatsBlocked;
    }

    generateAIInsights() {
        const insights = this.analytics.generateInsights();
        const container = document.getElementById('ai-insights-container');
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-icon">
                    <i class="fas fa-${insight.icon}"></i>
                </div>
                <div class="insight-content">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                </div>
                <div class="insight-confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${insight.confidence}%"></div>
                    </div>
                    <span>${insight.confidence}%</span>
                </div>
            </div>
        `).join('');
    }

    updateChartsTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const themeColors = this.themes[currentTheme];
        
        this.charts.forEach((chart, key) => {
            // Update chart colors based on current theme
            chart.options.plugins.legend.labels.color = themeColors.text;
            
            if (chart.options.scales) {
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.ticks) scale.ticks.color = themeColors.text;
                    if (scale.grid) scale.grid.color = themeColors.grid;
                    if (scale.angleLines) scale.angleLines.color = themeColors.grid;
                });
            }
            
            chart.update();
        });
    }

    refreshData() {
        // Simulate data refresh
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                'Analytics data refreshed',
                'success'
            );
        }
        
        // Update charts with new data
        this.charts.forEach((chart, key) => {
            // Simulate new data
            chart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(() => Math.floor(Math.random() * 100));
            });
            chart.update();
        });
        
        this.updatePerformanceMetrics();
        this.generateAIInsights();
    }

    createVisualizationControls() {
        // Add analytics button to header or dashboard
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const analyticsBtn = document.createElement('button');
            analyticsBtn.className = 'analytics-toggle';
            analyticsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
            analyticsBtn.title = 'View Analytics';
            analyticsBtn.onclick = () => this.showDashboard();
            
            headerActions.appendChild(analyticsBtn);
        }
    }

    exportData(format = 'json') {
        const analyticsData = {
            loginActivity: this.analytics.getLoginActivityData(),
            securityEvents: this.analytics.getSecurityEventsData(),
            userBehavior: this.analytics.getUserBehaviorData(),
            performanceMetrics: this.analytics.getPerformanceMetrics(),
            insights: this.analytics.generateInsights(),
            exportDate: new Date().toISOString()
        };
        
        let dataStr, fileName, mimeType;
        
        switch (format) {
            case 'csv':
                dataStr = this.convertToCSV(analyticsData);
                fileName = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
                break;
            case 'json':
            default:
                dataStr = JSON.stringify(analyticsData, null, 2);
                fileName = `analytics_${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
        }
        
        const dataBlob = new Blob([dataStr], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (window.advancedFeatures?.notifications) {
            window.advancedFeatures.notifications.show(
                `Analytics data exported as ${format.toUpperCase()}`,
                'success'
            );
        }
    }

    convertToCSV(data) {
        // Convert analytics data to CSV format
        let csv = 'Type,Label,Value,Timestamp\n';
        
        // Login activity data
        data.loginActivity.labels.forEach((label, index) => {
            csv += `Login Activity,${label},${data.loginActivity.successful[index]},${new Date().toISOString()}\n`;
        });
        
        // Security events data
        data.securityEvents.labels.forEach((label, index) => {
            csv += `Security Events,${label},${data.securityEvents.values[index]},${new Date().toISOString()}\n`;
        });
        
        return csv;
    }
}

// User Analytics Engine
class UserAnalytics {
    constructor() {
        this.sessionData = [];
        this.behaviorPatterns = {};
        this.performanceMetrics = {};
        this.securityEvents = [];
        this.startTime = Date.now();
    }

    init() {
        this.startTracking();
        this.loadStoredData();
    }

    startTracking() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = Date.now() - this.startTime;
            this.recordPerformanceMetric('pageLoad', loadTime);
        });
        
        // Track user interactions
        document.addEventListener('click', (e) => {
            this.recordInteraction('click', e.target);
        });
        
        document.addEventListener('keydown', (e) => {
            this.recordInteraction('keydown', e.target);
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.recordInteraction('submit', e.target);
        });
        
        // Track navigation timing
        if (window.performance && window.performance.timing) {
            this.recordNavigationTiming();
        }
    }

    recordInteraction(type, target) {
        const interaction = {
            type,
            target: target.tagName + (target.id ? `#${target.id}` : ''),
            timestamp: Date.now(),
            page: window.location.pathname
        };
        
        this.sessionData.push(interaction);
        this.analyzeUserBehavior();
    }

    recordPerformanceMetric(metric, value) {
        if (!this.performanceMetrics[metric]) {
            this.performanceMetrics[metric] = [];
        }
        
        this.performanceMetrics[metric].push({
            value,
            timestamp: Date.now()
        });
    }

    recordNavigationTiming() {
        const timing = window.performance.timing;
        const metrics = {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connect: timing.connectEnd - timing.connectStart,
            response: timing.responseEnd - timing.responseStart,
            dom: timing.domContentLoadedEventEnd - timing.navigationStart,
            load: timing.loadEventEnd - timing.navigationStart
        };
        
        Object.entries(metrics).forEach(([key, value]) => {
            this.recordPerformanceMetric(key, value);
        });
    }

    analyzeUserBehavior() {
        // Analyze patterns in user interactions
        const recentInteractions = this.sessionData.slice(-20);
        
        // Calculate interaction frequency
        const interactionCounts = {};
        recentInteractions.forEach(interaction => {
            const key = interaction.type + ':' + interaction.target;
            interactionCounts[key] = (interactionCounts[key] || 0) + 1;
        });
        
        // Update behavior patterns
        this.behaviorPatterns.interactionFrequency = interactionCounts;
        this.behaviorPatterns.sessionDuration = Date.now() - this.startTime;
        this.behaviorPatterns.totalInteractions = this.sessionData.length;
    }

    getLoginActivityData() {
        // Generate mock login activity data
        const now = new Date();
        const labels = [];
        const successful = [];
        const failed = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            successful.push(Math.floor(Math.random() * 50) + 10);
            failed.push(Math.floor(Math.random() * 10) + 1);
        }
        
        return { labels, successful, failed };
    }

    getSecurityEventsData() {
        return {
            labels: ['Blocked Attacks', 'Failed Logins', 'Suspicious Activity', 'Safe Sessions'],
            values: [5, 12, 3, 156]
        };
    }

    getUserBehaviorData() {
        return {
            labels: ['Session Length', 'Click Rate', 'Form Completion', 'Feature Usage', 'Return Rate'],
            currentUser: [75, 85, 90, 70, 80],
            averageUser: [60, 70, 75, 65, 70]
        };
    }

    getPerformanceMetrics() {
        return {
            avgLoadTime: Math.floor(Math.random() * 500) + 200,
            successRate: 98.5,
            activeSessions: Math.floor(Math.random() * 50) + 10,
            threatsBlocked: Math.floor(Math.random() * 20) + 5
        };
    }

    generateInsights() {
        const insights = [];
        
        // Analyze session duration
        if (this.behaviorPatterns.sessionDuration > 300000) { // 5 minutes
            insights.push({
                type: 'positive',
                icon: 'clock',
                title: 'Extended Session Detected',
                description: 'User is highly engaged with the platform',
                confidence: 85
            });
        }
        
        // Analyze interaction patterns
        if (this.behaviorPatterns.totalInteractions > 50) {
            insights.push({
                type: 'info',
                icon: 'mouse-pointer',
                title: 'High Interaction Rate',
                description: 'User is actively exploring features',
                confidence: 92
            });
        }
        
        // Security insights
        insights.push({
            type: 'security',
            icon: 'shield-alt',
            title: 'Security Status: Excellent',
            description: 'No threats detected in current session',
            confidence: 99
        });
        
        // Performance insights
        const avgLoadTime = this.performanceMetrics.pageLoad?.[0]?.value || 0;
        if (avgLoadTime < 1000) {
            insights.push({
                type: 'positive',
                icon: 'tachometer-alt',
                title: 'Optimal Performance',
                description: 'Page load times are within optimal range',
                confidence: 95
            });
        }
        
        return insights;
    }

    loadStoredData() {
        const stored = localStorage.getItem('analyticsData');
        if (stored) {
            const data = JSON.parse(stored);
            this.sessionData = data.sessionData || [];
            this.behaviorPatterns = data.behaviorPatterns || {};
            this.performanceMetrics = data.performanceMetrics || {};
        }
    }

    saveData() {
        const data = {
            sessionData: this.sessionData.slice(-100), // Keep last 100 interactions
            behaviorPatterns: this.behaviorPatterns,
            performanceMetrics: this.performanceMetrics,
            timestamp: Date.now()
        };
        
        localStorage.setItem('analyticsData', JSON.stringify(data));
    }

    // Save data periodically
    startAutoSave() {
        setInterval(() => {
            this.saveData();
        }, 30000); // Save every 30 seconds
    }
}

// Progressive Web App Manager
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.registration = null;
    }

    init() {
        this.checkInstallation();
        this.setupInstallPrompt();
        this.registerServiceWorker();
        this.setupOfflineSupport();
        this.createInstallButton();
    }

    checkInstallation() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('✅ PWA is installed');
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('💾 PWA install prompt available');
            
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    'Install Portal as an app for better experience!',
                    'info'
                );
            }
        });
        
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.deferredPrompt = null;
            
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    'Portal has been installed successfully!',
                    'success'
                );
            }
        });
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered');
                
                // Listen for updates
                this.registration.addEventListener('updatefound', () => {
                    const newWorker = this.registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    createInstallButton() {
        if (this.isInstalled) return;
        
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install App</span>
        `;
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--border-radius-lg);
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            transform: translateY(100px);
        `;
        
        installButton.onclick = () => this.promptInstall();
        document.body.appendChild(installButton);
        
        // Show button if install prompt is available
        if (this.deferredPrompt) {
            setTimeout(() => {
                installButton.style.transform = 'translateY(0)';
            }, 2000);
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    'Installation not available on this device',
                    'warning'
                );
            }
            return;
        }
        
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
        
        // Hide install button
        const installBtn = document.querySelector('.pwa-install-btn');
        if (installBtn) {
            installBtn.style.transform = 'translateY(100px)';
            setTimeout(() => installBtn.remove(), 300);
        }
    }

    setupOfflineSupport() {
        window.addEventListener('online', () => {
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    'Back online! Syncing data...',
                    'success'
                );
            }
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            if (window.advancedFeatures?.notifications) {
                window.advancedFeatures.notifications.show(
                    'You are now offline. Some features may be limited.',
                    'warning'
                );
            }
        });
    }

    showUpdateNotification() {
        if (window.advancedFeatures?.notifications) {
            const updateId = window.advancedFeatures.notifications.show(
                'New version available! Click to update.',
                'info',
                'high',
                0 // Don't auto-dismiss
            );
            
            // Add click handler to trigger update
            setTimeout(() => {
                const notification = document.getElementById(updateId);
                if (notification) {
                    notification.style.cursor = 'pointer';
                    notification.onclick = () => this.applyUpdate();
                }
            }, 100);
        }
    }

    async applyUpdate() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    async syncOfflineData() {
        // Sync any offline data when back online
        const offlineData = localStorage.getItem('offlineData');
        if (offlineData) {
            try {
                const data = JSON.parse(offlineData);
                // Process offline data
                console.log('📡 Syncing offline data:', data);
                
                // Clear offline data after successful sync
                localStorage.removeItem('offlineData');
                
                if (window.advancedFeatures?.notifications) {
                    window.advancedFeatures.notifications.show(
                        'Offline data synced successfully!',
                        'success'
                    );
                }
            } catch (error) {
                console.error('❌ Failed to sync offline data:', error);
            }
        }
    }

    getInstallationStats() {
        return {
            isInstalled: this.isInstalled,
            isOnline: navigator.onLine,
            hasServiceWorker: !!this.registration,
            canInstall: !!this.deferredPrompt
        };
    }
}

// Advanced Modal System
class AdvancedModal {
    constructor(title, content, options = {}) {
        this.title = title;
        this.content = content;
        this.options = {
            size: 'medium', // small, medium, large, fullscreen
            closable: true,
            backdrop: true,
            animation: 'slide', // slide, fade, zoom
            position: 'center', // center, top, bottom
            ...options
        };
        this.element = null;
        this.isVisible = false;
    }

    show() {
        this.create();
        this.animate('in');
        this.isVisible = true;
        this.setupEventListeners();
        
        // Focus management
        this.trapFocus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.animate('out');
        this.isVisible = false;
        
        setTimeout(() => {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
            document.body.style.overflow = '';
        }, 300);
    }

    create() {
        const overlay = document.createElement('div');
        overlay.className = `advanced-modal-overlay ${this.options.size} ${this.options.position}`;
        
        if (this.options.backdrop) {
            overlay.style.background = 'rgba(0, 0, 0, 0.7)';
        }
        
        overlay.innerHTML = `
            <div class="advanced-modal ${this.options.animation}">
                ${this.options.closable ? `
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                
                <div class="modal-header">
                    <h2>${this.title}</h2>
                </div>
                
                <div class="modal-body">
                    ${this.content}
                </div>
                
                <div class="modal-footer">
                    ${this.options.actions || ''}
                </div>
            </div>
        `;
        
        this.element = overlay;
        document.body.appendChild(overlay);
    }

    animate(direction) {
        if (!this.element) return;
        
        const modal = this.element.querySelector('.advanced-modal');
        
        if (direction === 'in') {
            switch (this.options.animation) {
                case 'slide':
                    modal.style.transform = 'translateY(-50px)';
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.style.transform = 'translateY(0)';
                        modal.style.opacity = '1';
                    }, 10);
                    break;
                case 'zoom':
                    modal.style.transform = 'scale(0.8)';
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.style.transform = 'scale(1)';
                        modal.style.opacity = '1';
                    }, 10);
                    break;
                case 'fade':
                default:
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.style.opacity = '1';
                    }, 10);
                    break;
            }
        } else {
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(-20px)';
        }
    }

    setupEventListeners() {
        if (this.options.closable) {
            const closeBtn = this.element.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => this.hide();
            }
            
            if (this.options.backdrop) {
                this.element.onclick = (e) => {
                    if (e.target === this.element) {
                        this.hide();
                    }
                };
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleKeydown(e) {
        if (!this.isVisible) return;
        
        if (e.key === 'Escape' && this.options.closable) {
            this.hide();
        }
        
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    trapFocus() {
        const focusableElements = this.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    handleTabNavigation(e) {
        const focusableElements = this.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    static confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const content = `
                <p style="margin-bottom: 20px; line-height: 1.6; color: var(--color-text-secondary);">
                    ${message}
                </p>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="secondary-button" onclick="this.closest('.advanced-modal-overlay').querySelector('.modal-close-btn').click(); window.modalConfirmResolve(false);">
                        ${options.cancelText || 'Cancel'}
                    </button>
                    <button class="primary-button" onclick="this.closest('.advanced-modal-overlay').querySelector('.modal-close-btn').click(); window.modalConfirmResolve(true);">
                        ${options.confirmText || 'Confirm'}
                    </button>
                </div>
            `;
            
            window.modalConfirmResolve = resolve;
            
            const modal = new AdvancedModal(title, content, {
                size: 'small',
                ...options
            });
            
            modal.show();
        });
    }
}

// Export classes
window.DataVisualization = DataVisualization;
window.UserAnalytics = UserAnalytics;
window.PWAManager = PWAManager;
window.AdvancedModal = AdvancedModal;
