/* eslint-disable no-console */

import { register } from 'register-service-worker'
const forceVersBump = 2

if (navigator && navigator.serviceWorker) {
  console.log('in there')
  navigator.serviceWorker
    .getRegistration()
    .then(serviceWorker => {
      if (serviceWorker) {
        console.log(caches)
        caches.keys().then(cacheNames => {
          for (let name of cacheNames) {
            console.log('minor test')
            console.log('clearing cache:', name)
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

if (true || process.env.VUE_APP_NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(process.env.BASE_URL, forceVersBump)
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
