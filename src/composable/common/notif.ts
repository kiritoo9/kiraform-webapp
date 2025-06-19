export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const colors = {
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: '#10b981',
      text: '#ffffff',
      icon: '#ffffff'
    },
    error: {
      bg: 'linear-gradient(135deg, #800000 0%, #600000 100%)',
      border: '#800000',
      text: '#ffffff',
      icon: '#ffffff'
    },
    info: {
      bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      border: '#3b82f6',
      text: '#ffffff',
      icon: '#ffffff'
    }
  };

  const currentColors = colors[type];

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      </div>
      <div class="notification-text">
        <div class="notification-title">${type === 'success' ? 'Berhasil' : type === 'error' ? 'Error' : 'Info'}</div>
        <div class="notification-message">${message}</div>
      </div>
    </div>
  `;

  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${currentColors.bg};
        border: 2px solid ${currentColors.border};
        color: ${currentColors.text};
        border-radius: var(--border-radius-md, 8px);
        box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
        padding: 16px 20px;
        min-width: 300px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
  `;

  const content = notification.querySelector('.notification-content') as HTMLElement;
  if (content) {
    content.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 12px;
            position: relative;
            z-index: 2;
        `;
  }

  const icon = notification.querySelector('.notification-icon') as HTMLElement;
  if (icon) {
    icon.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;

    const iconElement = icon.querySelector('i') as HTMLElement;
    if (iconElement) {
      iconElement.style.cssText = `
                font-size: 18px;
                color: ${currentColors.icon};
            `;
    }
  }

  const textContainer = notification.querySelector('.notification-text') as HTMLElement;
  if (textContainer) {
    textContainer.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;
  }

  const title = notification.querySelector('.notification-title') as HTMLElement;
  if (title) {
    title.style.cssText = `
            font-size: 16px;
            font-weight: 600;
            color: ${currentColors.text};
            margin: 0;
            line-height: 1.2;
        `;
  }

  const messageElement = notification.querySelector('.notification-message') as HTMLElement;
  if (messageElement) {
    messageElement.style.cssText = `
            font-size: 14px;
            color: ${currentColors.text};
            opacity: 0.9;
            margin: 0;
            line-height: 1.4;
        `;
  }
  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: shimmer 2s infinite;
        z-index: 1;
    `;
  notification.appendChild(shimmer);

  const style = document.createElement('style');
  style.textContent = `
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};