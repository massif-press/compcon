import { Capacitor } from '@capacitor/core'

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production' && Capacitor.platform === 'web') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}