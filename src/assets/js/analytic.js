// Analytics page JavaScript functionality

// Sample submissions data
const submissions = [
    {
        id: 1,
        userName: 'Andi Santoso',
        userEmail: 'andi.santoso@email.com',
        formName: 'Formulir Feedback Produk',
        category: 'Produk',
        status: 'reviewed',
        submittedAt: '2024-01-15T10:30:00'
    },
    {
        id: 2,
        userName: 'Sarah Permata',
        userEmail: 'sarah.permata@email.com',
        formName: 'Survey Kepuasan Pelanggan',
        category: 'Layanan',
        status: 'pending',
        submittedAt: '2024-01-14T14:22:00'
    },
    {
        id: 3,
        userName: 'Budi Hartono',
        userEmail: 'budi.hartono@email.com',
        formName: 'Aplikasi Anggota Baru',
        category: 'Keanggotaan',
        status: 'approved',
        submittedAt: '2024-01-13T09:15:00'
    },
    {
        id: 4,
        userName: 'Dewi Sari',
        userEmail: 'dewi.sari@email.com',
        formName: 'Formulir Keluhan',
        category: 'Dukungan',
        status: 'pending',
        submittedAt: '2024-01-12T16:45:00'
    },
    {
        id: 5,
        userName: 'Ahmad Fauzi',
        userEmail: 'ahmad.fauzi@email.com',
        formName: 'Formulir Feedback Produk',
        category: 'Produk',
        status: 'reviewed',
        submittedAt: '2024-01-11T11:20:00'
    },
    {
        id: 6,
        userName: 'Rita Kusuma',
        userEmail: 'rita.kusuma@email.com',
        formName: 'Survey Kepuasan Pelanggan',
        category: 'Layanan',
        status: 'approved',
        submittedAt: '2024-01-10T13:30:00'
    },
    {
        id: 7,
        userName: 'Joko Widodo',
        userEmail: 'joko.widodo@email.com',
        formName: 'Aplikasi Anggota Baru',
        category: 'Keanggotaan',
        status: 'reviewed',
        submittedAt: '2024-01-09T08:45:00'
    },
    {
        id: 8,
        userName: 'Maya Indira',
        userEmail: 'maya.indira@email.com',
        formName: 'Formulir Keluhan',
        category: 'Dukungan',
        status: 'pending',
        submittedAt: '2024-01-08T15:10:00'
    }
];

// Initialize charts
function initCharts() {
    initSubmissionChart();
    initUserChart();
}

// Initialize submission trend chart
function initSubmissionChart() {
    const ctx = document.getElementById('submissionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1 Jan', '5 Jan', '10 Jan', '15 Jan', '20 Jan', '25 Jan', '30 Jan'],
            datasets: [{
                label: 'Kiriman Formulir',
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 12
                }
            },
            scales: {
                x: {
                    border: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#8e8e8e',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    border: {
                        display: false
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#8e8e8e',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Initialize user category chart
function initUserChart() {
    const ctx = document.getElementById('userChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Produk', 'Layanan', 'Keanggotaan', 'Dukungan'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#262626'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render submissions table
function renderSubmissionsTable() {
    const tbody = document.getElementById('submissionsTableBody');
    tbody.innerHTML = '';

    submissions.forEach(submission => {
        const row = document.createElement('tr');
        const initials = submission.userName.split(' ').map(n => n[0]).join('');
        
        // Status translation
        const statusTranslation = {
            'pending': 'Menunggu',
            'reviewed': 'Direview',
            'approved': 'Disetujui'
        };
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <div class="user-name">${submission.userName}</div>
                        <div class="user-email">${submission.userEmail}</div>
                    </div>
                </div>
            </td>
            <td><strong>${submission.formName}</strong></td>
            <td>
                <span class="category-badge category-${submission.category.toLowerCase()}">${submission.category}</span>
            </td>
            <td>
                <span class="status-badge status-${submission.status}">${statusTranslation[submission.status] || submission.status}</span>
            </td>
            <td>${formatDateTime(submission.submittedAt)}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewSubmission(${submission.id})" style="padding: 6px 12px; font-size: 12px;">
                    <i class="fas fa-eye"></i>
                    Lihat
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Utility function to format date and time in Indonesian
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                   'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month}, ${hours}:${minutes}`;
}

// Fixed viewSubmission function - no new tab opening
function viewSubmission(id) {
    const submission = submissions.find(s => s.id === id);
    if (submission) {
        showNotification('Membuka Kiriman', `Melihat kiriman dari ${submission.userName}`, 'info');
        setTimeout(() => {
            // Navigate in the same tab instead of opening new window
            navigateTo(`detail_submission.html?id=${id}`);
        }, 500);
    }
}

// Export submissions function
function exportSubmissions() {
    showNotification('Mengekspor Data', 'Menyiapkan ekspor kiriman...', 'info');
    setTimeout(() => {
        showNotification('Ekspor Siap', 'Data kiriman berhasil diunduh', 'success');
    }, 2000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    renderSubmissionsTable();
}); 