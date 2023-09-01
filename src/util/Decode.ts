function decrypt(encryptedText) {
  encryptedText = decodeURIComponent(encryptedText);
  let decrypted = '';
  for (let i = 0; i < encryptedText.length; i++) {
    const charCode =
      encryptedText.charCodeAt(i) ^
      import.meta.env.VITE_ACHIEVEMENT_KEY.charCodeAt(
        i % import.meta.env.VITE_ACHIEVEMENT_KEY.length
      );
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

function encrypt(text) {
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const charCode =
      text.charCodeAt(i) ^
      import.meta.env.VITE_ACHIEVEMENT_KEY.charCodeAt(
        i % import.meta.env.VITE_ACHIEVEMENT_KEY.length
      );
    encrypted += String.fromCharCode(charCode);
  }
  return encodeURIComponent(encrypted);
}

export { decrypt, encrypt };
