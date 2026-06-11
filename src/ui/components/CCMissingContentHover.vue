<template>
  <v-tooltip v-if="missingContent && simple" location="top" max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props" :color="color" size="small">mdi-alert-rhombus</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold" style="letter-spacing: 3px">{{ $t('ui.missing.missingContent') }}</div>
      <v-divider />
      <i class="text-caption">{{ $t('ui.missing.hoverHelp', { type: itemType }) }}</i>
    </div>
  </v-tooltip>
  <v-menu v-else-if="missingContent" open-on-hover max-width="450px">
    <template #activator="{ props }">
      <v-icon v-bind="props" color="accent" icon="mdi-alert-rhombus" />
    </template>
    <v-card flat tile border>
      <v-toolbar density="compact" color="error" flat tile height="42">
        <div class="px-2 heading h4">{{ $t('ui.missing.detected') }}</div>
      </v-toolbar>
      <div v-if="controller && controller.NonfunctionalBrews.length" class="pa-1">
        <CCMissingContentList :controller="controller" :width="width" />
      </div>
      <v-card-text v-else class="text-caption">
        <i18n-t v-if="itemType.toLowerCase === 'eidolon'" keypath="ui.missing.eidolonHelp" tag="span" scope="global">
          <template #pack><strong>{{ $t('ui.missing.wallflowerPack') }}</strong></template>
        </i18n-t>
        <i18n-t v-else keypath="ui.missing.npcHelp" tag="span" scope="global">
          <template #pack><strong>{{ $t('ui.missing.lancerCoreBook') }}</strong></template>
        </i18n-t>
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
