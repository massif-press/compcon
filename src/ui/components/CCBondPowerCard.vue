<template>
  <cc-panel
    v-if="shown"
    variant="outlined"
    :disabled="disabled"
  >
    <template #toolbar>
      <cc-toolbar
        :title="shown.name"
        hide-close
        minor
        :color="headerColor"
        :extended="shown.veteran || shown.master"
      >
        <template #toolbar-items>
          <span
            v-if="shown.frequency"
            class="text-caption mr-1"
          >
            {{ shown.frequency }}
          </span>
        </template>
        <template #extension>
          <div
            class="text-cc-overline pl-2 text-disabled mt-n1"
            style="letter-spacing: 3px !important"
          >
            <i v-if="shown.veteran">{{ $t('ui.bond.veteranPower') }}</i>
            <i v-if="shown.master">{{ $t('ui.bond.masterPower') }}</i>
          </div>
        </template>
      </cc-toolbar>
    </template>

    <div
      v-if="shown.prerequisite"
      class="caption pa-1 pt-0 pb-2 text--disabled text-text"
    >
      <i v-text="shown.prerequisite" />
    </div>
    <v-card-text
      v-html-safe="shown.description"
      class="pa-1 pt-0 text-text"
    />
  </cc-panel>
</template>

<script setup lang="ts">
  import { computed, PropType } from 'vue'
  import { BondPower, localizePower } from '@/classes/pilot/components/bond/Bond'

  const props = defineProps({
    power: { type: Object as PropType<BondPower>, required: true },
    flexHeight: { type: Boolean },
    disabled: { type: Boolean },
  })

  const shown = computed(() => props.power && localizePower(props.power))

  const headerColor = computed(() => {
    if (props.power.veteran) return 'indigo-lighten-1'
    if (props.power.master) return 'deep-purple-darken-3'
    return 'primary'
  })
</script>
