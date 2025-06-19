// Landing Page JavaScript

// Modal functionality
function showAuthModal(mode) {
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (mode === 'login') {
        modalTitle.textContent = 'Masuk ke KiraForm';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        modalTitle.textContent = 'Daftar ke KiraForm';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthMode(mode) {
    showAuthModal(mode);
}

// Mobile menu functionality
function toggleMobileMenu() {
    // Simple mobile menu toggle - could be expanded
    const navRight = document.querySelector('.nav-right');
    navRight.classList.toggle('mobile-active');
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation and redirect
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        if (email && password) {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';
            submitBtn.disabled = true;
            
            // Simulate login process
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal and redirect
                closeAuthModal();
                showNotification('Berhasil masuk! Mengalihkan ke dashboard...', 'success');
                
                setTimeout(() => {
                    navigateTo('dashboard.html');
                }, 1500);
            }, 2000);
        }
    });
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showNotification('Mohon lengkapi semua field', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Password tidak cocok', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password minimal 8 karakter', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendaftar...';
        submitBtn.disabled = true;
        
        // Simulate registration process
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal and redirect
            closeAuthModal();
            showNotification('Pendaftaran berhasil! Mengalihkan ke dashboard...', 'success');
            
            setTimeout(() => {
                navigateTo('dashboard.html');
            }, 1500);
        }, 2000);
    });
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAuthModal();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .hero-content, .hero-visual');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add some interactive effects to hero stats
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        let currentValue = 0;
        const increment = finalValue.includes('K') ? 100 : finalValue.includes('%') ? 1 : 50;
        const duration = 2000;
        const stepTime = duration / (parseFloat(finalValue) / increment);
        
        stat.textContent = '0';
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (finalValue.includes('K')) {
                if (currentValue >= 10000) {
                    stat.textContent = '10K+';
                    clearInterval(timer);
                } else if (currentValue >= 5000) {
                    stat.textContent = '5K+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue / 1000) + 'K+';
                }
            } else if (finalValue.includes('%')) {
                if (currentValue >= 99.9) {
                    stat.textContent = '99.9%';
                    clearInterval(timer);
                } else {
                    stat.textContent = currentValue.toFixed(1) + '%';
                }
            }
        }, stepTime);
    });
});

// Dynamic text rotation
document.addEventListener('DOMContentLoaded', function() {
    const dynamicTextElement = document.getElementById('dynamicText');
    const texts = [
        'Formulir Indah',
        'Survey Mudah',
        'Kuesioner Elegan',
        'Form Interaktif',
        'Formulir Modern'
    ];
    let currentIndex = 0;
    
    function rotateText() {
        dynamicTextElement.style.opacity = '0';
        dynamicTextElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % texts.length;
            dynamicTextElement.textContent = texts[currentIndex];
            dynamicTextElement.style.opacity = '1';
            dynamicTextElement.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Start rotation after 3 seconds, then every 3 seconds
    setInterval(rotateText, 3000);
});

// Form preview animation
document.addEventListener('DOMContentLoaded', function() {
    const formPreview = document.querySelector('.form-preview');
    
    if (formPreview) {
        setInterval(() => {
            const inputs = formPreview.querySelectorAll('.input-preview, .textarea-preview');
            inputs.forEach(input => {
                input.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                }, 200);
            });
        }, 3000);
    }
}); 