<template>
  <div>
    <v-row class="flavor-text">
      <slot name="title" />
    </v-row>

    <cc-icon-divider v-if="item.LicenseString" :icon="item.Icon" />

    <slot name="statblock" />

    <div v-if="item.Effect">
      <div class="text-overline text-subtle">EQUIPMENT EFFECT</div>
      <p v-html-safe="item.Effect" class="text-text body-text mb-1" />
    </div>

    <div v-if="item.Actions && item.Actions.length">
      <div class="text-overline text-subtle">EQUIPMENT ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="a in item.Actions" cols="auto">
          <cc-action
            :action="a"
            :panel="$vuetify.display.lgAndUp"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="item && item.Ammo && item.Ammo.length">
      <div v-for="a in item.Ammo" class="body-text">
        <b>{{ a.name }}</b>
        :
        <span v-html-safe="a.detail" />
      </div>
    </div>

    <div v-if="item.Deployables && item.Deployables.length">
      <div class="text-overline text-subtle">EQUIPMENT DEPLOYABLES</div>
      <v-row no-gutters justify="center">
        <v-col v-for="d in item.Deployables" cols="auto">
          <cc-deployable-info
            :deployable="d"
            :panel="$vuetify.display.lgAndUp"
            :name-override="item.Name"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
      <div class="text-overline text-subtle">EQUIPMENT INTEGRATIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="x in item.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="$vuetify.display.lgAndUp" />
        </v-col>
      </v-row>
    </div>

    <slot name="profile" />

    <div v-if="item.Tags && item.Tags.length" class="mt-2">
      <div class="text-overline text-subtle">//EQUIPMENT TAGS</div>
      <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" />
    </div>

    <div v-if="item.Description" class="my-2">
      <div class="text-overline text-subtle">//COMPENDIUM DATA</div>
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
        class="mt-2"
      />
    </div>
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
  },
};
</script>
