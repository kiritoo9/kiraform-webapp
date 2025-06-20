<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { showNotification } from '@/composable/common/notif';
import { useRouter } from 'vue-router';

import { getWorkspace, addWorkspace, editWorkspace, deleteWorkspace } from '@/composable/masters/workspace';

const router = useRouter();

// reactive state
const showAddModal = ref(false)
const isEditMode = ref(false)

// define workspace state
const workspacePayload = reactive({
  id: null,
  title: '',
  description: '',
})

// workspace data data
const workspaces = reactive<any[]>([])

function openAddModal() {
  isEditMode.value = false
  workspacePayload.id = null
  workspacePayload.title = ''
  workspacePayload.description = ''
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  isEditMode.value = false
  workspacePayload.id = null
  workspacePayload.title = ''
  workspacePayload.description = ''
}

async function addNewWorkspace() {
  if (workspacePayload.title === '') {
    showNotification('Judul workspace tidak boleh kosong', 'error');
    return;
  }

  try {
    const _data = {
      title: workspacePayload.title,
      description: workspacePayload.description,
      is_publish: true,
      thumbnail: workspacePayload.title.substring(0, 1).toUpperCase()
    }
    if (isEditMode.value && workspacePayload.id) {
      await editWorkspace(workspacePayload.id, _data);
      showNotification(`Workspace "${workspacePayload.title}" berhasil diperbarui`, 'success')
      await getWorkspaceData();
    } else {
      const response: any = await addWorkspace(_data);
      if (response?.code === 201) {
        showNotification(`Workspace baru telah ditambahkan`, 'success')
        await getWorkspaceData();
      } else {
        throw new Error("Terjadi kesalahan saat menambahkan workspace");
      }
    }
    closeAddModal();
  } catch (error: any) {
    showNotification(error?.message, 'error');
  }
}

function detailWorkspaceHandler(workspace: any) {
  router.push({ name: 'campaign', params: { id: workspace.id } });
}

function editWorkspaceHandler(workspace: any) {
  isEditMode.value = true
  workspacePayload.id = workspace.id
  workspacePayload.title = workspace.title
  workspacePayload.description = workspace.description
  showAddModal.value = true
}

async function deleteWorkspaceHandler(workspace: any) {
  if (confirm(`Apakah Anda yakin ingin menghapus workspace "${workspace.title}"?`)) {
    try {
      await deleteWorkspace(workspace.id);
      showNotification(`Workspace "${workspace.title}" berhasil dihapus`, 'success')
      await getWorkspaceData();
    } catch (error: any) {
      showNotification(error?.message, 'error');
    }
  }
}

async function getWorkspaceData() {
  try {
    const response: any = await getWorkspace();
    if (response?.data?.rows !== undefined) {
      workspaces.length = 0;
      response?.data?.rows.forEach((workspace: any) => {
        workspaces.push({
          id: workspace.id,
          title: workspace.title,
          description: workspace.description,
          forms: 0,
          submissions: 0,
        });
      });
    }
  } catch (error: any) {
    showNotification(error?.message, 'error');
  }
}

onMounted(async () => {
  await getWorkspaceData();
})
</script>

<template>
  <Header />

  <div class="container">
    <div class="welcome-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item" @click="router.push({ name: 'home' })">KiraForm</span>
        <i class="fas fa-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-item current">Workspace</span>
      </div>
    </div>

    <div class="workspace-grid">
      <div v-for="workspace in workspaces" :key="workspace.id" class="workspace-card">
        <h3 class="workspace-title">{{ workspace.title }}</h3>
        <p class="workspace-description">{{ workspace.description }}</p>
        <div class="workspace-stats">
          <div class="stat-item">
            <span class="stat-value">{{ workspace.forms }}</span>
            <span class="stat-label">Formulir</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ workspace.submissions.toLocaleString() }}</span>
            <span class="stat-label">Kiriman</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="workspace-actions" @click.stop>
          <button class="action-btn detail-btn" @click="detailWorkspaceHandler(workspace)" title="Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit-btn" @click="editWorkspaceHandler(workspace)" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" @click="deleteWorkspaceHandler(workspace)" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="workspace-card add-workspace-card" @click="openAddModal">
        <div class="workspace-icon add-icon">
          <i class="fas fa-plus"></i>
        </div>
        <h3 class="workspace-title">Tambah Workspace</h3>
        <p class="workspace-description">Buat workspace baru untuk mengorganisir formulir Anda</p>
      </div>
    </div>
  </div>

  <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Workspace' : 'Tambah Workspace Baru' }}</h2>
        <button class="modal-close" @click="closeAddModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addNewWorkspace">
          <div class="form-group">
            <label for="workspaceName">Judul Workspace</label>
            <input type="text" id="workspaceName" v-model="workspacePayload.title"
              placeholder="Masukkan judul workspace" required>
          </div>
          <div class="form-group">
            <label for="workspaceDescription">Deskripsi</label>
            <textarea id="workspaceDescription" v-model="workspacePayload.description" placeholder="Masukkan deskripsi"
              rows="3" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeAddModal">
              Batal
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Perbarui Workspace' : 'Tambah Workspace' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped src="../assets/css/common.css"></style>
<style scoped src="../assets/css/dashboard.css"></style>
<style scoped src="../assets/css/breadcrumb.css"></style>
<style scoped>
/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 80px 24px;
}

/* Enhanced workspace card styling */
.workspace-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 28px;
  border: 1px solid #efefef;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.workspace-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #1d4ed8;
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.workspace-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #1d4ed8;
}

.workspace-card:hover::before {
  opacity: 1;
}

.workspace-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.1), rgba(59, 130, 246, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #1d4ed8;
  font-size: 28px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.workspace-card:hover .workspace-icon {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.2), rgba(59, 130, 246, 0.2));
}

.workspace-title {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.workspace-description {
  color: #8e8e8e;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 0px;
  flex: 1;
}

.workspace-stats {
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-size: 13px;
  margin-top: 0px !important;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: center;
}

.stat-value {
  font-weight: 700;
  color: #262626;
}

.stat-label {
  color: #8e8e8e;
}

/* Workspace Action Buttons */
.workspace-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  background: #f8fafc;
  color: #6b7280;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-btn:hover {
  background: #dbeafe;
  color: #2563eb;
}

.edit-btn:hover {
  background: #fef3c7;
  color: #d97706;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Actions always visible */

/* Add workspace card specific styling */
.add-workspace-card {
  border: 1px dashed #d1d5db;
  background: #fafafa;
  opacity: 0.9;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 280px;
}

.add-workspace-card:hover {
  opacity: 1;
  border-color: #1d4ed8;
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.1);
}

.add-icon {
  background: #f8fafc;
  color: #9ca3af;
  margin-bottom: 16px;
}

.add-workspace-card:hover .add-icon {
  background: #1d4ed8;
  color: white;
  transform: scale(1.05);
}

.add-workspace-card .workspace-title {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.add-workspace-card .workspace-description {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 0;
  line-height: 1.4;
}

/* Enhanced Modal styles with better visibility */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid #efefef;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #efefef;
  background: #fafafa;
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #8e8e8e;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #262626;
  background: #f5f5f5;
}

.modal-body {
  padding: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  font-size: 14px;
  color: #262626;
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.btn-primary {
  background: #1d4ed8;
  color: white;
  border: 1px solid #1d4ed8;
}

.btn-primary:hover {
  background: #1e40af;
  border-color: #1e40af;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.btn-secondary {
  background: #ffffff;
  color: #8e8e8e;
  border: 1px solid #dbdbdb;
}

.btn-secondary:hover {
  background: #f5f5f5;
  color: #262626;
  border-color: #1d4ed8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .workspace-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-header,
  .modal-body {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .workspace-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .workspace-card {
    padding: 24px 20px;
  }

  .workspace-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>