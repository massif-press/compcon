import { notify as vueNotify, NotificationsOptions } from '@kyvg/vue3-notification'
import { i18n } from '@/i18n'

type CustomNotifyOptions = {
  title: string
  text: string
  color?: string
  icon?: string
  achievement?: boolean
  type?: 'info' | 'success' | 'error' | 'warning'
}

// queue to buffer early calls
const notifyQueue: NotificationsOptions[] = []
let isReady = false

function baseNotify(options: NotificationsOptions) {
  if (!isReady) {
    notifyQueue.push(options)
  } else {
    vueNotify(options)
  }
}

export function notify({
  title,
  text,
  color = 'info',
  icon = 'mdi-bell',
  achievement = false,
  type = 'info',
}: CustomNotifyOptions) {
  switch (type) {
    case 'success':
      icon = 'mdi-check-circle'
      color = 'success'
      break
    case 'error':
      icon = 'mdi-alert-circle'
      color = 'error'
      break
    case 'warning':
      icon = 'mdi-alert'
      color = 'warning'
      break
  }
  baseNotify({
    title,
    text,
    data: { color, icon, achievement },
  })
}

export function notifySuccess(text: string) {
  notify({ title: i18n.global.t('notify.common.success'), text, color: 'success', icon: 'mdi-check-circle' })
}

export function notifyError(text: string) {
  notify({ title: i18n.global.t('notify.common.error'), text, color: 'error', icon: 'mdi-alert-circle' })
}

export function flushNotifyQueue() {
  isReady = true
  notifyQueue.forEach(opts => vueNotify(opts))
  notifyQueue.length = 0
}
