import { notify as vueNotify, NotificationsOptions } from '@kyvg/vue3-notification';

type CustomNotifyOptions = {
  title: string;
  text: string;
  color?: string;
  icon?: string;
  achievement?: boolean;
};

// queue to buffer early calls
const notifyQueue: NotificationsOptions[] = [];
let isReady = false;

function baseNotify(options: NotificationsOptions) {
  if (!isReady) {
    notifyQueue.push(options);
  } else {
    vueNotify(options);
  }
}

export function notify({
  title,
  text,
  color = 'info',
  icon = 'mdi-bell',
  achievement = false,
}: CustomNotifyOptions) {
  baseNotify({
    title,
    text,
    data: { color, icon, achievement },
  });
}

export function notifySuccess(text: string) {
  notify({ title: 'Success', text, color: 'success', icon: 'mdi-check-circle' });
}

export function notifyError(text: string) {
  notify({ title: 'Error', text, color: 'error', icon: 'mdi-alert-circle' });
}

export function flushNotifyQueue() {
  isReady = true;
  notifyQueue.forEach((opts) => vueNotify(opts));
  notifyQueue.length = 0;
}
