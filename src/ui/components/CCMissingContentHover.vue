<template>
  <v-tooltip v-if="missingContent && simple" location="top" max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props" :color="color" size="small">mdi-alert-rhombus</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold" style="letter-spacing: 3px">MISSING CONTENT</div>
      <v-divider />
      <i class="text-caption">
        This {{ itemType }} is missing necessary LCP data. COMP/CON will not be able to load this
        {{ itemType }} until the missing content is added.
      </i>
    </div>
  </v-tooltip>
  <v-menu v-else-if="missingContent" open-on-hover max-width="450px">
    <template #activator="{ props }">
      <v-icon v-bind="props" color="accent" icon="mdi-alert-rhombus" />
    </template>
    <v-card flat tile border>
      <v-toolbar density="compact" color="error" flat tile height="42">
        <div class="px-2 heading h4">Missing Content Detected</div>
      </v-toolbar>
      <div v-if="controller && controller.NonfunctionalBrews.length" class="pa-1">
        <CCMissingContentList :controller="controller" :width="width" />
      </div>
      <v-card-text v-else class="text-caption">
        <span v-if="itemType.toLowerCase === 'eidolon'">
          Eidolons require the installation of the Content Pack provided with
          <strong>No Room for a Wallflower Act 1</strong>
        </span>
        <span v-else>
          COMP/CON is unable to load NPC data without the installation of the NPC Content Pack
          provided with the paid (GM) version of the
          <strong>Lancer Core Book</strong>
        </span>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CCMissingContentList from './CCMissingContentList.vue'

defineOptions({ name: 'cc-brew-info' })

const props = withDefaults(defineProps<{
  item?: object
  simple?: boolean
  width?: string
  color?: string
}>(), {
  width: '100%',
  color: ''
})

const controller = computed(() => {
      return props.item && props.item.BrewController;
    })
const missingContent = computed(() => {
      return controller.value && controller.value.IsUnableToLoad;
    })
const itemType = computed(() => {
      return (props.item as any).ItemType.toLowerCase() || 'item';
    })
</script>
