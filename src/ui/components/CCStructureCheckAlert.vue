<template>
  <v-card v-if="pending"
    :class="kind === 'stress' ? 'diag-stress' : 'diag-structure'"
    class="my-1 pa-2">
    <v-alert class="py-1 px-2"
      tile
      color="panel">
      <v-row no-gutters
        align="center">
        <v-col cols="auto"
          class="mr-2">
          <v-avatar color="background"
            size="30">
            <v-icon :icon="kind === 'stress' ? 'cc:reactor' : 'cc:structure'"
              :color="kind" />
          </v-avatar>
        </v-col>
        <v-col class="text-cc-overline">{{ $t('active.structureCheck.pending', { type: typeLabel })
          }}</v-col>
        <v-col cols="auto">
          <v-btn color="primary"
            flat
            size="small"
            prepend-icon="mdi-dice-d6"
            :text="$t('common.roll_verb')"
            @click="dialog = true" />
          &nbsp;
          <cc-button size="x-small"
            icon="mdi-close"
            variant="text"
            @click="dismiss" />
        </v-col>
      </v-row>
    </v-alert>
    <cc-structure-check-modal v-model="dialog"
      :cc="cc"
      :pending="pending" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CombatController } from '@/classes/components/combat/CombatController'
import type { CheckKind } from '@/classes/components/combat/StructureCheck'

const props = defineProps<{ cc: CombatController; kind: CheckKind }>()

const { t } = useI18n()
const dialog = ref(false)

const pending = computed(() => props.cc.PendingChecks.find(p => p.kind === props.kind))
const typeLabel = computed(() =>
  props.kind === 'stress' ? t('active.structureCheck.stress') : t('active.structureCheck.structure')
)

const current = computed(() =>
  props.kind === 'stress' ? props.cc.CurrentStress : props.cc.CurrentStructure
)

watch(current, (n, o) => {
  if (n < o) props.cc.AddPendingCheck(props.kind)
}, { flush: 'sync' })

function dismiss() {
  if (pending.value) props.cc.RemovePendingCheck(pending.value.id)
}
</script>

<style scoped>
.diag-stress {
  background: repeating-linear-gradient(-45deg,
      rgb(var(--v-theme-stress)),
      rgb(var(--v-theme-stress)) 10px,
      rgb(var(--v-theme-background)) 10px,
      rgb(var(--v-theme-background)) 20px);
}

.diag-structure {
  background: repeating-linear-gradient(-45deg,
      #FBC02D,
      #FBC02D 10px,
      rgb(var(--v-theme-background)) 10px,
      rgb(var(--v-theme-background)) 20px);

}
</style>
