// Main JavaScript for general functionality

class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupNavigation();
        this.addScrollAnimations();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavigation() {
        // Highlight active navigation item based on scroll position
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    addScrollAnimations() {
        // Add fade-in animation for elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards and form sections
        document.querySelectorAll('.feature-card, .planner-container, .scanner-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// API Integration Helper Class
class AIServiceAPI {
    constructor() {
        // Placeholder for API configuration
        this.apiEndpoint = 'YOUR_API_ENDPOINT_HERE';
        this.apiKey = 'YOUR_API_KEY_HERE';
    }

    /**
     * Send nutrition data to AI service for personalized plan generation
     * @param {Object} userData - User information and preferences
     * @returns {Promise<Object>} - AI-generated nutrition plan
     */
    async generateNutritionPlan(userData) {
        try {
            // Example API call structure (replace with actual API)
            const response = await fetch(`${this.apiEndpoint}/nutrition-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error calling nutrition plan API:', error);
            throw error;
        }
    }

    /**
     * Send meal image to AI service for analysis
     * @param {File} imageFile - Image file of the meal
     * @returns {Promise<Object>} - AI-analyzed nutritional information
     */
    async analyzeMealImage(imageFile) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            // Example API call structure (replace with actual API)
            const response = await fetch(`${this.apiEndpoint}/meal-analysis`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error calling meal analysis API:', error);
            throw error;
        }
    }

    /**
     * Get micronutrient recommendations based on user profile
     * @param {Object} userProfile - User age, gender, health conditions
     * @returns {Promise<Object>} - Personalized micronutrient recommendations
     */
    async getMicronutrientRecommendations(userProfile) {
        try {
            const response = await fetch(`${this.apiEndpoint}/micronutrients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(userProfile)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error calling micronutrient API:', error);
            throw error;
        }
    }
}

// Utility Functions
const Utils = {
    /**
     * Format date to readable string
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Save data to local storage
     */
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Load data from local storage
     */
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    /**
     * Download data as JSON file
     */
    downloadAsJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Show notification/toast message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .nav-links a.active {
        color: var(--primary-color);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
    
    // Make API service available globally for other scripts
    window.aiAPI = new AIServiceAPI();
    window.utils = Utils;
    
    console.log('🥗 AI Nutrition Assistant loaded successfully!');
    console.log('💡 To integrate with actual AI services, update the API endpoints in js/main.js');
});

// Made with Bob
