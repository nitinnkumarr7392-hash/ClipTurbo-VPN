class ClipTurboVPN {
    constructor() {
        this.isConnected = false;
        this.currentUser = null;
        this.currentPlan = 'FREE';
        this.isPremium = false;
        this.currentRegion = 'SG';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.simulateCapCutDetection();
        this.loadUserSession();
    }

    bindEvents() {
        // Auth events
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.getElementById('signupLink').onclick = () => this.toggleAuthForm();
        document.getElementById('loginLink').onclick = () => this.toggleAuthForm();

        // Main screen events
        document.getElementById('logoutBtn').onclick = () => this.logout();
        document.getElementById('connectBtn').onclick = () => this.toggleConnection();
        document.getElementById('upgradeBtn').onclick = () => this.upgradePremium();
        
        // Feature toggles
        document.getElementById('capcutMode').onchange = (e) => this.toggleCapCutMode(e.target.checked);
        document.getElementById('turboMode').onchange = (e) => this.toggleTurboMode(e.target.checked);

        // Region selector
        document.querySelectorAll('.region-btn').forEach(btn => {
            btn.onclick = (e) => this.selectRegion(e.target.dataset.region);
        });

        // Simulate real-time updates
        setInterval(() => this.updateSpeedMonitor(), 2000);
        setInterval(() => this.updateBoostLevels(), 3000);
    }

    // Auth Functions
    handleLogin() {
        const email = document.getElementById('emailInput').value;
        if (email.includes('@')) {
            this.currentUser = email;
            this.showMainScreen();
            this.updateUI();
            localStorage.setItem('clipTurboUser', email);
        } else {
            this.showError('Please enter valid email');
        }
    }

    handleSignup() {
        const email = document.getElementById('signupEmail').value;
        this.currentUser = email;
        this.showMainScreen();
        this.updateUI();
        localStorage.setItem('clipTurboUser', email);
        this.showNotification('Welcome to ClipTurbo! Free plan activated.');
    }

    toggleAuthForm() {
        document.getElementById('loginForm').classList.toggle('hidden');
        document.getElementById('signupForm').classList.toggle('hidden');
    }

    // Screen Management
    showMainScreen() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
    }

    loadUserSession() {
        const savedUser = localStorage.getItem('clipTurboUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showMainScreen();
            this.updateUI();
        }
    }

    logout() {
        localStorage.removeItem('clipTurboUser');
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
        this.currentUser = null;
    }

    // Connection Management
    async toggleConnection() {
        const btn = document.getElementById('connectBtn');
        
        if (!this.isConnected) {
            btn.textContent = 'Connecting...';
            btn.classList.add('connecting');
            
            // Show server selection modal
            this.showServerTestModal();
        } else {
            this.disconnect();
        }
    }

    async showServerTestModal() {
        document.getElementById('connectModal').classList.remove('hidden');
        
        // Simulate server ping tests
        const servers = ['SG', 'JP', 'DE', 'US'];
        const pings = [28, 45, 120, 180]; // Simulated ping values
        
        servers.forEach((region, index) => {
            setTimeout(() => {
                const serverItem = document.querySelector(`[data-region="${region}"] .ping`);
                serverItem.textContent = `${pings[index]} ms`;
                
                if (index === 0) { // Select fastest server
                    document.querySelector(`[data-region="${region}"]`).classList.add('selected');
                }
            }, (index + 1) * 800);
        });

        // Connect after testing
        setTimeout(() => {
            this.connect();
        }, 4000);
    }

    connect() {
        this.isConnected = true;
        document.getElementById('connectModal').classList.add('hidden');
        document.getElementById('connectBtn').textContent = 'Disconnect';
        document.getElementById('connectBtn').classList.remove('connecting');
        document.getElementById('speedMonitor').classList.remove('hidden');
        
        this.updateStatusIndicator();
        this.showNotification('✅ Connected to Singapore (28ms) - CapCut Optimized!');
    }

    disconnect() {
        this.isConnected = false;
        document.getElementById('connectBtn').textContent = 'Connect to CapCut';
        document.getElementById('speedMonitor').classList.add('hidden');
        this.updateStatusIndicator();
        this.showNotification('Disconnected');
    }

    // UI Updates
    updateUI() {
        document.getElementById('userEmail').textContent = this.currentUser;
        document.getElementById('planBadge').textContent = this.currentPlan;
        
        if (this.isPremium) {
            document.getElementById('planBadge').textContent = 'PREMIUM';
            document.getElementById('planBadge').style.background = 'var(--success)';
            document.getElementById('premiumCard').style.display = 'none';
        }
    }

    updateStatusIndicator() {
        const indicator = document.getElementById('statusIndicator');
        const circle = document.querySelector('.circle');
        
        if (this.isConnected) {
            indicator.querySelector('span').textContent = 'Connected';
            circle.className = 'circle connected';
        } else {
            indicator.querySelector('span').textContent = 'Disconnected';
            circle.className = 'circle disconnected';
        }
    }

    // Feature Controls
    toggleCapCutMode(enabled) {
        if (enabled) {
            this.showNotification('🎯 Smart CapCut Mode ON - Auto-connect enabled');
        } else {
            this.showNotification('Smart CapCut Mode OFF');
        }
    }

    toggleTurboMode(enabled) {
        if (enabled) {
            this.showNotification('⚡ Turbo Protocol ACTIVATED - 3x faster!');
        } else {
            this.showNotification('Turbo Protocol OFF');
        }
    }

    selectRegion(region) {
        this.currentRegion = region;
        document.querySelectorAll('.region-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-region="${region}"]`).classList.add('active');
        this.showNotification(`🌍 Switched to ${region}`);
    }

    // Real-time Updates
    updateSpeedMonitor() {
        if (!this.isConnected) return;
        
        const pings = [25, 28, 32, 22, 29];
        const downloads = [45, 52, 48, 61, 55];
        const uploads = [12, 15, 14, 18, 16];
        
        document.getElementById('pingValue').textContent = 
            `${pings[Math.floor(Math.random() * pings.length)]} ms`;
        document.getElementById('downloadValue').textContent = 
            `${downloads[Math.floor(Math.random() * downloads.length)]} Mbps`;
        document.getElementById('uploadValue').textContent = 
            `${uploads[Math.floor(Math.random() * uploads.length)]} Mbps`;
    }

    updateBoostLevels() {
        const templateBoost = Math.floor(Math.random() * 30) + 70; // 70-100%
        const effectBoost = Math.floor(Math.random() * 25) + 75;
        const uploadBoost = Math.floor(Math.random() * 35) + 65;
        
        document.getElementById('templateBoost').style.width = `${templateBoost}%`;
        document.getElementById('effectBoost').style.width = `${effectBoost}%`;
        document.getElementById('uploadBoost').style.width = `${uploadBoost}%`;
    }

    // Premium Features
    upgradePremium() {
        this.isPremium = true;
        this.currentPlan = 'PREMIUM';
        this.updateUI();
        this.showNotification('🎉 Premium activated! Enjoy unlimited features 🚀');
    }

    // Smart CapCut Detection
    simulateCapCutDetection() {
        setTimeout(() => {
            if (!this.isConnected && document.getElementById('capcutMode').checked) {
                this.showNotification('🎯 CapCut detected! Auto-connecting...');
                setTimeout(() => this.toggleConnection(), 1000);
            }
        }, 10000);
    }

    // Utility Functions
    showNotification(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16,185,129,0.4);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(`❌ ${message}`);
    }
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new ClipTurboVPN();
});
