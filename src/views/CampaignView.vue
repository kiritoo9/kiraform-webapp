<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { showNotification } from '@/composable/common/notif';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const workspaceId = route.params.id;

// Modal state management
const isModalOpen = ref(false);
const modalMode = ref<'add' | 'edit'>('add');
const currentFormId = ref<string | null>(null);

// Form data
const formData = reactive({
  name: '',
  description: '',
  status: 'draft'
});

// Modal functions
const openAddModal = () => {
  modalMode.value = 'add';
  formData.name = '';
  formData.description = '';
  formData.status = 'draft';
  currentFormId.value = null;
  isModalOpen.value = true;
};

const openEditModal = (formId: string, formName: string, formDescription: string, formStatus: string) => {
  modalMode.value = 'edit';
  formData.name = formName;
  formData.description = formDescription;
  formData.status = formStatus;
  currentFormId.value = formId;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    formData.name = '';
    formData.description = '';
    formData.status = 'draft';
    currentFormId.value = null;
  }, 150);
};

const submitForm = () => {
  if (!formData.name.trim()) {
    showNotification('Nama formulir harus diisi', 'error');
    return;
  }

  if (modalMode.value === 'add') {
    // Handle add form logic here
    showNotification('Formulir berhasil ditambahkan!', 'success');
    console.log('Adding new form:', formData);
  } else {
    // Handle edit form logic here
    showNotification('Formulir berhasil diperbarui!', 'success');
    console.log('Editing form:', currentFormId.value, formData);
  }

  closeModal();
};

// Export data function
const exportData = () => {
  showNotification('Data berhasil diekspor!', 'success');
  console.log('Exporting data...');
};

// Form editor function
const openFormEditor = (formId: string) => {
  showNotification('Membuka form editor...', 'info');
  console.log('Opening form editor for:', formId);
};

// Analytics function
const openAnalytics = (formId: string) => {
  showNotification('Membuka analytics...', 'info');
  console.log('Opening analytics for:', formId);
};

// Delete function
const deleteForm = (formId: string, formName: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus formulir "${formName}"?`)) {
    showNotification('Formulir berhasil dihapus!', 'success');
    console.log('Deleting form:', formId);
  }
};

</script>

<template>
  <Header />

  <div class="container">
    <div class="welcome-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item" @click="router.push({ name: 'home' })">KiraForm</span>
        <i class="fas fa-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-item" @click="router.push({ name: 'workspace' })">Workspace</span>
        <i class="fas fa-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-item current">Formulir</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
        </div>
        <div class="stat-value">2,847</div>
        <div class="stat-label">Total Pengunjung</div>
        <div class="stat-change positive">
          <i class="fas fa-arrow-up"></i>
          12.5% vs bulan lalu
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
        <div class="stat-value">1,293</div>
        <div class="stat-label">Kiriman Formulir</div>
        <div class="stat-change positive">
          <i class="fas fa-arrow-up"></i>
          8.2% vs bulan lalu
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <i class="fas fa-percentage"></i>
          </div>
        </div>
        <div class="stat-value">45.4%</div>
        <div class="stat-label">Tingkat Konversi</div>
        <div class="stat-change negative">
          <i class="fas fa-arrow-down"></i>
          2.1% vs bulan lalu
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
        </div>
        <div class="stat-value">2:34</div>
        <div class="stat-label">Rata-rata Waktu Selesai</div>
        <div class="stat-change positive">
          <i class="fas fa-arrow-up"></i>
          15d lebih cepat
        </div>
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <h2 class="table-title">Formulir dalam Kampanye Ini</h2>
        <div class="table-actions">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" placeholder="Cari formulir..." id="searchInput">
          </div>
          <button class="btn btn-secondary" @click="exportData">
            <i class="fas fa-download"></i>
            Ekspor
          </button>
          <button class="btn btn-primary" @click="openAddModal">
            <i class="fas fa-plus"></i>
            Tambah Formulir
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="modern-table" id="formsTable">
          <thead>
            <tr>
              <th>Nama Formulir</th>
              <th>Status</th>
              <th>Kiriman</th>
              <th>Tingkat Konversi</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="formsTableBody">
            <tr>
              <td>
                <div class="form-name">Formulir Pendaftaran Event</div>
                <div class="form-description">Formulir untuk mendaftar acara webinar marketing digital</div>
              </td>
              <td>
                <span class="status-badge status-active">Aktif</span>
              </td>
              <td>342</td>
              <td>67.8%</td>
              <td>15 Mar 2024</td>
              <td>
                <div class="table-actions-cell">
                  <button class="action-btn form-editor" title="Form Editor" @click="openFormEditor('form-1')">
                    <i class="fas fa-tools"></i>
                  </button>
                  <button class="action-btn analytic" title="Analytics" @click="openAnalytics('form-1')">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-btn edit" title="Edit"
                    @click="openEditModal('form-1', 'Formulir Pendaftaran Event', 'Formulir untuk mendaftar acara webinar marketing digital', 'active')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Delete"
                    @click="deleteForm('form-1', 'Formulir Pendaftaran Event')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="form-name">Survey Kepuasan Pelanggan</div>
                <div class="form-description">Mengukur tingkat kepuasan layanan customer service</div>
              </td>
              <td>
                <span class="status-badge status-draft">Draft</span>
              </td>
              <td>128</td>
              <td>45.2%</td>
              <td>12 Mar 2024</td>
              <td>
                <div class="table-actions-cell">
                  <button class="action-btn form-editor" title="Form Editor" @click="openFormEditor('form-2')">
                    <i class="fas fa-tools"></i>
                  </button>
                  <button class="action-btn analytic" title="Analytics" @click="openAnalytics('form-2')">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-btn edit" title="Edit"
                    @click="openEditModal('form-2', 'Survey Kepuasan Pelanggan', 'Mengukur tingkat kepuasan layanan customer service', 'draft')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Delete"
                    @click="deleteForm('form-2', 'Survey Kepuasan Pelanggan')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="form-name">Kontak Informasi Produk</div>
                <div class="form-description">Form untuk inquiry produk dan layanan perusahaan</div>
              </td>
              <td>
                <span class="status-badge status-active">Aktif</span>
              </td>
              <td>567</td>
              <td>73.1%</td>
              <td>08 Mar 2024</td>
              <td>
                <div class="table-actions-cell">
                  <button class="action-btn form-editor" title="Form Editor" @click="openFormEditor('form-3')">
                    <i class="fas fa-tools"></i>
                  </button>
                  <button class="action-btn analytic" title="Analytics" @click="openAnalytics('form-3')">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-btn edit" title="Edit"
                    @click="openEditModal('form-3', 'Kontak Informasi Produk', 'Form untuk inquiry produk dan layanan perusahaan', 'active')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Delete"
                    @click="deleteForm('form-3', 'Kontak Informasi Produk')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="form-name">Registrasi Newsletter</div>
                <div class="form-description">Berlangganan newsletter mingguan untuk update terbaru</div>
              </td>
              <td>
                <span class="status-badge status-paused">Dijeda</span>
              </td>
              <td>89</td>
              <td>32.4%</td>
              <td>05 Mar 2024</td>
              <td>
                <div class="table-actions-cell">
                  <button class="action-btn form-editor" title="Form Editor" @click="openFormEditor('form-4')">
                    <i class="fas fa-tools"></i>
                  </button>
                  <button class="action-btn analytic" title="Analytics" @click="openAnalytics('form-4')">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-btn edit" title="Edit"
                    @click="openEditModal('form-4', 'Registrasi Newsletter', 'Berlangganan newsletter mingguan untuk update terbaru', 'paused')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Delete"
                    @click="deleteForm('form-4', 'Registrasi Newsletter')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="form-name">Feedback Aplikasi Mobile</div>
                <div class="form-description">Masukan dan saran untuk perbaikan aplikasi mobile</div>
              </td>
              <td>
                <span class="status-badge status-active">Aktif</span>
              </td>
              <td>234</td>
              <td>58.9%</td>
              <td>02 Mar 2024</td>
              <td>
                <div class="table-actions-cell">
                  <button class="action-btn form-editor" title="Form Editor" @click="openFormEditor('form-5')">
                    <i class="fas fa-tools"></i>
                  </button>
                  <button class="action-btn analytic" title="Analytics" @click="openAnalytics('form-5')">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-btn edit" title="Edit"
                    @click="openEditModal('form-5', 'Feedback Aplikasi Mobile', 'Masukan dan saran untuk perbaikan aplikasi mobile', 'active')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" title="Delete"
                    @click="deleteForm('form-5', 'Feedback Aplikasi Mobile')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        <div class="pagination-info" id="paginationInfo">
          Menampilkan 1-5 dari 8 formulir
        </div>
        <div class="pagination" id="pagination">
          <button class="pagination-btn" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="pagination-btn active">1</button>
          <button class="pagination-btn">2</button>
          <span class="pagination-dots">...</span>
          <button class="pagination-btn">8</button>
          <button class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <br /><br />

  <!-- Form Modal -->
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ modalMode === 'add' ? 'Tambah Formulir Baru' : 'Edit Formulir' }}</h2>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="formName">Nama Formulir</label>
            <input type="text" id="formName" placeholder="Masukkan nama formulir" v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label for="formDescription">Deskripsi</label>
            <textarea id="formDescription" placeholder="Jelaskan kegunaan formulir ini..."
              v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="formStatus">Status</label>
            <select id="formStatus" v-model="formData.status">
              <option value="draft">Draf</option>
              <option value="active">Aktif</option>
              <option value="paused">Dijeda</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Batal</button>
            <button type="submit" class="btn-primary">
              {{ modalMode === 'add' ? 'Buat Formulir' : 'Update Formulir' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped src="../assets/css/common.css"></style>
<style scoped src="../assets/css/campaign.css"></style>
<style scoped src="../assets/css/breadcrumb.css"></style>