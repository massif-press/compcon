<template>
  <v-dialog
    v-model="dialog"
    :aria-label="title || undefined"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel">
    <v-card flat tile>
      <v-toolbar dark :color="options.color" density="compact" flat>
        <v-toolbar-title class="text-white">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="accent darken-1" @click.native="agree">Yes</v-btn>
        <v-btn color="grey" @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'GlobalConfirm' })

const dialog = ref(false)
const resolve = ref(null as any)
const reject = ref(null as any)
const message = ref('')
const title = ref('')
const options = ref({
      color: 'primary',
      width: 500,
      zIndex: 9999,
    })

function open(title: string,
      message: string,
      options: {
        color?: string;
        width?: number;
        zIndex?: number;
      } = {}) {
      dialog.value = true;
      title.value = title;
      message.value = message;
      options.value = Object.assign({}, options.value, options);
      return new Promise((resolve, reject) => {
        resolve.value = resolve;
        reject.value = reject;
      });
    }
function agree() {
      resolve.value(true);
      dialog.value = false;
    }
function cancel() {
      resolve.value(false);
      dialog.value = false;
    }
</script>
