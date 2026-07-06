export const isAppInventor = () => typeof window.AppInventor !== 'undefined';

const sendToAppInventor = (action, payload = {}) => {
  if (isAppInventor()) {
    window.AppInventor.setWebViewString(JSON.stringify({ action, ...payload }));
  } else {
    console.log(`[AppInventor Bridge Mock] Action: ${action}`, payload);
  }
};

export const bridge = {
  vibrate:      (ms = 300)   => sendToAppInventor('VIBRATE',        { duration: ms }),
  vibrateBadge: ()           => sendToAppInventor('VIBRATE_BADGE',  {}),
  speak:        (text)       => sendToAppInventor('SPEAK',          { text }),
  playSound:    (sound)      => sendToAppInventor('PLAY_SOUND',     { sound }),
  saveTinyDB:   (key, val)   => sendToAppInventor('SAVE_TINYDB',   { key, value: val }),
  notify:       (message)    => sendToAppInventor('NOTIFY',         { message }),
  takePhoto:    ()           => sendToAppInventor('TAKE_PHOTO',     {}),
};

// Global callback for App Inventor to send photo URL back after upload
if (typeof window !== 'undefined') {
  window.onPhotoTaken = (relativePath) => {
    // relativePath is e.g. "/uploads/workout_123.jpg" from the server response
    // Build full URL using the current origin (works both in dev and in the companion WebView)
    const fullUrl = window.location.origin + relativePath;
    const event = new CustomEvent('appInventorPhoto', { detail: { path: fullUrl } });
    window.dispatchEvent(event);
  };
}

export default bridge;
