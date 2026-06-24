<template>
  <v-container class="mt-4 px-12">
    <v-progress-linear v-if="!compendiumLoaded"
      indeterminate />

    <v-card v-else-if="item"
      tile
      class="mb-12">
      <v-toolbar v-if="(item as any).ItemType"
        density="compact"
        :color="(item as any).Color || 'primary'">
        <v-toolbar-title class="heading text-uppercase">
          <v-icon v-if="(item as any).Icon"
            class="mt-n1"
            :icon="(item as any).Icon" />
          {{ (item as any).Source }} {{ (item as any).Name }}
        </v-toolbar-title>
        <v-spacer />
        <div class="heading px-4">
          {{ unCamelCase((item as any).ItemType) }}
        </div>
      </v-toolbar>
      <v-toolbar v-else
        density="compact"
        color="primary">
        <v-toolbar-title class="heading text-uppercase">
          {{ item.name }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <cc-item-card v-if="(item as any).ItemType"
          :item="item" />
        <div v-else
          v-html-safe="item.description" />
      </v-card-text>
    </v-card>

    <v-alert v-else
      prominent
      density="comfortable"
      icon="mdi-alert"
      border="start"
      border-color="error">
      <template #title>
        {{ $t("mainMenu.itemLink.noItemWithIdLabel") }}:
        <code>{{ id }}</code>
        {{ $t("mainMenu.itemLink.foundInCompendium") }}
      </template>
      <div>
        {{ $t("mainMenu.itemLink.lcpHint") }}
        <div class="text-right">
          <v-chip size="small">
            {{ $t("mainMenu.itemLink.requestedLcp") }}:
            <code>{{ pack }}</code>
          </v-chip>
        </div>
      </div>
    </v-alert>
  </v-container>
  <v-footer app
    density="compact"
    color="primary">
    <cc-button prepend-icon="mdi-arrow-left"
      size="small"
      class="mr-2"
      @click="$router.go(-1)">
      {{ $t("common.back") }}
    </cc-button>
    <cc-button prepend-icon="mdi-home"
      size="small"
      to="/">{{ $t("common.mainMenu") }}</cc-button>
    <v-spacer />
    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          size="small"
          icon="mdi-share-variant"
          @click="copyToClipboard" />
      </template>
      <span>{{ $t("common.copyLink") }}</span>
    </v-tooltip>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { unCamelCase as ucc } from '@/classes/utility/accent_fold';
import { CompendiumStore } from '@/stores';
import { glossary } from '@massif/lancer-data';

const props = defineProps<{
  pack: string
  id: string
  type: string
}>()

const item = ref()

const compendiumLoaded = computed(() => {
  return CompendiumStore().loaded;
})

function unCamelCase(str) {
  return ucc(str);
}
function copyToClipboard() {
  navigator.clipboard.writeText(window.location.href);
}

onMounted(() => {
  if (props.type === 'glossary') {
    item.value = glossary.find((x) => x.name.toLowerCase() === props.id.replace('glossary_', '').toLowerCase());
    console.log('Found glossary item', item.value);
  } else
    item.value = CompendiumStore().referenceFromID(props.type, props.id);
  document.title = (item.value as any)?.Name || 'Item Link';
})
</script>
