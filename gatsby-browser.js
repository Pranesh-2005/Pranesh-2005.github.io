let deferredPrompt;

export const onClientEntry = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('👍 beforeinstallprompt event fired');

    if (!window.installApp) {
      window.installApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        removeToast();
      };
    }

    const toast = document.createElement('div');
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '90vw',
      width: 'fit-content',
      backgroundColor: '#0a192f',
      color: '#8892b0',
      padding: '14px 18px',
      borderRadius: '6px',
      fontFamily:
        'Calibre, San Francisco, SF Pro Text, -apple-system, system-ui, BlinkMacSystemFont, Roboto, Helvetica Neue, Segoe UI, Arial, sans-serif',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      textAlign: 'center',
    });

    const message = document.createElement('span');
    message.textContent = 'Install this app for a better experience?';
    toast.appendChild(message);

    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install';
    Object.assign(installBtn.style, {
      backgroundColor: '#112240',
      color: '#8892b0',
      border: '1px solid #8892b0',
      borderRadius: '4px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontFamily:
        'Calibre, San Francisco, SF Pro Text, -apple-system, system-ui, BlinkMacSystemFont, Roboto, Helvetica Neue, Segoe UI, Arial, sans-serif',
      fontSize: '14px',
      marginTop: '6px',
    });
    installBtn.onclick = async () => {
      await window.installApp();
    };

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      marginLeft: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      lineHeight: '1',
    });
    closeBtn.onclick = () => removeToast();

    toast.appendChild(installBtn);
    toast.appendChild(closeBtn);
    document.body.appendChild(toast);

    function removeToast() {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }

    // Auto-remove after 7 seconds if ignored
    setTimeout(removeToast, 6000);
  });
};
