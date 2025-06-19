// Form Editor JavaScript functionality

// Current mode (design or preview)
let currentMode = 'design';

// Form elements array
let formElements = [];

// Selected element
let selectedElement = null;

// Element counter for unique IDs
let elementCounter = 0;

// Initialize editor
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    setupEventListeners();
});

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    const componentItems = document.querySelectorAll('.component-item');

    // Make component items draggable
    componentItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });

    // Add listeners to the initial drop zone in HTML
    const initialDropZone = document.querySelector('.drop-zone');
    if (initialDropZone) {
        initialDropZone.addEventListener('dragover', handleDragOver);
        initialDropZone.addEventListener('drop', handleDrop);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form title and description editing
    const formTitle = document.querySelector('.form-title');
    const formDescription = document.querySelector('.form-description');

    formTitle.addEventListener('blur', saveFormSettings);
    formDescription.addEventListener('blur', saveFormSettings);
}

// Handle drag start
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.type);
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    const elementType = e.dataTransfer.getData('text/plain');
    
    if (elementType) {
        // Since we only have one drop zone at the bottom, always add to the end
        createFormElement(elementType);
    }
}

// Create form element
function createFormElement(type) {
    elementCounter++;
    const elementId = `element_${elementCounter}`;
    
    const element = {
        id: elementId,
        type: type,
        label: getDefaultLabel(type),
        placeholder: getDefaultPlaceholder(type),
        required: false,
        options: type === 'radio' || type === 'checkbox' || type === 'select' ? ['Pilihan 1', 'Pilihan 2'] : null
    };

    // Add to the end of the array
    formElements.push(element);
    renderFormElements();
    selectElement(elementId);
}

// Get default label for element type
function getDefaultLabel(type) {
    const labels = {
        'text': 'Kolom Teks',
        'textarea': 'Area Teks',
        'number': 'Kolom Angka',
        'email': 'Alamat Email',
        'phone': 'Nomor Telepon',
        'radio': 'Pilihan Tunggal',
        'checkbox': 'Pilihan Ganda',
        'select': 'Menu Dropdown',
        'date': 'Tanggal',
        'file': 'Upload File',
        'rating': 'Rating'
    };
    return labels[type] || 'Label';
}

// Get default placeholder for element type
function getDefaultPlaceholder(type) {
    const placeholders = {
        'text': 'Masukkan teks di sini...',
        'textarea': 'Masukkan deskripsi lengkap...',
        'number': 'Masukkan angka...',
        'email': 'contoh@email.com',
        'phone': '08123456789',
        'date': 'Pilih tanggal',
        'file': 'Pilih file untuk diupload'
    };
    return placeholders[type] || '';
}

// Render form elements
function renderFormElements() {
    const container = document.getElementById('formElements');
    
    if (formElements.length === 0) {
        showInitialDropZone();
        return;
    }

    container.innerHTML = '';
    
    // Add all form elements first
    formElements.forEach((element, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'form-element';
        elementDiv.dataset.id = element.id;
        elementDiv.innerHTML = generateElementHTML(element);
        
        // Add click handler
        elementDiv.addEventListener('click', () => selectElement(element.id));
        
        container.appendChild(elementDiv);
    });
    
    // Add only ONE drop zone at the bottom
    container.appendChild(createDropZone(formElements.length));
}

// Create drop zone element
function createDropZone(index) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    
    // Always show the same text since there's only one drop zone
    dropZone.innerHTML = `
        <i class="fas fa-plus-circle"></i>
        <p>Seret komponen ke sini</p>
    `;
    
    // Add drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    
    return dropZone;
}

// Generate HTML for form element
function generateElementHTML(element) {
    let html = `
        <div class="element-controls">
            <button class="element-control" onclick="editElement('${element.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="element-control delete" onclick="deleteElement('${element.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <label class="form-label">${element.label}${element.required ? ' *' : ''}</label>
    `;

    // Add readonly/disabled attribute for design mode
    const isDesignMode = currentMode === 'design';
    const inputAttributes = isDesignMode ? 'readonly onclick="return false;" style="pointer-events: none; background: var(--bg-elevated);"' : '';

    switch (element.type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'number':
            html += `<input type="${element.type}" class="form-input" placeholder="${element.placeholder}" ${element.required ? 'required' : ''} ${inputAttributes}>`;
            break;
        case 'textarea':
            html += `<textarea class="form-input" placeholder="${element.placeholder}" rows="4" ${element.required ? 'required' : ''} ${inputAttributes}></textarea>`;
            break;
        case 'date':
            html += `<input type="date" class="form-input" ${element.required ? 'required' : ''} ${inputAttributes}>`;
            break;
        case 'file':
            html += `<input type="file" class="form-input" ${element.required ? 'required' : ''} ${isDesignMode ? 'disabled' : ''}>`;
            break;
        case 'radio':
            if (element.options) {
                element.options.forEach((option, index) => {
                    html += `
                        <div style="margin-bottom: 8px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="${element.id}" value="${option}" ${element.required ? 'required' : ''} ${isDesignMode ? 'disabled' : ''}>
                                ${option}
                            </label>
                        </div>
                    `;
                });
            }
            break;
        case 'checkbox':
            if (element.options) {
                element.options.forEach((option, index) => {
                    html += `
                        <div style="margin-bottom: 8px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="checkbox" name="${element.id}[]" value="${option}" ${isDesignMode ? 'disabled' : ''}>
                                ${option}
                            </label>
                        </div>
                    `;
                });
            }
            break;
        case 'select':
            html += `<select class="form-input" ${element.required ? 'required' : ''} ${isDesignMode ? 'disabled' : ''}>`;
            html += `<option value="">Pilih opsi...</option>`;
            if (element.options) {
                element.options.forEach(option => {
                    html += `<option value="${option}">${option}</option>`;
                });
            }
            html += `</select>`;
            break;
        case 'rating':
            html += `
                <div style="display: flex; gap: 4px;">
                    ${[1,2,3,4,5].map(i => `<i class="fas fa-star" style="color: #fbbf24; font-size: 20px; ${isDesignMode ? 'pointer-events: none;' : 'cursor: pointer;'}"></i>`).join('')}
                </div>
            `;
            break;
    }

    return html;
}

// Select element
function selectElement(elementId) {
    // Remove previous selection
    document.querySelectorAll('.form-element').forEach(el => {
        el.classList.remove('selected');
    });

    // Add selection to current element
    const elementDiv = document.querySelector(`[data-id="${elementId}"]`);
    if (elementDiv) {
        elementDiv.classList.add('selected');
        selectedElement = formElements.find(el => el.id === elementId);
        showElementProperties();
    }
}

// Show element properties
function showElementProperties() {
    if (!selectedElement) return;

    const propertiesContent = document.querySelector('.properties-content');
    
    let html = `
        <div style="margin-bottom: 16px;">
            <label class="form-label">Label</label>
            <input type="text" class="form-input" value="${selectedElement.label}" onchange="updateElementProperty('label', this.value)">
        </div>
    `;

    if (selectedElement.type !== 'radio' && selectedElement.type !== 'checkbox' && selectedElement.type !== 'select' && selectedElement.type !== 'rating') {
        html += `
            <div style="margin-bottom: 16px;">
                <label class="form-label">Placeholder</label>
                <input type="text" class="form-input" value="${selectedElement.placeholder || ''}" onchange="updateElementProperty('placeholder', this.value)">
            </div>
        `;
    }

    html += `
        <div style="margin-bottom: 16px;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer;">
                <input type="checkbox" ${selectedElement.required ? 'checked' : ''} onchange="updateElementProperty('required', this.checked)">
                Wajib Diisi
            </label>
        </div>
    `;

    if (selectedElement.options) {
        html += `
            <div style="margin-bottom: 16px;">
                <label class="form-label">Pilihan</label>
                <div id="optionsContainer">
                    ${selectedElement.options.map((option, index) => `
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <input type="text" class="form-input" value="${option}" onchange="updateOption(${index}, this.value)" style="flex: 1;">
                            <button onclick="removeOption(${index})" style="background: #ef4444; color: white; border: none; border-radius: 6px; padding: 8px; cursor: pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="addOption()" style="background: var(--accent-color); color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; margin-top: 8px;">
                    <i class="fas fa-plus"></i> Tambah Pilihan
                </button>
            </div>
        `;
    }

    propertiesContent.innerHTML = html;
}

// Update element property
function updateElementProperty(property, value) {
    if (selectedElement) {
        selectedElement[property] = value;
        renderFormElements();
        selectElement(selectedElement.id); // Re-select to maintain selection
    }
}

// Update option
function updateOption(index, value) {
    if (selectedElement && selectedElement.options) {
        selectedElement.options[index] = value;
        renderFormElements();
        selectElement(selectedElement.id);
    }
}

// Add option
function addOption() {
    if (selectedElement && selectedElement.options) {
        selectedElement.options.push(`Pilihan ${selectedElement.options.length + 1}`);
        showElementProperties();
        renderFormElements();
        selectElement(selectedElement.id);
    }
}

// Remove option
function removeOption(index) {
    if (selectedElement && selectedElement.options && selectedElement.options.length > 1) {
        selectedElement.options.splice(index, 1);
        showElementProperties();
        renderFormElements();
        selectElement(selectedElement.id);
    }
}

// Delete element
function deleteElement(elementId) {
    if (confirm('Apakah Anda yakin ingin menghapus elemen ini?')) {
        formElements = formElements.filter(el => el.id !== elementId);
        selectedElement = null;
        document.querySelector('.properties-content').innerHTML = '<p class="properties-placeholder">Pilih komponen untuk mengedit properti</p>';
        renderFormElements();
    }
}

// Edit element (same as select for now)
function editElement(elementId) {
    selectElement(elementId);
}

// Show initial drop zone
function showInitialDropZone() {
    const container = document.getElementById('formElements');
    container.innerHTML = '';
    
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.innerHTML = `
        <i class="fas fa-plus-circle"></i>
        <p>Seret komponen ke sini untuk memulai membuat formulir</p>
    `;
    
    // Add drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    
    container.appendChild(dropZone);
}

// Switch mode (design/preview)
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchMode('${mode}')"]`).classList.add('active');
    
    if (mode === 'preview') {
        showPreview();
    } else {
        closePreview();
        // Re-render elements to update input states
        renderFormElements();
    }
}

// Show preview
function showPreview() {
    const modal = document.getElementById('previewModal');
    const previewBody = document.getElementById('previewBody');
    
    // Generate preview HTML
    let html = '<form style="max-width: 600px; margin: 0 auto;">';
    
    // Form header
    const formTitle = document.querySelector('.form-title').textContent;
    const formDescription = document.querySelector('.form-description').textContent;
    
    html += `
        <div style="margin-bottom: 32px; text-align: center;">
            <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">${formTitle}</h2>
            <p style="color: var(--text-secondary); font-size: 14px;">${formDescription}</p>
        </div>
    `;
    
    // Form elements (without design mode restrictions)
    const previewMode = currentMode;
    currentMode = 'preview'; // Temporarily set to preview mode
    
    formElements.forEach(element => {
        html += `<div style="margin-bottom: 24px;">`;
        html += generateElementHTML(element);
        html += `</div>`;
    });
    
    currentMode = previewMode; // Restore mode
    
    // Submit button
    html += `
        <div style="text-align: center; margin-top: 32px;">
            <button type="submit" style="background: var(--accent-color); color: white; border: none; border-radius: 12px; padding: 16px 32px; font-size: 16px; font-weight: 500; cursor: pointer;">
                Kirim Formulir
            </button>
        </div>
    `;
    
    html += '</form>';
    
    previewBody.innerHTML = html;
    modal.classList.add('show');
}

// Close preview
function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('show');
    
    // Ensure design mode is active when closing preview
    if (currentMode === 'preview') {
        currentMode = 'design';
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchMode('design')"]`).classList.add('active');
        
        // Re-render elements to update input states
        renderFormElements();
    }
}

// Save form
function saveForm() {
    showSaveConfirmModal();
}

// Publish form
function publishForm() {
    if (formElements.length === 0) {
        showNotification('Tidak Dapat Dipublikasikan', 'Tambahkan setidaknya satu elemen formulir', 'error');
        return;
    }
    showPublishConfirmModal();
}

// Show save confirmation modal
function showSaveConfirmModal() {
    const modal = document.getElementById('saveConfirmModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close save confirmation modal
function closeSaveConfirmModal() {
    const modal = document.getElementById('saveConfirmModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Confirm save
function confirmSave() {
    closeSaveConfirmModal();
    
    const formTitle = document.querySelector('.form-title').textContent;
    
    // Show loading on save button
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    saveBtn.disabled = true;
    
    // Simulate save process
    setTimeout(() => {
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        // Show success modal
        showSuccessModal('Formulir Berhasil Disimpan', `"${formTitle}" telah berhasil disimpan.`);
    }, 1500);
}

// Show publish confirmation modal
function showPublishConfirmModal() {
    const modal = document.getElementById('publishConfirmModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close publish confirmation modal
function closePublishConfirmModal() {
    const modal = document.getElementById('publishConfirmModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Confirm publish
function confirmPublish() {
    closePublishConfirmModal();
    
    const formTitle = document.querySelector('.form-title').textContent;
    
    // Show loading on publish button
    const publishBtn = document.querySelector('.publish-btn');
    const originalText = publishBtn.innerHTML;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mempublikasikan...';
    publishBtn.disabled = true;
    
    // Simulate publish process
    setTimeout(() => {
        // Reset button
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
        
        // Show success modal
        showSuccessModal('Formulir Berhasil Dipublikasikan', `"${formTitle}" telah dipublikasikan dan dapat diakses oleh responden.`);
    }, 2000);
}

// Show success modal
function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const titleElement = document.getElementById('successTitle');
    const messageElement = document.getElementById('successMessage');
    
    if (modal && titleElement && messageElement) {
        titleElement.textContent = title;
        messageElement.textContent = message;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Save form settings
function saveFormSettings() {
    // This would normally save to backend
    console.log('Form settings saved');
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const saveModal = document.getElementById('saveConfirmModal');
    const publishModal = document.getElementById('publishConfirmModal');
    const successModal = document.getElementById('successModal');
    
    if (e.target === saveModal) {
        closeSaveConfirmModal();
    }
    
    if (e.target === publishModal) {
        closePublishConfirmModal();
    }
    
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// Show notification function (fallback for error cases)
function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <div>
                <div style="font-weight: 600;">${title}</div>
                <div style="font-size: 13px; opacity: 0.8;">${message}</div>
            </div>
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
        gap: 12px;
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