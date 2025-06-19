// Profile Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme
    applySavedTheme();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Set up form submission
    setupFormSubmission();
    
    // Initialize image preview
    initializeImagePreview();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('dropdown');
        const profileBtn = document.querySelector('.profile-btn');
        
        if (dropdown && profileBtn && !profileBtn.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});

// Use the dropdown from common.js
function toggleProfileDropdown() {
    toggleDropdown();
}

// Dark mode functionality
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon text in dropdown
    const darkModeItem = document.querySelector('.dropdown-item[onclick="toggleDarkMode()"]');
    const icon = darkModeItem.querySelector('i');
    
    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
        darkModeItem.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
    } else {
        icon.className = 'fas fa-moon';
        darkModeItem.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon text in dropdown based on current theme
    const darkModeItem = document.querySelector('.dropdown-item[onclick="toggleDarkMode()"]');
    if (darkModeItem) {
        const icon = darkModeItem.querySelector('i');
        
        if (savedTheme === 'dark') {
            icon.className = 'fas fa-sun';
            darkModeItem.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        } else {
            icon.className = 'fas fa-moon';
            darkModeItem.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
        }
    }
}

// Avatar upload functionality
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Ukuran file terlalu besar. Maksimal 5MB.', 'error');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('File harus berupa gambar.', 'error');
        return;
    }
    
    // Create file reader
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Update all avatar images
        document.getElementById('avatarPreview').src = imageUrl;
        document.getElementById('currentAvatarImage').src = imageUrl;
        document.getElementById('navProfileImage').src = imageUrl;
        
        showNotification('Foto profil berhasil diperbarui.', 'success');
    };
    
    reader.readAsDataURL(file);
}

function removeAvatar() {
    const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format';
    
    // Reset to default avatar
    document.getElementById('avatarPreview').src = defaultAvatar;
    document.getElementById('currentAvatarImage').src = defaultAvatar;
    document.getElementById('navProfileImage').src = defaultAvatar;
    
    // Clear file input
    document.getElementById('avatarInput').value = '';
    
    showNotification('Foto profil telah dihapus.', 'info');
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Password validation
function initializeFormValidation() {
    const newPasswordInput = document.getElementById('newPassword');
    
    newPasswordInput.addEventListener('input', function() {
        validatePassword(this.value);
    });
}

function validatePassword(password) {
    const requirements = {
        'req-length': password.length >= 8,
        'req-uppercase': /[A-Z]/.test(password),
        'req-lowercase': /[a-z]/.test(password),
        'req-number': /\d/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (requirements[reqId]) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    });
    
    return Object.values(requirements).every(req => req);
}

// Form submission
function setupFormSubmission() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

function handleFormSubmission() {
    // Show confirmation dialog instead of directly saving
    showConfirmModal();
}

function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function confirmSave() {
    // Close confirmation modal
    closeConfirmModal();
    
    // Get form data
    const formData = new FormData(document.getElementById('profileForm'));
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password fields if they're filled
    if (newPassword || confirmPassword) {
        if (!currentPassword) {
            showNotification('Password saat ini harus diisi untuk mengubah password.', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('Password baru dan konfirmasi tidak cocok.', 'error');
            return;
        }
        
        if (!validatePassword(newPassword)) {
            showNotification('Password baru tidak memenuhi persyaratan.', 'error');
            return;
        }
    }
    
    // Validate required fields
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    
    if (!fullName || !email) {
        showNotification('Nama lengkap dan email harus diisi.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Format email tidak valid.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update sidebar info if name or email changed
        document.querySelector('.sidebar-title').textContent = fullName;
        document.querySelector('.sidebar-subtitle').textContent = email;
        
        // Show success modal
        showSuccessModal();
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }, 2000);
}

// Reset form
function resetForm() {
    // Confirm action
    if (!confirm('Apakah Anda yakin ingin mereset form? Semua perubahan akan hilang.')) {
        return;
    }
    
    // Reset form to original values
    document.getElementById('profileForm').reset();
    
    // Reset avatar to original
    const originalAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format';
    document.getElementById('avatarPreview').src = originalAvatar;
    document.getElementById('currentAvatarImage').src = originalAvatar;
    document.getElementById('navProfileImage').src = originalAvatar;
    
    // Reset form values to original
    document.getElementById('fullName').value = 'Ahmad Rizki';
    document.getElementById('email').value = 'ahmad.rizki@email.com';
    document.getElementById('phone').value = '+62 812-3456-7890';
    document.getElementById('company').value = 'PT. Teknologi Nusantara';
    document.getElementById('language').value = 'id';
    document.getElementById('timezone').value = 'Asia/Jakarta';
    
    // Reset checkboxes
    document.querySelector('input[name="emailNotifications"]').checked = true;
    document.querySelector('input[name="marketingEmails"]').checked = false;
    
    // Clear password validation
    const passwordRequirements = document.querySelectorAll('.password-requirements li');
    passwordRequirements.forEach(req => req.classList.remove('valid'));
    
    showNotification('Form telah direset ke nilai awal.', 'info');
}

// Success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

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
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
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
        max-width: 350px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const successModal = document.getElementById('successModal');
    const confirmModal = document.getElementById('confirmModal');
    const imageModal = document.getElementById('imagePreviewModal');
    
    if (e.target === successModal) {
        closeSuccessModal();
    }
    
    if (e.target === confirmModal) {
        closeConfirmModal();
    }
    
    if (e.target === imageModal) {
        closeImagePreview();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessModal();
        closeImagePreview();
    }
});

// Auto-save functionality (optional)
function enableAutoSave() {
    const inputs = document.querySelectorAll('.form-input, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            // Save to localStorage
            const formData = new FormData(document.getElementById('profileForm'));
            const data = Object.fromEntries(formData.entries());
            localStorage.setItem('profileDraft', JSON.stringify(data));
        });
    });
}

// Load draft data on page load
function loadDraftData() {
    const draft = localStorage.getItem('profileDraft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key] === 'on';
                    } else {
                        input.value = data[key];
                    }
                }
            });
        } catch (e) {
            console.error('Error loading draft data:', e);
        }
    }
}

// File upload drag and drop (optional enhancement)
function initializeDragAndDrop() {
    const avatarUpload = document.querySelector('.avatar-upload');
    
    avatarUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    avatarUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    avatarUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                // Simulate file input change
                const fileInput = document.getElementById('avatarInput');
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                
                // Trigger the change event
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            } else {
                showNotification('File harus berupa gambar.', 'error');
            }
        }
    });
}

// Image preview functionality
function initializeImagePreview() {
    // Make avatar clickable in form section too
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) {
        avatarPreview.parentElement.style.cursor = 'pointer';
        avatarPreview.parentElement.onclick = showImagePreview;
    }
}

function showImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    const currentImage = document.getElementById('currentAvatarImage');
    
    if (modal && previewImage && currentImage) {
        previewImage.src = currentImage.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Enable auto-save (uncomment if needed)
    // enableAutoSave();
    // loadDraftData();
    
    // Initialize drag and drop for avatar upload
    initializeDragAndDrop();
}); 