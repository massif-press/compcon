<template>
  <slot />

  <cc-icon-divider v-if="item.LicenseString"
    :icon="item.Icon" />

  <slot name="statblock" />

  <div v-if="item.Effect">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('common.effect') }}</div>
    <p v-html-safe="item.Effect" />
  </div>

  <div v-if="item.Actions && item.Actions.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('common.actions') }}</div>
    <v-row no-gutters
      justify="center">
      <v-col v-for="(a, index) in item.Actions"
        :key="`action-${index}`"
        cols="auto">
        <cc-action :action="a"
          :panel="$vuetify.display.lgAndUp"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.Deployables && item.Deployables.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.card.deployables') }}</div>
    <v-row no-gutters
      justify="center">
      <v-col v-for="(d, index) in item.Deployables"
        :key="`deployable-${index}`"
        cols="auto">
        <cc-deployable-info :deployable="d"
          :panel="$vuetify.display.lgAndUp"
          :name-override="item.Name"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.card.integrations') }}</div>
    <v-row no-gutters
      justify="center">
      <v-col v-for="(x, index) in item.IntegratedEquipment"
        :key="`integrated-${index}`"
        cols="auto">
        <cc-integrated-info :item="x"
          :panel="$vuetify.display.lgAndUp" />
      </v-col>
    </v-row>
  </div>

  <slot name="profile" />

  <div v-if="item.Tags && item.Tags.filter(x => !x.IsHidden).length && !hideTags"
    class="mt-2">
    <div v-show="!dense"
      class="text-cc-overline text-disabled">//{{ $t('ui.fields.tags') }}</div>
    <cc-tags :tags="item.Tags"
      :extended="!smallTags" />
  </div>

  <slot name="charts" />

  <div v-if="item.Description"
    class="my-2">
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
      :label="$t('ui.fields.equipmentNotes')"
      class="mt-2" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: object
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  hideTags?: boolean
  charts?: boolean
}>()
</script>
