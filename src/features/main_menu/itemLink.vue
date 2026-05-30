<template>
  <v-container class="mt-4 px-12">
    <v-progress-linear v-if="!compendiumLoaded" indeterminate />

    <v-card v-else-if="item" tile class="mb-12">
      <v-toolbar density="compact" :color="(item as any).Color || 'primary'">
        <v-toolbar-title class="heading text-uppercase">
          <v-icon v-if="(item as any).Icon" class="mt-n1" :icon="(item as any).Icon" />
          {{ (item as any).Source }} {{ (item as any).Name }}
        </v-toolbar-title>
        <v-spacer />
        <div class="heading px-4">
          {{ unCamelCase((item as any).ItemType) }}
        </div>
      </v-toolbar>
      <v-card-text>
        <cc-item-card :item="item" />
      </v-card-text>
    </v-card>

    <v-alert
      v-else
      prominent
      density="comfortable"
      icon="mdi-alert"
      border="start"
      border-color="error">
      <template #title>
        No item with ID:
        <code>{{ id }}</code>
        found in Compendium
      </template>
      <div>
        If this item is part of a Lancer Content Pack, please ensure that the pack is installed and
        enabled.
        <div class="text-right">
          <v-chip size="small">
            Requested LCP:
            <code>{{ pack }}</code>
          </v-chip>
        </div>
      </div>
    </v-alert>
  </v-container>
  <v-footer app density="compact" color="primary">
    <cc-button prepend-icon="mdi-arrow-left" size="small" class="mr-2" @click="$router.go(-1)">
      Back
    </cc-button>
    <cc-button prepend-icon="mdi-home" size="small" to="/">Main Menu</cc-button>
    <v-spacer />
    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-icon v-bind="props" size="small" icon="mdi-share-variant" @click="copyToClipboard" />
      </template>
      <span>Copy link</span>
    </v-tooltip>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { unCamelCase } from '@/classes/utility/accent_fold';
import { CompendiumStore } from '@/stores';
import logger from '@/user/logger';
const router = useRouter()

const props = defineProps<{
  pack: string
  id: string
  type: string
}>()

const item = ref(null)

const compendiumLoaded = computed(() => {
      return CompendiumStore().loaded;
    })

function unCamelCase(str) {
      return unCamelCase(str);
    }
function copyToClipboard() {
      navigator.clipboard.writeText(window.location.href);
    }

onMounted(() => {
document.title = (item.value as any)?.Name || 'Item Link';
})
</script>
