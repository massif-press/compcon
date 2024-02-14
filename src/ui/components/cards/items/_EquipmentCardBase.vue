<template>
  <v-row no-gutters style="height: 100%">
    <v-col cols="12">
      <slot />

      <v-row v-if="item.Mod" align="center" class="pt-1 pb-2">
        <v-col><v-divider /></v-col>
        <v-col cols="auto">
          <v-chip color="secondary" variant="outlined">
            <v-icon start icon="cc:weaponmod" />Modifies: {{ item.Mod.Target.Name }}
          </v-chip>
        </v-col>
        <v-col><v-divider /></v-col>
      </v-row>

      <cc-icon-divider v-if="item.LicenseString" :icon="item.Icon" />

      <slot name="statblock" />

      <div v-if="item.Effect">
        <div v-show="!dense" class="text-overline text-disabled">//EQUIPMENT EFFECT</div>
        <p v-html-safe="item.Effect" class="text-text body-text mb-1" />
      </div>

      <div v-if="item.Actions && item.Actions.length">
        <div v-show="!dense" class="text-overline text-disabled">
          <v-icon size="small" icon="cc:activate" />EQUIPMENT ACTIONS
        </div>
        <v-row dense justify="center">
          <v-col v-for="a in item.Actions" cols="auto">
            <cc-action
              :action="a"
              :panel="forceActions || $vuetify.display.lgAndUp"
              :hover="dense && !forceActions"
              class="ma-2" />
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
        <div v-show="!dense" class="text-overline text-disabled">
          <v-icon size="small" icon="cc:drone" />EQUIPMENT DEPLOYABLES
        </div>
        <v-row dense justify="center">
          <v-col v-for="d in item.Deployables" cols="auto">
            <cc-deployable-info
              :deployable="d"
              :panel="forceActions || $vuetify.display.lgAndUp"
              :hover="dense && !forceActions"
              class="ma-2" />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.IntegratedEquipment && item.IntegratedEquipment.length">
        <div v-show="!dense" class="text-overline text-disabled">//EQUIPMENT INTEGRATIONS</div>
        <v-row dense justify="center">
          <v-col v-for="x in item.IntegratedEquipment" cols="auto">
            <cc-integrated-info :item="x" :panel="forceActions || $vuetify.display.lgAndUp" />
          </v-col>
        </v-row>
      </div>

      <slot name="profile" />

      <div v-if="item.Description" class="my-2">
        <div v-show="!dense" class="text-overline text-disabled">//COMPENDIUM DATA</div>
        <div v-html-safe="item.Description" class="flavor-text" />
      </div>

      <slot name="charts" />

      <div v-if="!footer && showFooter">
        <div v-show="!dense" class="text-overline text-disabled">//EQUIPMENT TAGS</div>
        <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" />
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
    </v-col>
    <v-col align-self="end">
      <v-footer v-if="footer && showFooter" color="panel" class="mx-n4 py-0 mt-2">
        <v-row>
          <v-col v-if="!hideTags" cols="auto">
            <cc-tags :tags="item.Tags" :extended="!smallTags" :small="smallTags" />
          </v-col>
          <v-col v-if="!hideBonuses" cols="auto" class="ml-auto">
            <div>
              <cc-bonus v-for="b in item.Bonuses" :bonus="b" chip />
            </div>
          </v-col>
        </v-row>
      </v-footer>
    </v-col>
  </v-row>
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
    forceActions: { type: Boolean },
    charts: { type: Boolean },
    footer: { type: Boolean },
  },
  computed: {
    showFooter() {
      return this.item.Tags.length > 0 || this.item.Bonuses.length > 0;
    },
  },
};
</script>
