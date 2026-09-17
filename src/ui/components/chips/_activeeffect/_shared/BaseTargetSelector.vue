<template>
  <v-col v-if="event.Targets && !event.IsSelfOnly">
    <div class="text-cc-overline text-disabled">
      <span>{{ `Target${event.AoE ? 's' : ''}` }}</span>
    </div>
    <v-select
      v-for="idx in event.Targets.length"
      :key="event.Targets?.[idx - 1]?.Combatant?.id || `empty-selector-${idx}`"
      :value="event.Targets?.[idx - 1]?.Combatant?.Label"
      :placeholder="$t('ui.fields.selectTarget')"
      density="compact"
      variant="outlined"
      return-object
      class="mb-1"
      item-title="Label"
      :item-value="c => c.id"
      :items="targets"
      flat
      :error="!event.Targets?.[idx - 1]?.Combatant?.id"
      hide-details
      tile
      @update:model-value="event.SetTarget($event, idx - 1)"
    >
      <template #prepend>
        <div v-if="idx === 1">
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                icon
                size="x-small"
                variant="text"
                flat
                tile
                class="mr-n2"
                v-bind="tooltipProps"
                @click="event.AoE = !event.AoE"
              >
                <v-icon
                  size="25"
                  :icon="event.AoeIcon"
                  class="mr-n2"
                />
              </v-btn>
            </template>

            <div v-if="event.AoE">
              {{ $t('ui.combat.areaOfEffect') }}
              <span v-if="typeof event.AoE === 'string'">
                <cc-slashes />
                {{ event.AoE }}
              </span>
              <div>
                <i class="text-caption text-disabled">{{ $t('ui.combat.clickToOverride') }}</i>
              </div>
            </div>

            <div
              v-else
              class="text-center"
            >
              {{ $t('ui.combat.singleTarget') }}
              <div>
                <i class="text-caption text-disabled">{{ $t('ui.combat.clickToOverride') }}</i>
              </div>
            </div>
          </v-tooltip>
        </div>
        <div
          v-else
          style="width: 24px"
        ></div>
      </template>
      <template #item="{ props: itemProps, item }">
        <v-divider
          v-if="dividerBefore.has(item.raw.id)"
          class="my-1"
        />
        <v-list-item
          v-bind="itemProps"
          :prepend-icon="targetIcon(item.raw)"
          :subtitle="sideLabel(item.raw.side)"
        />
      </template>
      <template #append>
        <v-btn
          icon
          size="x-small"
          variant="text"
          flat
          tile
          class="mx-n2"
        >
          <v-icon
            size="20"
            icon="mdi-close"
            @click="event.RemoveTarget(idx - 1)"
          />
        </v-btn>
      </template>
    </v-select>
    <v-btn
      v-if="event.AoE"
      :key="`targetSel_${event.AvailableTargets?.length}`"
      size="x-small"
      block
      flat
      tile
      :color="event.AvailableTargets?.length ? 'primary' : ''"
      class="ma-1"
      :disabled="!event.AvailableTargets?.length"
      @click="event.AddTarget()"
    >
      {{ $t('ui.combat.addTarget') }}
    </v-btn>
  </v-col>
</template>

<script setup lang="ts">
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    event: ActiveEffectEvent
  }>()

  const { t } = useI18n()

  const targets = computed<CombatantData[]>(() => props.event.AvailableTargets || [])

  const dividerBefore = computed(() => {
    const ids = new Set<string>()
    targets.value.forEach((c, idx) => {
      if (idx > 0 && c.side !== targets.value[idx - 1].side) ids.add(c.id)
    })
    return ids
  })

  function sideLabel(side: string): string {
    if (side === 'ally') return t('ui.combat.sideAlly')
    if (side === 'enemy') return t('ui.combat.sideEnemy')
    return t('ui.combat.sideNeutral')
  }

  function targetIcon(combatant: CombatantData): string {
    return combatant.actor?.Icon || (combatant.type === 'pilot' ? 'cc:pilot' : 'cc:encounter')
  }
</script>
