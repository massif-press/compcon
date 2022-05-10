/* eslint-disable no-console */

import { register } from 'register-service-worker'

// find and unregister old serviceworker
const registrations = await navigator.serviceWorker.getRegistrations()
const matchingRegistrations = registrations.filter(registration => {
  return registration.active.scriptURL.includes('sw.js')
})

for (const registration of matchingRegistrations) {
  await registration.unregister()
  console.log('Unregistered old sw:', registration)
}

if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker
    .getRegistration()
    .then(serviceWorker => {
      if (serviceWorker) {
        caches.keys().then(cacheNames => {
          for (let name of cacheNames) {
            if (name !== 'images') caches.delete(name)
          }
        })
        serviceWorker.unregister()
      }
    })
    .catch(error => {
      console.error('There was an error: ', error)
    })
}

if (process.env.VUE_APP_NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.info('Service worker has been registered.')
    },
    cached() {
      console.info('Content has been cached for offline use.')
    },
    updatefound() {
      console.info('New content is downloading.')
    },
    updated() {
      console.info('New content is available; please refresh.')
    },
    offline() {
      console.info('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
