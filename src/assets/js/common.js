// Common JavaScript functions for all pages

// Dark Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    setTimeout(() => {
        if (isDark) {
            html.removeAttribute('data-theme');
            showNotification('Mode Terang', 'Beralih ke tema terang', 'success');
        } else {
            html.setAttribute('data-theme', 'dark');
            showNotification('Mode Gelap', 'Beralih ke tema gelap', 'success');
        }
        
        // Update dropdown icon
        const icon = document.querySelector('.dropdown-item i.fa-moon, .dropdown-item i.fa-sun');
        if (icon) {
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        }
    }, 200);
}

// Profile Dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// Notification System
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: var(--bg-elevated);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        padding: 16px 20px;
        min-width: 300px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--transition-base);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    `;
    
    // Add notification content styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        .notification-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${type === 'success' ? '#10b981' : type === 'error' ? '#1d4ed8' : '#1d4ed8'};
            font-size: 16px;
        }
        .notification-title {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        .notification-message {
            font-size: 13px;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// Navigation functions
function navigateTo(url) {
    window.location.href = url;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
} 