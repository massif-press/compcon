<template>
  <slot />

  <cc-icon-divider v-if="item.LicenseString" :icon="item.Icon" />

  <slot name="statblock" />

  <div v-if="item.Effect">
    <div v-show="!dense" class="text-cc-overline text-disabled">//EFFECT</div>
    <p v-html-safe="item.Effect" />
  </div>

  <div v-if="item.Actions && item.Actions.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//ACTIONS</div>
    <v-row no-gutters justify="center">
      <v-col v-for="a in item.Actions" cols="auto">
        <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.Deployables && item.Deployables.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//DEPLOYABLES</div>
    <v-row no-gutters justify="center">
      <v-col v-for="d in item.Deployables" cols="auto">
        <cc-deployable-info
          :deployable="d"
          :panel="$vuetify.display.lgAndUp"
          :name-override="item.Name"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//INTEGRATIONS</div>
    <v-row no-gutters justify="center">
      <v-col v-for="x in item.IntegratedEquipment" cols="auto">
        <cc-integrated-info :item="x" :panel="$vuetify.display.lgAndUp" />
      </v-col>
    </v-row>
  </div>

  <slot name="profile" />

  <div v-if="item.Tags && item.Tags.length && !hideTags" class="mt-2">
    <div v-show="!dense" class="text-cc-overline text-disabled">//TAGS</div>
    <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" />
  </div>

  <slot name="charts" />

  <div v-if="item.Description" class="my-2">
    <div v-show="!dense" class="text-cc-overline text-disabled">//COMPENDIUM DATA</div>
    <div v-html-safe="item.Description" class="flavor-text" />
  </div>

  <div v-if="notes">
    <v-textarea
      v-model="item.Note"
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
</template>

<script lang="ts">
export default {
  name: 'equipment-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    hideTags: { type: Boolean },
    charts: { type: Boolean },
  },
};
</script>
