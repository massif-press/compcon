<template>
  <slot />

  <v-toolbar v-if="item && item.IsDeprecated"
    color="error"
    class="text-center heading"
    dense>
    {{ $t('ui.card.deprecated') }}
  </v-toolbar>

  <cc-heading v-if="item.Mod"
    size="small"
    line>
    <cc-chip>
      <v-icon start
        icon="cc:weaponmod" />
      {{ $t('ui.card.modifies') }} {{ item.ModTarget?.Name || 'unknown' }}
    </cc-chip>
  </cc-heading>

  <v-row v-if="item.Kit"
    dense
    align="center"
    class="text-cc-overline mt-2">
    <v-col><v-divider /></v-col>
    <v-col cols="auto">
      <v-icon size="small"
        icon="mdi-package-variant" />
      {{ item.Kit }} {{ $t('ui.card.kit') }}
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>

  <cc-icon-divider v-if="item.LicenseString"
    :icon="item.Icon"
    dense />

  <div class="mb-2">
    <slot name="statblock" />
  </div>

  <div v-if="item.Trigger"
    class="mb-2">
    <div class="text-cc-overline text-disabled">
      {{ $t('ui.card.triggerUpper') }}
    </div>
    <p v-if="tier"
      v-html-safe="item.TriggerByTier(tier)"
      class="text-text" />
    <p v-else
      v-html-safe="item.Trigger"
      class="text-text" />
  </div>

  <div v-if="item.Effect"
    class="mb-2">
    <p v-if="tier"
      v-html-safe="item.EffectByTier(tier)"
      class="text-text" />
    <p v-else
      v-html-safe="item.Effect"
      class="text-text" />
  </div>

  <div v-if="item.Actions && item.Actions.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">
      <v-icon size="small"
        icon="cc:activate" />
      {{ $t('ui.card.equipmentActions') }}
    </div>
    <cc-action v-for="(a, index) in item.Actions"
      :key="`action-${index}`"
      :action="a"
      :panel="!collapseActions || $vuetify.display.lgAndUp"
      :hover="dense && collapseActions"
      :tier="tier"
      class="ma-2" />
  </div>

  <div v-if="item && item.Ammo && item.Ammo.length">
    <div v-for="(a, index) in item.Ammo"
      :key="`ammo-${index}`">
      <b>{{ a.name }}</b>
      :
      <span v-html-safe="a.detail" />
    </div>
  </div>

  <div v-if="item.Deployables && item.Deployables.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">
      <v-icon size="small"
        icon="cc:drone" />
      {{ $t('ui.card.equipmentDeployables') }}
    </div>
    <v-row dense
      justify="center">
      <v-col v-for="(d, index) in item.Deployables"
        :key="`deployable-${index}`"
        cols="auto">
        <cc-deployable-info :deployable="d"
          :panel="!collapseActions || $vuetify.display.lgAndUp"
          :hover="dense && collapseActions"
          :tier="tier"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.card.integratedEquipment') }}</div>
    <cc-integrated-info v-for="(x, index) in item.IntegratedEquipment"
      :key="`integrated-${index}`"
      :item="x"
      :panel="!collapseActions || $vuetify.display.mdAndUp" />
  </div>

  <slot name="profile" />

  <slot name="charts" />

  <div v-if="!footer && showFooter && item.Tags?.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.card.equipmentTags') }}</div>
    <cc-tags :tags="item.Tags"
      :extended="!smallTags"
      :tier="tier" />
  </div>

  <div v-if="item.Description?.length"
    class="my-4">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.card.compendiumData') }}</div>
    <div v-html-safe="item.Description"
      class="flavor-text" />
  </div>

  <div v-if="notes">
    <v-textarea v-model="item.Note"
      variant="outlined"
      auto-grow
      rows="2"
      filled
      density="compact"
      hide-details
      prepend-icon="mdi-note"
      label="Equipment Notes"
      class="mt-2" />
  </div>

  <v-footer v-if="footer && showFooter"
    color="transparent"
    class="mx-n4 py-0 mt-2">
    <v-row>
      <v-col v-if="!hideTags"
        cols="auto">
        <cc-tags :tags="item.Tags"
          :extended="!smallTags"
          :tier="tier" />
      </v-col>
      <v-col v-if="!hideBonuses"
        cols="auto"
        class="ml-auto">
        <div>
          <cc-bonus :bonuses="item.Bonuses"
            chip
            :tier="tier" />
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: Record<string, any>
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  hideTags?: boolean
  hideBonuses?: boolean
  charts?: boolean
  footer?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const showFooter = computed(() => props.item.Tags.length > 0 || props.item.Bonuses.length > 0)
</script>
