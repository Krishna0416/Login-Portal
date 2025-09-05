// Dashboard JavaScript with ChatGPT-style UI interactions
class Dashboard {
    constructor() {
        this.userData = null;
        this.toastContainer = null;
        this.activeModals = new Set();
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.createToastContainer();
        this.populateUserInterface();
        this.checkAuthentication();
        this.initializeTheme();
    }

    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            window.location.href = 'index.html';
            return;
        }
    }

    loadUserData() {
        const storedUserData = localStorage.getItem('currentUser');
        if (storedUserData) {
            this.userData = JSON.parse(storedUserData);
        } else {
            // If no user data, redirect to login
            this.logout();
        }
    }

    setupEventListeners() {
        // Header user profile dropdown
        const userProfile = document.querySelector('.user-profile');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (userProfile && dropdownMenu) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdownMenu);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                this.closeDropdown(dropdownMenu);
            });

            // Prevent dropdown from closing when clicking inside
            dropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Dropdown menu items
        this.setupDropdownActions();

        // Action cards
        this.setupActionCards();

        // Edit profile button
        const editButton = document.querySelector('.edit-button');
        if (editButton) {
            editButton.addEventListener('click', () => this.openEditProfileModal());
        }

        // Modal close handlers
        this.setupModalHandlers();

        // Keyboard navigation
        this.setupKeyboardHandlers();
        
        // Theme toggle
        this.setupThemeToggle();
    }

    setupDropdownActions() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                
                switch (action) {
                    case 'profile':
                        this.openEditProfileModal();
                        break;
                    case 'settings':
                        this.openSettingsModal();
                        break;
                    case 'help':
                        this.openHelpModal();
                        break;
                    case 'logout':
                        this.confirmLogout();
                        break;
                }
                
                // Close dropdown after action
                const dropdownMenu = document.querySelector('.dropdown-menu');
                this.closeDropdown(dropdownMenu);
            });
        });
    }

    setupActionCards() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                
                switch (action) {
                    case 'edit-profile':
                        this.openEditProfileModal();
                        break;
                    case 'security':
                        this.openSecurityModal();
                        break;
                    case 'notifications':
                        this.openNotificationsModal();
                        break;
                    case 'data-export':
                        this.exportUserData();
                        break;
                    case 'support':
                        this.openSupportModal();
                        break;
                    case 'feedback':
                        this.openFeedbackModal();
                        break;
                }
            });

            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupModalHandlers() {
        // Setup modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.closest('.modal-overlay'));
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                const lastModal = Array.from(this.activeModals).pop();
                this.closeModal(lastModal);
            }
        });
    }

    setupKeyboardHandlers() {
        // Add keyboard navigation for better accessibility
        document.addEventListener('keydown', (e) => {
            // Tab navigation for dropdown items
            if (e.key === 'Tab') {
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                    const focusableElements = dropdownMenu.querySelectorAll('.dropdown-item');
                    const currentFocus = document.activeElement;
                    const currentIndex = Array.from(focusableElements).indexOf(currentFocus);
                    
                    if (e.shiftKey) {
                        // Shift+Tab - previous element
                        if (currentIndex > 0) {
                            e.preventDefault();
                            focusableElements[currentIndex - 1].focus();
                        }
                    } else {
                        // Tab - next element
                        if (currentIndex < focusableElements.length - 1) {
                            e.preventDefault();
                            focusableElements[currentIndex + 1].focus();
                        }
                    }
                }
            }
        });
    }

    toggleDropdown(dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        
        if (isHidden) {
            dropdown.classList.remove('hidden');
            // Focus first item for keyboard navigation
            const firstItem = dropdown.querySelector('.dropdown-item');
            if (firstItem) {
                setTimeout(() => firstItem.focus(), 100);
            }
        } else {
            dropdown.classList.add('hidden');
        }
    }

    closeDropdown(dropdown) {
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }

    populateUserInterface() {
        if (!this.userData) return;

        // Update user name in header
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = this.userData.fullName || this.userData.username || 'User';
        }

        // Update welcome message
        const welcomeTitle = document.querySelector('.welcome-header h1');
        if (welcomeTitle) {
            const hour = new Date().getHours();
            let greeting = 'Good morning';
            if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
            else if (hour >= 17) greeting = 'Good evening';
            
            welcomeTitle.textContent = `${greeting}, ${this.userData.fullName || this.userData.username || 'User'}!`;
        }

        // Update profile information
        this.updateProfileSection();

        // Update activity feed
        this.updateActivityFeed();

        // Show last login time
        this.showLastLoginTime();
    }

    updateProfileSection() {
        if (!this.userData) return;

        // Update profile details
        const profileDetails = document.querySelector('.profile-details h3');
        if (profileDetails) {
            profileDetails.textContent = this.userData.fullName || this.userData.username || 'User Name';
        }

        // Update meta information
        const metaItems = document.querySelectorAll('.meta-item');
        metaItems.forEach(item => {
            const type = item.dataset.type;
            const valueElement = item.querySelector('span');
            
            if (valueElement) {
                switch (type) {
                    case 'email':
                        valueElement.textContent = this.userData.email || 'N/A';
                        break;
                    case 'mobile':
                        valueElement.textContent = this.userData.mobile || 'N/A';
                        break;
                    case 'joined':
                        const joinDate = this.userData.registrationDate || this.userData.createdAt || new Date().toISOString();
                        const formattedDate = new Date(joinDate).toLocaleDateString();
                        valueElement.textContent = formattedDate;
                        break;
                }
            }
        });

        // Update verification status
        this.updateVerificationStatus();
    }

    updateVerificationStatus() {
        const emailVerified = document.querySelector('.status-item[data-type="email"]');
        const mobileVerified = document.querySelector('.status-item[data-type="mobile"]');

        if (emailVerified) {
            const isVerified = this.userData.emailVerified || false;
            emailVerified.className = `status-item ${isVerified ? 'verified' : ''}`;
            emailVerified.innerHTML = `
                <i class="fas fa-${isVerified ? 'check-circle' : 'times-circle'}"></i>
                Email ${isVerified ? 'Verified' : 'Unverified'}
            `;
        }

        if (mobileVerified) {
            const isVerified = this.userData.mobileVerified || false;
            mobileVerified.className = `status-item ${isVerified ? 'verified' : ''}`;
            mobileVerified.innerHTML = `
                <i class="fas fa-${isVerified ? 'check-circle' : 'times-circle'}"></i>
                Mobile ${isVerified ? 'Verified' : 'Unverified'}
            `;
        }
    }

    updateActivityFeed() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // Clear existing activities
        activityList.innerHTML = '';

        // Sample activities (in real app, this would come from API)
        const activities = [
            {
                icon: 'fas fa-sign-in-alt',
                text: 'You signed in to your account',
                time: 'Just now'
            },
            {
                icon: 'fas fa-user-edit',
                text: 'Profile information was updated',
                time: '2 hours ago'
            },
            {
                icon: 'fas fa-shield-alt',
                text: 'Security settings were reviewed',
                time: '1 day ago'
            },
            {
                icon: 'fas fa-envelope',
                text: 'Email verification completed',
                time: '3 days ago'
            }
        ];

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    showLastLoginTime() {
        const lastLogin = localStorage.getItem('lastLoginTime');
        if (lastLogin) {
            const welcomeText = document.querySelector('.welcome-header p');
            if (welcomeText) {
                const loginDate = new Date(lastLogin);
                const formattedDate = loginDate.toLocaleString();
                welcomeText.textContent = `Last login: ${formattedDate}`;
            }
        }
    }

    // Modal Functions
    openEditProfileModal() {
        const modalHTML = `
            <div class="modal-overlay" id="editProfileModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Edit Profile</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <form class="modal-form" id="editProfileForm">
                            <div class="form-group">
                                <label for="editFullName">Full Name</label>
                                <input type="text" id="editFullName" value="${this.userData?.fullName || this.userData?.username || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEmail">Email</label>
                                <input type="email" id="editEmail" value="${this.userData?.email || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="editMobile">Mobile Number</label>
                                <input type="tel" id="editMobile" value="${this.userData?.mobile || ''}" required>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="secondary-button" data-action="cancel">Cancel</button>
                                <button type="submit" class="primary-button">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHTML, () => {
            const form = document.getElementById('editProfileForm');
            form.addEventListener('submit', (e) => this.handleProfileUpdate(e));
            
            const cancelBtn = form.querySelector('[data-action="cancel"]');
            cancelBtn.addEventListener('click', () => this.closeModal(document.getElementById('editProfileModal')));
        });
    }

    openSecurityModal() {
        const modalHTML = `
            <div class="modal-overlay" id="securityModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Security Settings</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <form class="modal-form" id="securityForm">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input type="password" id="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" required>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="secondary-button" data-action="cancel">Cancel</button>
                                <button type="submit" class="primary-button">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHTML, () => {
            const form = document.getElementById('securityForm');
            form.addEventListener('submit', (e) => this.handlePasswordUpdate(e));
            
            const cancelBtn = form.querySelector('[data-action="cancel"]');
            cancelBtn.addEventListener('click', () => this.closeModal(document.getElementById('securityModal')));
        });
    }

    openSupportModal() {
        const modalHTML = `
            <div class="modal-overlay" id="supportModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Contact Support</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <form class="modal-form" id="supportForm">
                            <div class="form-group">
                                <label for="supportSubject">Subject</label>
                                <input type="text" id="supportSubject" required>
                            </div>
                            <div class="form-group">
                                <label for="supportMessage">Message</label>
                                <textarea id="supportMessage" rows="4" required style="padding: var(--spacing-3) var(--spacing-4); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); font-family: inherit; resize: vertical; width: 100%;"></textarea>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="secondary-button" data-action="cancel">Cancel</button>
                                <button type="submit" class="primary-button">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalHTML, () => {
            const form = document.getElementById('supportForm');
            form.addEventListener('submit', (e) => this.handleSupportSubmission(e));
            
            const cancelBtn = form.querySelector('[data-action="cancel"]');
            cancelBtn.addEventListener('click', () => this.closeModal(document.getElementById('supportModal')));
        });
    }

    showModal(modalHTML, setupCallback = null) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            this.closeModal(existingModal);
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get the modal element
        const modal = document.querySelector('.modal-overlay:last-child');
        this.activeModals.add(modal);

        // Setup modal specific functionality
        if (setupCallback) {
            setupCallback();
        }

        // Focus management
        const firstInput = modal.querySelector('input, textarea, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        if (modal) {
            this.activeModals.delete(modal);
            modal.remove();
            
            // Restore body scroll if no modals are open
            if (this.activeModals.size === 0) {
                document.body.style.overflow = '';
            }
        }
    }

    // Form Handlers
    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedData = {
            ...this.userData,
            fullName: document.getElementById('editFullName').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            mobile: document.getElementById('editMobile').value.trim()
        };

        // Basic validation
        if (!updatedData.fullName || !updatedData.email || !updatedData.mobile) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedData.email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Mobile validation
        const mobileRegex = /^[+]?[\d\s\-\(\)]+$/;
        if (!mobileRegex.test(updatedData.mobile)) {
            this.showToast('Please enter a valid mobile number', 'error');
            return;
        }

        // Update stored data
        this.userData = updatedData;
        localStorage.setItem('currentUser', JSON.stringify(updatedData));

        // Update UI
        this.populateUserInterface();
        
        // Close modal and show success
        this.closeModal(document.getElementById('editProfileModal'));
        this.showToast('Profile updated successfully!', 'success');
    }

    handlePasswordUpdate(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (newPassword !== confirmPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // In a real app, you'd verify the current password
        // For this demo, we'll just simulate success
        
        // Update password (in real app, this would be an API call)
        this.userData.password = this.hashPassword(newPassword);
        localStorage.setItem('currentUser', JSON.stringify(this.userData));
        
        this.closeModal(document.getElementById('securityModal'));
        this.showToast('Password updated successfully!', 'success');
    }

    handleSupportSubmission(e) {
        e.preventDefault();
        
        const subject = document.getElementById('supportSubject').value.trim();
        const message = document.getElementById('supportMessage').value.trim();

        if (!subject || !message) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // In a real app, this would send to support system
        console.log('Support request:', { subject, message, user: this.userData.email });
        
        this.closeModal(document.getElementById('supportModal'));
        this.showToast('Support request sent successfully!', 'success');
    }

    confirmLogout() {
        const confirmModal = `
            <div class="modal-overlay" id="confirmLogoutModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Confirm Logout</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <p style="margin-bottom: var(--spacing-6); color: var(--color-text-secondary);">
                            Are you sure you want to log out of your account?
                        </p>
                        <div class="modal-actions">
                            <button type="button" class="secondary-button" data-action="cancel">Cancel</button>
                            <button type="button" class="primary-button" data-action="logout" style="background-color: var(--color-danger);">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showModal(confirmModal, () => {
            const cancelBtn = document.querySelector('[data-action="cancel"]');
            const logoutBtn = document.querySelector('[data-action="logout"]');
            
            cancelBtn.addEventListener('click', () => this.closeModal(document.getElementById('confirmLogoutModal')));
            logoutBtn.addEventListener('click', () => this.logout());
        });
    }

    logout() {
        // Clear session data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastLoginTime');
        
        // Show logout message
        this.showToast('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    exportUserData() {
        if (!this.userData) {
            this.showToast('No user data to export', 'error');
            return;
        }

        const dataToExport = {
            ...this.userData,
            exportDate: new Date().toISOString(),
            exportedBy: 'User Dashboard'
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('User data exported successfully!', 'success');
    }

    // Toast notification system
    createToastContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    showToast(message, type = 'info', duration = 4000) {
        const toastId = 'toast-' + Date.now();
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;
        toast.innerHTML = `
            <i class="${iconMap[type]}"></i>
            <span>${message}</span>
        `;

        this.toastContainer.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (document.getElementById(toastId)) {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, duration);

        // Allow manual removal by clicking
        toast.addEventListener('click', () => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }

    // Utility functions
    hashPassword(password) {
        // Simple hash function for demo (use proper hashing in production)
        return btoa(password).split('').reverse().join('');
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        this.showToast(`Switched to ${newTheme} mode`, 'success');
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: var(--color-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateX(300px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-family: var(--font-family);
            font-size: 14px;
        `;
        
        if (type === 'error') {
            toast.style.background = '#ef4444';
        } else if (type === 'success') {
            toast.style.background = '#22c55e';
        }
        
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    updateThemeIcon(theme) {
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
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Update last login time
localStorage.setItem('lastLoginTime', new Date().toISOString());
