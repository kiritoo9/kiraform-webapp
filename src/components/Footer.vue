<template>
  <footer class="footer">
    <div class="footer-bottom">
      <span>&copy; 2025 KiraForm.</span>
      <div class="footer-version">v2.1.0</div>
    </div>
  </footer>
</template>

<style scoped src="../assets/css/common.css"></style>
<style scoped>
.footer {
  background: #ffffff !important;
  border-top: 2px solid #e5e7eb !important;
  padding: 10px 24px !important;
  text-align: center !important;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05) !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 50 !important;
}

.footer-bottom {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 16px !important;
  font-size: 12px !important;
  color: #9ca3af !important;
  margin-top: 0px !important;
  padding-top: 10px !important;
}

.footer-version {
  background: #f9fafb !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  border: 1px solid #d1d5db !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  color: #374151 !important;
}

@media (max-width: 768px) {
  .footer {
    padding: 20px 16px !important;
  }
}
</style>