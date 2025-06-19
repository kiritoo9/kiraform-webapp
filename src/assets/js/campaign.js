// Campaign-specific JavaScript functions

// Pagination variables
let currentPage = 1;
let itemsPerPage = 5;
let filteredForms = [];

// Modal variables
let editingId = null;
const modal = document.getElementById('formModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const formForm = document.getElementById('formForm');
const formName = document.getElementById('formName');
const formDescription = document.getElementById('formDescription');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.getElementById('closeBtn');

// Sample forms data
let forms = [
    {
        id: 1,
        name: "Formulir Kontak",
        description: "Formulir kontak utama untuk website",
        status: "active",
        submissions: 342,
        conversionRate: 67.8,
        createdAt: "2024-03-15"
    },
    {
        id: 2,
        name: "Daftar Newsletter",
        description: "Formulir berlangganan email",
        status: "active",
        submissions: 578,
        conversionRate: 34.2,
        createdAt: "2024-03-10"
    },
    {
        id: 3,
        name: "Feedback Produk",
        description: "Pengumpulan feedback pelanggan",
        status: "draft",
        submissions: 89,
        conversionRate: 45.6,
        createdAt: "2024-03-08"
    },
    {
        id: 4,
        name: "Registrasi Acara",
        description: "Formulir pendaftaran webinar",
        status: "paused",
        submissions: 234,
        conversionRate: 78.9,
        createdAt: "2024-03-05"
    },
    {
        id: 5,
        name: "Permintaan Dukungan",
        description: "Formulir tiket dukungan pelanggan",
        status: "active",
        submissions: 156,
        conversionRate: 92.3,
        createdAt: "2024-03-01"
    },
    {
        id: 6,
        name: "Formulir Survei",
        description: "Survei kepuasan pelanggan",
        status: "active",
        submissions: 445,
        conversionRate: 52.3,
        createdAt: "2024-02-28"
    },
    {
        id: 7,
        name: "Permintaan Penawaran",
        description: "Formulir permintaan penawaran harga",
        status: "active",
        submissions: 289,
        conversionRate: 73.1,
        createdAt: "2024-02-25"
    },
    {
        id: 8,
        name: "Laporan Bug",
        description: "Pelaporan masalah teknis",
        status: "draft",
        submissions: 67,
        conversionRate: 88.9,
        createdAt: "2024-02-20"
    }
];

// Load campaign data from localStorage
function loadCampaignData() {
    const currentWorkspace = localStorage.getItem('currentWorkspace');
    if (currentWorkspace) {
        const workspace = JSON.parse(currentWorkspace);
        document.getElementById('campaignTitle').textContent = workspace.name;
        document.title = `${workspace.name} - KiraForm Campaign`;
    }
}

// Render forms table with pagination
function renderFormsTable() {
    const tbody = document.getElementById('formsTableBody');
    tbody.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedForms = filteredForms.slice(startIndex, endIndex);

    paginatedForms.forEach(form => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="form-name">${form.name}</div>
                <div class="form-description">${form.description}</div>
            </td>
            <td>
                <span class="status-badge status-${form.status}">${getStatusText(form.status)}</span>
            </td>
            <td><strong>${form.submissions.toLocaleString()}</strong></td>
            <td><strong>${form.conversionRate}%</strong></td>
            <td>${formatDate(form.createdAt)}</td>
            <td>
                <div class="table-actions-cell">
                    <button class="action-btn view" onclick="viewForm(${form.id})" title="Lihat Formulir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editForm(${form.id})" title="Edit Formulir">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="openAnalytics(${form.id})" title="Analitik" style="background: #1d4ed8; color: white; border-color: #1d4ed8;">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                    <button class="action-btn" onclick="openFormBuilder(${form.id})" title="Pembuat Formulir" style="background: #059669; color: white; border-color: #059669;">
                        <i class="fas fa-tools"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteForm(${form.id})" title="Hapus Formulir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderPagination();
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Update pagination info
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredForms.length);
    paginationInfo.textContent = `Menampilkan ${startItem}-${endItem} dari ${filteredForms.length} formulir`;
    
    // Clear pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToPage(i);
            paginationContainer.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFormsTable();
    }
}

// CRUD Operations
function viewForm(id) {
    const form = forms.find(f => f.id === id);
    if (form) {
        showNotification('Membuka Formulir', `Melihat "${form.name}" dalam mode pratinjau`, 'info');
        setTimeout(() => {
            navigateTo('form-editor.html');
        }, 500);
    }
}

function editForm(id) {
    const form = forms.find(f => f.id === id);
    if (form) {
        openEditModal(form);
    }
}

function deleteForm(id) {
    const form = forms.find(f => f.id === id);
    if (form && confirm(`Apakah Anda yakin ingin menghapus "${form.name}"?`)) {
        forms = forms.filter(f => f.id !== id);
        applySearch(); // Refresh filtered data
        showNotification('Formulir Dihapus', `"${form.name}" telah dihapus`, 'success');
    }
}

function openAnalytics(id) {
    const form = forms.find(f => f.id === id);
    if (form) {
        showNotification('Membuka Analitik', `Memuat analitik untuk "${form.name}"`, 'info');
        setTimeout(() => {
            navigateTo('analytic.html');
        }, 500);
    }
}

function openFormBuilder(id) {
    const form = forms.find(f => f.id === id);
    if (form) {
        showNotification('Membuka Pembuat Formulir', `Mengedit "${form.name}" di pembuat formulir`, 'info');
        setTimeout(() => {
            navigateTo('form-editor.html');
        }, 500);
    }
}

// Search functionality
function applySearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredForms = forms.filter(form => 
        form.name.toLowerCase().includes(searchTerm) || 
        form.description.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reset to first page when searching
    renderFormsTable();
}

// Export functionality
function exportData() {
    showNotification('Mengekspor Data', 'Menyiapkan ekspor Anda...', 'info');
    setTimeout(() => {
        showNotification('Ekspor Siap', 'Data berhasil diunduh', 'success');
    }, 2000);
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'active': 'Aktif',
        'draft': 'Draf',
        'paused': 'Dijeda'
    };
    return statusMap[status] || status;
}

// Modal functions
function openAddModal() {
    editingId = null;
    modalTitle.textContent = 'Tambah Formulir Baru';
    modalSubtitle.textContent = 'Buat formulir baru untuk kampanye Anda';
    submitBtn.textContent = 'Buat Formulir';
    formName.value = '';
    formDescription.value = '';
    formStatus.value = 'draft';
    modal.style.display = 'block';
    setTimeout(() => formName.focus(), 100);
}

function openEditModal(form) {
    editingId = form.id;
    modalTitle.textContent = 'Edit Formulir';
    modalSubtitle.textContent = 'Perbarui detail formulir';
    submitBtn.textContent = 'Perbarui Formulir';
    formName.value = form.name;
    formDescription.value = form.description;
    formStatus.value = form.status;
    modal.style.display = 'block';
    setTimeout(() => formName.focus(), 100);
}

function closeModal() {
    modal.style.display = 'none';
    editingId = null;
    formForm.reset();
}

function createForm(name, description, status) {
    const newForm = {
        id: Date.now(),
        name,
        description,
        status,
        submissions: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };
    forms.push(newForm);
    applySearch(); // Refresh filtered data
    showNotification('Formulir Dibuat', `"${name}" berhasil dibuat!`, 'success');
}

function updateForm(id, name, description, status) {
    const form = forms.find(f => f.id === id);
    if (form) {
        form.name = name;
        form.description = description;
        form.status = status;
        applySearch(); // Refresh filtered data
        showNotification('Formulir Diperbarui', `"${name}" berhasil diperbarui!`, 'success');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadCampaignData();
    filteredForms = [...forms]; // Initialize filtered forms
    renderFormsTable();
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', applySearch);
    
    // Form submission
    formForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = formName.value.trim();
        const description = formDescription.value.trim();
        const status = formStatus.value;
        
        if (!name) return;
        
        if (editingId) {
            updateForm(editingId, name, description, status);
        } else {
            createForm(name, description, status);
        }
        
        closeModal();
    });

    // Modal event listeners
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}); 