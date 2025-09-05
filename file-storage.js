// File Storage Handler for User Data
class FileStorageHandler {
    constructor() {
        this.filePath = './users.json';
        this.defaultData = {
            users: [],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0"
        };
    }

    // Read users from JSON file
    async loadUsers() {
        try {
            const response = await fetch(this.filePath);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Users loaded from file:', data.users.length, 'users');
                return data.users || [];
            } else {
                console.log('📄 No existing users file, starting fresh');
                return [];
            }
        } catch (error) {
            console.warn('⚠️ Could not load users file, using empty array:', error.message);
            return [];
        }
    }

    // Save users to JSON file (Browser-based approach)
    async saveUsers(users) {
        try {
            const data = {
                users: users,
                lastUpdated: new Date().toISOString(),
                version: "1.0.0",
                totalUsers: users.length
            };

            // For browser-based file saving, we'll use a download approach
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            
            // Auto-download the updated file
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('💾 Users saved to file successfully!', users.length, 'users');
            
            // Show notification
            if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
                window.advancedFeatures.realtimeNotifications.show(
                    'Data Saved',
                    'User data has been saved to users.json file',
                    'success'
                );
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error saving users to file:', error);
            
            if (window.advancedFeatures && window.advancedFeatures.realtimeNotifications) {
                window.advancedFeatures.realtimeNotifications.show(
                    'Save Error',
                    'Could not save to file: ' + error.message,
                    'error'
                );
            }
            
            return false;
        }
    }

    // Alternative method for manual file export
    exportUsersFile(users) {
        const data = {
            users: users,
            exportedAt: new Date().toISOString(),
            version: "1.0.0",
            totalUsers: users.length,
            exportedBy: "Portal Login System"
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('📁 Users file exported successfully');
    }

    // Import users from uploaded file
    async importUsersFile(fileInput) {
        return new Promise((resolve, reject) => {
            const file = fileInput.files[0];
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            if (file.type !== 'application/json') {
                reject(new Error('Please select a JSON file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.users && Array.isArray(data.users)) {
                        console.log('📥 Users imported from file:', data.users.length, 'users');
                        resolve(data.users);
                    } else {
                        reject(new Error('Invalid file format - missing users array'));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON file: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(file);
        });
    }

    // Create backup of current users
    createBackup(users) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupData = {
            users: users,
            backupCreatedAt: new Date().toISOString(),
            originalCount: users.length,
            version: "1.0.0"
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_backup_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('🔄 Backup created successfully');
    }
}

// Initialize file storage
const fileStorage = new FileStorageHandler();
