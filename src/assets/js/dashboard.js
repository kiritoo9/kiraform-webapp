// Dashboard-specific JavaScript functions

// Sample workspace data
const workspaces = [
    {
        id: 1,
        name: "Kampanye Pemasaran",
        description: "Formulir untuk kampanye pemasaran digital dan lead generation",
        icon: "fas fa-bullhorn",
        forms: 12,
        submissions: 1847,
        conversion: "45.2%"
    },
    {
        id: 2,
        name: "Riset Pelanggan",
        description: "Survei kepuasan dan feedback pelanggan untuk peningkatan produk",
        icon: "fas fa-users",
        forms: 8,
        submissions: 923,
        conversion: "67.8%"
    },
    {
        id: 3,
        name: "Acara & Webinar",
        description: "Registrasi dan pengelolaan peserta acara serta webinar online",
        icon: "fas fa-calendar-alt",
        forms: 15,
        submissions: 2156,
        conversion: "82.1%"
    }
];

// Render workspace grid
function renderWorkspaceGrid() {
    const container = document.getElementById('workspaceGrid');
    container.innerHTML = '';

    workspaces.forEach(workspace => {
        const workspaceCard = document.createElement('a');
        workspaceCard.href = 'javascript:void(0)';
        workspaceCard.className = 'workspace-card';
        workspaceCard.onclick = () => openWorkspace(workspace);
        
        workspaceCard.innerHTML = `
            <div class="workspace-icon">
                <i class="${workspace.icon}"></i>
            </div>
            <h3 class="workspace-title">${workspace.name}</h3>
            <p class="workspace-description">${workspace.description}</p>
            <div class="workspace-stats">
                <div class="stat-item">
                    <span class="stat-value">${workspace.forms}</span>
                    <span class="stat-label">Formulir</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${workspace.submissions.toLocaleString()}</span>
                    <span class="stat-label">Kiriman</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${workspace.conversion}</span>
                    <span class="stat-label">Konversi</span>
                </div>
            </div>
        `;
        
        container.appendChild(workspaceCard);
    });
}

// Open workspace
function openWorkspace(workspace) {
    showNotification('Membuka Ruang Kerja', `Beralih ke "${workspace.name}"`, 'info');
    
    // Store current workspace in localStorage
    localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
    
    setTimeout(() => {
        navigateTo('campaign.html');
    }, 500);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderWorkspaceGrid();
}); 