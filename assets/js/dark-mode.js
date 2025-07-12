// Dark Mode Manager for Tailwind CSS
// File: assets/js/dark-mode.js

class DarkModeManager {
    constructor() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.html = document.documentElement;
        
        // Check for stored preference or default to system preference
        this.darkMode = this.getStoredTheme() ?? this.getSystemTheme();
        
        console.log('Initializing dark mode with value:', this.darkMode);
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.darkMode);
        
        // Add event listener to toggle button
        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDarkMode();
            });
            console.log('Dark mode toggle button found and event listener added');
        } else {
            console.error('Dark mode toggle button not found!');
        }
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Update toggle button icon
        this.updateToggleIcon();
        
        console.log('Dark mode initialized:', this.darkMode ? 'dark' : 'light');
    }
    
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        console.log('Toggling dark mode to:', this.darkMode ? 'dark' : 'light');
        
        this.setTheme(this.darkMode);
        this.storeTheme(this.darkMode);
        this.updateToggleIcon();
        
        console.log('Theme toggled to:', this.darkMode ? 'dark' : 'light');
        console.log('HTML classList:', this.html.classList.toString());
    }
    
    setTheme(isDark) {
        console.log('Setting theme to:', isDark ? 'dark' : 'light');
        
        if (isDark) {
            this.html.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            this.html.classList.remove('dark');
            document.body.classList.remove('dark');
        }
        
        // Update meta theme color
        this.updateMetaThemeColor(isDark);
        
        // Trigger custom event for other components
        this.dispatchThemeChangeEvent(isDark);
        
        console.log('Theme set. HTML classes:', this.html.classList.toString());
    }
    
    updateToggleIcon() {
        if (this.darkModeToggle) {
            const icon = this.darkModeToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', this.darkMode ? 'sun' : 'moon');
                
                // Update feather icons if available
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
                console.log('Icon updated to:', this.darkMode ? 'sun' : 'moon');
            }
        }
    }
    
    updateMetaThemeColor(isDark) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = isDark ? '#111827' : '#ffffff';
    }
    
    dispatchThemeChangeEvent(isDark) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                isDark: isDark,
                theme: isDark ? 'dark' : 'light'
            }
        });
        document.dispatchEvent(event);
    }
    
    storeTheme(isDark) {
        try {
            // Store in localStorage for persistence
            localStorage.setItem('darkMode', isDark.toString());
            
            // Also store in memory for immediate access
            window.portfolioTheme = isDark;
        } catch (error) {
            console.warn('Could not store theme preference:', error);
            // Fallback to memory storage
            window.portfolioTheme = isDark;
        }
    }
    
    getStoredTheme() {
        try {
            // First try localStorage
            const stored = localStorage.getItem('darkMode');
            if (stored !== null) {
                return stored === 'true';
            }
            
            // Fallback to memory storage
            return window.portfolioTheme;
        } catch (error) {
            console.warn('Could not retrieve stored theme:', error);
            return window.portfolioTheme;
        }
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    }
    
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handler = (e) => {
                // Only update if no manual preference is stored
                if (this.getStoredTheme() === null) {
                    this.darkMode = e.matches;
                    this.setTheme(this.darkMode);
                    this.updateToggleIcon();
                }
            };
            
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handler);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handler);
            }
        }
    }
    
    // Public methods
    getCurrentTheme() {
        return this.darkMode ? 'dark' : 'light';
    }
    
    setDarkMode(isDark) {
        this.darkMode = isDark;
        this.setTheme(isDark);
        this.storeTheme(isDark);
        this.updateToggleIcon();
    }
    
    // Static method for easy initialization
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.darkModeManager = new DarkModeManager();
            });
        } else {
            window.darkModeManager = new DarkModeManager();
        }
    }
}

// Auto-initialize when script loads
DarkModeManager.init();

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}

// Manual toggle function for testing
window.toggleDarkMode = function() {
    if (window.darkModeManager) {
        window.darkModeManager.toggleDarkMode();
    }
};

// Listen for theme changes (for other components)
document.addEventListener('themeChanged', function(e) {
    console.log('Theme changed event received:', e.detail);
    // Other components can listen to this event
});