<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import { ref, onMounted, onUnmounted } from 'vue';

import { showNotification } from '@/composable/common/notif';
import { loginService, registService } from '@/composable/auth/auth';

// load global store
import { useAuthStore } from '@/stores/access_token';
const authStore = useAuthStore();

// define reactive state
const isAuthModalOpen = ref(false);
const authMode = ref<'login' | 'register'>('login');
const isLoading = ref(false);
const dynamicTexts = [
  'Formulir Indah',
  'Survey Menarik',
  'Kuesioner Efektif',
  'Form Interaktif',
  'Polling Cerdas',
  'Feedback System'
];
const currentTextIndex = ref(0);

// check if user already logged in
authStore.loadToken();
const isLogged = ref(authStore.accessToken ? true : false);

// login input
const login = ref({
  email: "",
  password: "",
});
const regist = ref({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
});

// modal functions
const showAuthModal = (mode: 'login' | 'register') => {
  authMode.value = mode;
  isAuthModalOpen.value = true;
  document.body.style.overflow = 'hidden';
  clearForms();
};

const closeAuthModal = () => {
  isAuthModalOpen.value = false;
  document.body.style.overflow = '';
  clearForms();
};

const switchAuthMode = (mode: 'login' | 'register') => {
  authMode.value = mode;
};

const clearForms = () => {
  // clear forms
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    (form as HTMLFormElement).reset();
  });

  // clear form errors
  const inputs = document.querySelectorAll('.auth-form input');
  inputs.forEach(input => {
    input.classList.remove('error', 'success');
  });
};

const toggleMobileMenu = () => {
  const navRight = document.querySelector('.nav-right');
  navRight?.classList.toggle('mobile-active');
};

const handleLogin = async () => {
  // validation input
  if (!login.value.email || !login.value.password) {
    showNotification('Mohon lengkapi email dan password', 'error');
    return;
  }

  // perform to hit service
  isLoading.value = true;
  try {
    const response: any = await loginService(login.value.email, login.value.password);
    // get token
    const accessToken: string = response?.data?.access_token ?? undefined;
    if (accessToken === undefined) throw new Error("Terjadi kesalahan saat menarik data token");

    // store token into global state
    authStore.setToken(accessToken);

    // redirecting page
    closeAuthModal();
    showNotification('Login berhasil, memuat workspace anda..', 'success');
    setTimeout(() => {
      router.push({ name: 'workspace' });
    }, 1000);
  } catch (error: any) {
    closeAuthModal();
    showNotification(error?.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  // validation input
  if (
    !regist.value.name ||
    !regist.value.email ||
    !regist.value.password ||
    !regist.value.confirm_password
  ) {
    showNotification('Mohon lengkapi semua form pendaftaran', 'error');
    return;
  }

  if (regist.value.password !== regist.value.confirm_password) {
    showNotification('Konfirmasi password tidak sesuai', 'error');
    return;
  }

  // perform to hit service
  isLoading.value = true;
  try {
    const response: any = await registService(regist.value.name, regist.value.email, regist.value.password);
    if (response?.code === 201) {
      showNotification('Pendaftaran berhasil, silahkan login untuk melanjutkan!', 'success');
      closeAuthModal();
    }
  } catch (error: any) {
    closeAuthModal();
    showNotification(error?.message, 'error');
  } finally {
    isLoading.value = false;
  }
}

const handleAnchorClick = (e: Event, targetId: string) => {
  e.preventDefault();
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
};

const handleScroll = () => {
  const navbar = document.querySelector('.navbar') as HTMLElement;

  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.1)';
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
    }
  }
};

// dynamic text rotation with smooth transition
const rotateText = () => {
  const dynamicTextElement = document.getElementById('dynamicText');
  if (dynamicTextElement) {
    // Fade out with scale
    dynamicTextElement.style.opacity = '0';
    dynamicTextElement.style.transform = 'translateY(-10px) scale(0.9)';

    setTimeout(() => {
      // Change text
      currentTextIndex.value = (currentTextIndex.value + 1) % dynamicTexts.length;
      dynamicTextElement.textContent = dynamicTexts[currentTextIndex.value];

      // Fade in with bounce effect
      dynamicTextElement.style.opacity = '1';
      dynamicTextElement.style.transform = 'translateY(0) scale(1)';

      // Add a subtle pulse effect
      setTimeout(() => {
        dynamicTextElement.style.transform = 'translateY(0) scale(1.05)';
        setTimeout(() => {
          dynamicTextElement.style.transform = 'translateY(0) scale(1)';
        }, 150);
      }, 100);
    }, 300);
  }
};

const handleClickOutside = (e: Event) => {
  const modal = document.getElementById('authModal');
  if (e.target === modal) {
    closeAuthModal();
  }
};

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
};

const setupAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  const animatedElements = document.querySelectorAll('.feature-card, .hero-content, .hero-visual');

  animatedElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
};

let textRotationInterval: number;

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
  setupAnimations();
  const dynamicTextElement = document.getElementById('dynamicText');
  if (dynamicTextElement) {
    dynamicTextElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    dynamicTextElement.style.display = 'inline-block';
  }
  setTimeout(() => {
    textRotationInterval = setInterval(rotateText, 3000);
  }, 3000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
  if (textRotationInterval) clearInterval(textRotationInterval);
});
</script>

<template>
  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left"></div>
      <div class="nav-right">
        <a href="#features" class="nav-link" @click="handleAnchorClick($event, 'features')">Fitur</a>
        <a href="#features" class="nav-link" @click="handleAnchorClick($event, 'testimoni')">Testimoni</a>
        <button class="btn-secondary" v-if="!isLogged" @click="showAuthModal('login')">
          Masuk
        </button>
        <button class="btn-primary" v-if="!isLogged" @click="showAuthModal('register')">
          Daftar
        </button>
        <button class="btn-primary" v-if="isLogged" @click="router.push({ name: 'workspace' })">
          Workspace
        </button>
      </div>
      <button class="mobile-menu-toggle" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          Buat <span class="highlight" id="dynamicText">Formulir Indah</span><br>
          dalam Hitungan Menit
        </h1>
        <p class="hero-subtitle">
          Platform pembuatan formulir modern yang membantu Anda mengumpulkan data dengan cara yang elegan dan efisien.
          Tanpa coding, tanpa ribet.
        </p>
        <div class="hero-actions">
          <button class="btn-secondary-large" @click="showAuthModal('register')">
            <i class="fas fa-rocket"></i>
            Mulai Gratis
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Formulir Dibuat</div>
          </div>
          <div class="stat">
            <div class="stat-number">5K+</div>
            <div class="stat-label">Pengguna Aktif</div>
          </div>
          <div class="stat">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="form-preview">
          <div class="form-header">
            <div class="form-controls">
              <span class="control red"></span>
              <span class="control yellow"></span>
              <span class="control green"></span>
            </div>
            <span class="form-title-preview">Formulir Kontak</span>
          </div>
          <div class="form-body">
            <div class="form-field">
              <label>Nama Lengkap</label>
              <div class="input-preview"></div>
            </div>
            <div class="form-field">
              <label>Email</label>
              <div class="input-preview"></div>
            </div>
            <div class="form-field">
              <label>Pesan</label>
              <div class="textarea-preview"></div>
            </div>
            <div class="submit-preview">Kirim Pesan</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Mengapa Memilih KiraForm?</h2>
        <p class="section-subtitle">
          Solusi lengkap untuk semua kebutuhan formulir Anda
        </p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-paint-brush"></i>
          </div>
          <h3 class="feature-title">Drag & Drop Builder</h3>
          <p class="feature-description">
            Buat formulir dengan mudah menggunakan editor visual yang intuitif. Seret dan lepas komponen sesuai
            kebutuhan.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3 class="feature-title">Responsive Design</h3>
          <p class="feature-description">
            Formulir yang dibuat otomatis responsif dan terlihat sempurna di semua perangkat, dari desktop hingga
            mobile.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <h3 class="feature-title">Analytics Real-time</h3>
          <p class="feature-description">
            Pantau performa formulir Anda dengan dashboard analytics yang memberikan insight mendalam dan real-time.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3 class="feature-title">Keamanan Terjamin</h3>
          <p class="feature-description">
            Data Anda aman dengan enkripsi end-to-end dan compliance dengan standar keamanan internasional.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-puzzle-piece"></i>
          </div>
          <h3 class="feature-title">Integrasi Mudah</h3>
          <p class="feature-description">
            Integrasikan dengan platform favorit Anda seperti Google Sheets, Slack, dan banyak lainnya.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <h3 class="feature-title">Performa Tinggi</h3>
          <p class="feature-description">
            Loading cepat dan performa optimal untuk pengalaman pengguna yang luar biasa.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="testimonials" id="testimoni">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Apa Kata Pengguna Kami?</h2>
        <p class="section-subtitle">
          Ribuan pengguna telah mempercayai KiraForm untuk kebutuhan formulir mereka
        </p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-content">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <p class="testimonial-text">
              "KiraForm sangat memudahkan pekerjaan saya. Interface yang intuitif dan fitur drag & drop membuat
              pembuatan formulir menjadi sangat cepat dan mudah."
            </p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b5c9?w=64&h=64&fit=crop&crop=face&auto=format"
                alt="Sarah Putri">
            </div>
            <div class="author-info">
              <div class="author-name">Sarah Putri</div>
              <div class="author-role">Digital Marketing Manager</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="testimonial-content">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <p class="testimonial-text">
              "Analytics real-time dari KiraForm memberikan insight yang sangat berharga untuk bisnis kami. Data yang
              akurat dan visualisasi yang menarik."
            </p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format"
                alt="Ahmad Rizki">
            </div>
            <div class="author-info">
              <div class="author-name">Ahmad Rizki</div>
              <div class="author-role">Product Manager</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="testimonial-content">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <p class="testimonial-text">
              "Sebagai startup, kami butuh solusi yang cepat dan efisien. KiraForm memberikan semua yang kami butuhkan
              dengan harga yang sangat terjangkau."
            </p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format"
                alt="Lisa Maharani">
            </div>
            <div class="author-info">
              <div class="author-name">Lisa Maharani</div>
              <div class="author-role">Founder, TechStart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">Siap Membuat Formulir Pertama Anda?</h2>
        <p class="cta-subtitle">
          Bergabunglah dengan ribuan pengguna yang telah mempercayai KiraForm untuk kebutuhan formulir mereka.
        </p>
        <button style="margin: 0 auto;" class="btn-secondary-large" @click="showAuthModal('register')">
          <i class="fas fa-rocket"></i>
          Mulai Gratis Sekarang
        </button>
        <p class="cta-note">Tidak perlu kartu kredit • Gratis selamanya</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-icon">
            <i class="fas fa-cube"></i>
          </div>
          <div class="footer-logo">KiraForm</div>
          <p class="footer-tagline">Formulir indah dibuat sederhana</p>
        </div>
        <div class="footer-column">
          <h4>Produk</h4>
          <a href="#">Template</a>
          <a href="#">Integrasi</a>
          <a href="#">API</a>
        </div>
        <div class="footer-column">
          <h4>Dukungan</h4>
          <a href="#">Help Center</a>
          <a href="#">Panduan</a>
          <a href="#">FAQ</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2025 KiraForm. Semua hak dilindungi.</span>
        <div class="footer-version">v2.1.0</div>
      </div>
    </div>
  </footer>

  <!-- Auth Modal -->
  <div class="modal-overlay" id="authModal" :class="{ active: isAuthModalOpen }" v-show="isAuthModalOpen">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="modalTitle">
          {{ authMode === 'login' ? 'Masuk untuk melanjutkan' : 'Daftarkan akun anda' }}
        </h3>
        <button class="modal-close" @click="closeAuthModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <!-- Login Form -->
        <form id="loginForm" class="auth-form" v-show="authMode === 'login'" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="login.email" placeholder="nama@email.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="login.password" placeholder="Password Anda" required>
          </div>
          <button type="submit" class="btn-primary-full" :disabled="isLoading">
            <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-sign-in-alt'"></i>
            {{ isLoading ? 'Masuk...' : 'Masuk' }}
          </button>
          <p class="auth-switch">
            Belum punya akun?
            <a href="#" @click.prevent="switchAuthMode('register')">Daftar sekarang</a>
          </p>
        </form>

        <!-- Register Form -->
        <form id="registerForm" class="auth-form" v-show="authMode === 'register'" @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" v-model="regist.name" placeholder="Nama lengkap Anda" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="regist.email" placeholder="nama@email.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="regist.password" placeholder="xxxxx" required>
          </div>
          <div class="form-group">
            <label>Konfirmasi Password</label>
            <input type="password" v-model="regist.confirm_password" placeholder="Ketik ulang password" required>
          </div>
          <button type="submit" class="btn-primary-full" :disabled="isLoading">
            <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-user-plus'"></i>
            {{ isLoading ? 'Mendaftar...' : 'Daftar' }}
          </button>
          <p class="auth-switch">
            Sudah punya akun?
            <a href="#" @click.prevent="switchAuthMode('login')">Masuk di sini</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped src="../assets/css/common.css"></style>
<style scoped src="../assets/css/landing.css"></style>