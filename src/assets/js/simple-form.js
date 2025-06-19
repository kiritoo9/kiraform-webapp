// Instagram-Inspired Form JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeAnimations();
    setupEventListeners();
});

// Initialize form functionality
function initializeForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input focus animations
    initializeInputAnimations();
    
    // Add floating label effects
    initializeFloatingLabels();
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        showConfirmModal();
    }
}

// Form validation
function validateForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Remove existing error states
    clearErrorStates();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const value = formData.get(fieldName);
        
        if (!value || value.trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        const emailField = document.getElementById('email');
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Show validation result
    if (!isValid) {
        showNotification('Please fix the errors before submitting', 'error');
        
        // Shake form animation
        const formContainer = document.querySelector('.form-container');
        formContainer.classList.add('shake');
        setTimeout(() => {
            formContainer.classList.remove('shake');
        }, 600);
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(field, message) {
    const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
    
    // Add error class
    field.classList.add('error');
    wrapper.classList.add('error');
    
    // Create error message if it doesn't exist
    let errorMsg = wrapper.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        wrapper.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    
    // Animate error message
    errorMsg.style.animation = 'slideInDown 0.3s ease-out';
}

// Clear error states
function clearErrorStates() {
    const errorFields = document.querySelectorAll('.form-input.error');
    const errorWrappers = document.querySelectorAll('.input-wrapper.error, .form-group.error');
    const errorMessages = document.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorWrappers.forEach(wrapper => wrapper.classList.remove('error'));
    errorMessages.forEach(msg => msg.remove());
}

// Initialize input animations
function initializeInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', function() {
            this.closest('.input-wrapper').classList.add('focused');
            addRippleEffect(this);
        });
        
        // Blur animation
        input.addEventListener('blur', function() {
            this.closest('.input-wrapper').classList.remove('focused');
        });
        
        // Input animation
        input.addEventListener('input', function() {
            this.closest('.input-wrapper').classList.toggle('has-value', this.value.length > 0);
        });
    });
}

// Add ripple effect to inputs
function addRippleEffect(element) {
    const wrapper = element.closest('.input-wrapper');
    const ripple = document.createElement('div');
    ripple.className = 'input-ripple';
    
    wrapper.appendChild(ripple);
    
    // Animate ripple
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize floating labels
function initializeFloatingLabels() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Check initial value
        if (input.value.length > 0) {
            input.closest('.input-wrapper').classList.add('has-value');
        }
    });
}

// Initialize page animations
function initializeAnimations() {
    // Animate floating icons
    animateFloatingIcons();
    
    // Animate contact info cards on scroll
    setupScrollAnimations();
    
    // Add parallax effect to hero
    setupParallaxEffect();
}

// Animate floating icons
function animateFloatingIcons() {
    const icons = document.querySelectorAll('.floating-icon');
    
    icons.forEach((icon, index) => {
        const delay = parseInt(icon.dataset.delay) || 0;
        
        setTimeout(() => {
            icon.style.animation = `float 6s ease-in-out infinite ${index * 2}s`;
            icon.style.opacity = '0.1';
        }, delay);
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        observer.observe(card);
    });
}

// Setup parallax effect
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Modal close on outside click
    setupModalListeners();
    
    // Button hover effects
    setupButtonEffects();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
}

// Setup modal listeners
function setupModalListeners() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

// Setup button effects
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.submit-btn, .modal-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            addClickRipple(this, e);
        });
    });
}

// Add click ripple effect
function addClickRipple(button, event) {
    const ripple = button.querySelector('.btn-ripple');
    
    if (ripple) {
        ripple.style.animation = 'none';
        ripple.offsetHeight; // Trigger reflow
        ripple.style.animation = 'ripple 0.6s ease-out';
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal functions
function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    showModal(modal);
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    closeModal(modal);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    showModal(modal);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    closeModal(modal);
}

function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate modal icon
    const icon = modal.querySelector('.modal-icon');
    if (icon) {
        icon.style.animation = 'bounce 0.6s ease-out';
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Confirm form submission
function confirmSubmit() {
    closeConfirmModal();
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Sending...</span>
    `;
    submitBtn.disabled = true;
    
    // Simulate sending process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        document.getElementById('contactForm').reset();
        clearErrorStates();
        
        // Remove has-value classes
        document.querySelectorAll('.input-wrapper.has-value').forEach(wrapper => {
            wrapper.classList.remove('has-value');
        });
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 350px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        border-radius: 4px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

// Helper functions for notifications
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#00c851',
        error: '#ed4956',
        warning: '#ff8800',
        info: '#007bff'
    };
    return colors[type] || colors.info;
}

// Add CSS for animations and effects
const additionalCSS = `
    .shake {
        animation: shake 0.6s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-input.error {
        border-color: var(--error-color) !important;
        background: rgba(237, 73, 86, 0.05) !important;
    }
    
    .error-message {
        color: var(--error-color);
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 500;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .input-ripple {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(240, 148, 51, 0.1) 0%, rgba(230, 104, 60, 0.1) 100%);
        border-radius: inherit;
        pointer-events: none;
    }
    
    @keyframes ripple {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: scale(1.2);
        }
    }
    
    .info-card.animate-in {
        animation: cardSlideIn 0.6s ease-out;
    }
    
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet); 