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
export { decrypt };
