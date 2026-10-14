<template>
  <cc-dialog
    :title="`${action.Name}${exclusive}`"
    :icon="action.Icon"
    :color="action.Color"
  >
    <template #activator="{ open }">
      <component
        :is="component"
        :title="action.Name"
        :icon="action.Icon"
        :title-color="action.Color"
        clickable
        @click="open"
      >
        <p
          v-if="clickable"
          v-html-safe="action.Terse"
        />
        <div v-else>
          <div v-if="action.Trigger">
            <div class="text-cc-overline text-disabled">
              {{ $t('common.trigger') }}
            </div>
            <p v-html-safe="action.Trigger" />
            <div class="text-cc-overline text-disabled mt-2">
              {{ $t('common.action') }}
            </div>
          </div>
          <p v-html-safe="action.Detail" />
          <div v-if="subActions.length">
            <div class="text-overline text-disabled">{{ $t('common.options') }}</div>
            <v-row
              no-gutters
              justify="center"
            >
              <v-col
                v-for="(a, index) in subActions"
                :key="`sub-${index}`"
                cols="auto"
              >
                <cc-action
                  :action="a"
                  :panel="false"
                  class="ma-2"
                />
              </v-col>
            </v-row>
          </div>
        </div>
      </component>
    </template>
    <p v-html-safe="action.Detail" />
    <div v-if="subActions.length">
      <div class="text-overline text-disabled">{{ $t('common.options') }}</div>
      <v-row
        no-gutters
        justify="center"
      >
        <v-col
          v-for="(a, index) in subActions"
          :key="`dialog-sub-${index}`"
          cols="auto"
        >
          <cc-action
            :action="a"
            :panel="false"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>
  </cc-dialog>
</template>

<script setup lang="ts">
  import type { Action } from '@/classes/Action'
  import { ActivationType } from '@/classes/enums'
  import { CompendiumStore } from '@/stores'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const subActivations: Record<string, ActivationType> = {
    act_jockey: ActivationType.Jockey,
    act_invade: ActivationType.Invade,
  }

  const props = withDefaults(
    defineProps<{
      action: Action
      downtime?: boolean
      clickable?: boolean
    }>(),
    {
      clickable: false,
    }
  )

  const component = computed(() => {
    return props.clickable ? 'cc-clickable-panel' : 'cc-panel'
  })
  const subActions = computed(() => {
    if (props.action.SubActions?.length) return props.action.SubActions
    const activation = subActivations[props.action.ID]
    return activation ? CompendiumStore().Actions.filter(a => a.Activation === activation) : []
  })
  const exclusive = computed(() => {
    if (props.action.IsPilotAction && !props.action.IsMechAction)
      return ` (${t('pm.statblockDialog.pilotOnly')})`
    return ''
  })
</script>
