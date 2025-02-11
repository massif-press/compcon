<template>
  <slot />

  <cc-heading v-if="item.Mod" size="small" line>
    <cc-chip>
      <v-icon start icon="cc:weaponmod" />
      Modifies: {{ item.Mod.Target.Name }}
    </cc-chip>
  </cc-heading>

  <cc-icon-divider v-if="item.LicenseString" :icon="item.Icon" dense />

  <div class="mb-2">
    <slot name="statblock" />
  </div>

  <div v-if="item.Effect" class="my-2">
    <div v-show="!dense" class="text-cc-overline text-disabled">//EQUIPMENT EFFECT</div>
    <p v-if="tier" v-html-safe="item.EffectByTier(tier)" class="text-text" />
    <p v-else v-html-safe="item.Effect" class="text-text" />
  </div>

  <div v-if="item.Actions && item.Actions.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">
      <v-icon size="small" icon="cc:activate" />
      EQUIPMENT ACTIONS
    </div>
    <v-row dense justify="center">
      <v-col v-for="a in item.Actions">
        <cc-action
          :action="a"
          :panel="!collapseActions || $vuetify.display.lgAndUp"
          :hover="dense && collapseActions"
          :tier="tier"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item && item.Ammo && item.Ammo.length">
    <div v-for="a in item.Ammo">
      <b>{{ a.name }}</b>
      :
      <span v-html-safe="a.detail" />
    </div>
  </div>

  <div v-if="item.Deployables && item.Deployables.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">
      <v-icon size="small" icon="cc:drone" />
      EQUIPMENT DEPLOYABLES
    </div>
    <v-row dense justify="center">
      <v-col v-for="d in item.Deployables" cols="auto">
        <cc-deployable-info
          :deployable="d"
          :panel="!collapseActions || $vuetify.display.lgAndUp"
          :hover="dense && collapseActions"
          :tier="tier"
          class="ma-2" />
      </v-col>
    </v-row>
  </div>

  <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//EQUIPMENT INTEGRATIONS</div>
    <v-row dense justify="center">
      <v-col v-for="x in item.IntegratedEquipment" cols="auto">
        <cc-integrated-info :item="x" :panel="!collapseActions || $vuetify.display.lgAndUp" />
      </v-col>
    </v-row>
  </div>

  <slot name="profile" />

  <slot name="charts" />

  <div v-if="!footer && showFooter && item.Tags?.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//EQUIPMENT TAGS</div>
    <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" :tier="tier" />
  </div>

  <div v-if="item.Description?.length" class="my-4">
    <div v-show="!dense" class="text-cc-overline text-disabled">//COMPENDIUM DATA</div>
    <div v-html-safe="item.Description" class="flavor-text" />
  </div>

  <div v-if="item.FlavorDescription?.length">
    <div v-show="!dense" class="text-cc-overline text-disabled">//FIELD DATA</div>
    <div v-html-safe="item.FlavorDescription" class="flavor-text" />
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

  <v-footer v-if="footer && showFooter" color="transparent" class="mx-n4 py-0 mt-2">
    <v-row>
      <v-col v-if="!hideTags" cols="auto">
        <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" :tier="tier" />
      </v-col>
      <v-col v-if="!hideBonuses" cols="auto" class="ml-auto">
        <div>
          <cc-bonus v-for="b in item.Bonuses" :bonus="b" chip :tier="tier" />
        </div>
      </v-col>
    </v-row>
  </v-footer>
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
    hideBonuses: { type: Boolean },
    charts: { type: Boolean },
    footer: { type: Boolean },
    collapseActions: {
      type: Boolean,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    showFooter() {
      return this.item.Tags.length > 0 || this.item.Bonuses.length > 0;
    },
  },
};
</script>
