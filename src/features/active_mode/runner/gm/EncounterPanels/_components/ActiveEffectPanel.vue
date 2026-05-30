<template>
  <v-row dense>
    <v-col cols="auto">
      <div class="text-cc-overline text-disabled mt-2">ACTIVE EFFECTS</div>
    </v-col>

    <v-col cols="auto">
      <v-btn-group flat
        tile
        density="compact"
        style="max-height: 24px !important">
        <v-tooltip location="top"
          :text="`${hideUsed ? 'Hiding' : 'Showing'} used/expired effects`">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              size="small"
              icon
              @click="hideUsed = !hideUsed">
              <v-icon :color="hideUsed ? 'primary' : ''"
                size="18"
                icon="mdi-eye-off" />
            </v-btn>
          </template>
        </v-tooltip>
      </v-btn-group>
    </v-col>
  </v-row>

  <v-row no-gutters
    class="mt-2">
    <v-col v-for="(ae, idx) in sortedActiveEffects"
      :key="`ae_${idx}_${ae.Name}`"
      cols="auto">
      <cc-active-effect-chip :active-effect="ae"
        :owner="item"
        :encounter="encounter" />
    </v-col>
    <v-col v-if="hidden > 0"
      cols="auto">
      <v-chip size="x-small"
        class="pa-2"
        flat
        style="opacity: 0.75">
        +{{ hidden }} Hidden Effects
      </v-chip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CCActiveEffectChip from '@/ui/components/chips/CCActiveEffectChip.vue'

const props = defineProps<{
  item: object
  encounter: object
}>()

const sortMode = ref('')
const sortDir = ref('asc')
const hideUsed = ref(true)
const showTypes = ref(['passive', 'damage', 'status', 'save', 'resistance', 'other', 'special'])

const sortedActiveEffects = computed(() => {
      let out = props.item.CombatController.SortedActiveEffects(sortMode.value, sortDir.value);
      if (hideUsed.value) {
        out = out.filter((ae) => !ae.Applied && !ae.Origin?.Used && !ae.Origin?.Destroyed);
      }

      return out;
    })
const hidden = computed(() => {
      return props.item.CombatController.ActiveEffects.length - sortedActiveEffects.value.length;
    })

function sortBy(criteria) {
      if (sortMode.value === criteria) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortDir.value = 'asc';
      }
      sortMode.value = criteria || '';
    }
</script>

<style scoped></style>
