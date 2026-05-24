import { defineStore } from 'pinia'

export type CloudNotification = {
  text: string
  type: string
}

export interface INotificationVariant {
  color: string
  icon: string
  prefix?: string
  timeout?: number
}

export interface INotification {
  id: string
  variant: string
  text: string
  onClick?: () => void
}

export const NotificationStore = defineStore('notifications', {
  state: () => ({
    CloudNotifications: [] as CloudNotification[],
  }),
  actions: {
    addCloudNotification(text: string, type = 'success'): void {
      this.CloudNotifications.push({ text, type })
    },
    clearCloudNotifications(): void {
      this.CloudNotifications = []
    },
    removeCloudNotification(idx: number): void {
      this.CloudNotifications.splice(idx, 1)
    },
  },
})
