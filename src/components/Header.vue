<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/access_token';
const authStore = useAuthStore();
import { useRouter } from 'vue-router';
const router = useRouter();

const dropdownOpen = ref(false)
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleClickOutside(e: Event) {
  const target = e.target as HTMLElement
  if (!target.closest('.profile-dropdown')) {
    dropdownOpen.value = false
  }
}

function logout() {
  authStore.clearToken();
  router.push({ name: 'home' });
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="header">
    <div class="header-left">
      <router-link to="/" class="logo">
        KiraForm
      </router-link>
    </div>
    <div class="header-right">
      <div class="profile-dropdown">
        <button class="profile-btn" @click="toggleDropdown">JD</button>
        <div class="dropdown-menu" :class="{ show: dropdownOpen }" id="dropdown">
          <a href="javascript:void(0)" @click="router.push({ name: 'profile' })" class="dropdown-item">
            <i class="fas fa-user"></i>
            Profil
          </a>
          <div class="dropdown-divider"></div>
          <a href="javascript:void(0)" @click="logout" class="dropdown-item">
            <i class="fas fa-sign-out-alt"></i>
            Keluar
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped src="../assets/css/common.css"></style>
<style scoped>
.header {
  background: #ffffff !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 2px solid #e5e7eb !important;
  padding: 14px 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  margin-bottom: 0;
}

.header-title {
  color: #1d4ed8 !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  position: relative !important;
  transition: all 0.2s ease !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
}

.header-title:hover {
  background: #f1f5f9 !important;
  border-color: #cbd5e1 !important;
  color: #1e40af !important;
}

.dropdown-menu {
  position: absolute !important;
  top: calc(100% + 8px) !important;
  right: 0 !important;
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  min-width: 180px !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(-4px) scale(0.98) !important;
  transition: all 0.15s ease !important;
  overflow: hidden !important;
  padding: 6px !important;
}

.dropdown-menu.show {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) scale(1) !important;
}

.dropdown-item {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 10px 12px !important;
  color: #374151 !important;
  text-decoration: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  transition: all 0.1s ease !important;
  border-radius: 6px !important;
  margin: 0 !important;
}

.dropdown-item:hover {
  background: #f8fafc !important;
  color: #111827 !important;
}

.dropdown-item i {
  color: #9ca3af !important;
  width: 16px !important;
  font-size: 14px !important;
}

.dropdown-item:hover i {
  color: #1d4ed8 !important;
}

.dropdown-divider {
  height: 1px !important;
  background: #f1f5f9 !important;
  margin: 6px 0 !important;
  border: none !important;
}
</style>