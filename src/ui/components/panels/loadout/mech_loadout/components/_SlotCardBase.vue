<template>
  <v-card class="clipped-large" tile>
    <v-toolbar
      :height="mobile ? 18 : 26"
      style="cursor: pointer"
      :color="titleColor"
      @click="empty ? '' : (detailDialog = true)">
      <v-toolbar-title
        class="ml-0"
        :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <slot name="header" />
      </v-toolbar-title>
      <v-toolbar-items
        v-if="!portrait"
        :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <slot name="header-items" />
      </v-toolbar-items>
    </v-toolbar>
    <div v-if="portrait" style="position: absolute; top: 12px; right: -4px">
      <slot name="header-items" />
    </div>

    <v-card-text class="px-2 pt-0 pb-2">
      <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
        <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
      </v-card>

      <slot />

      <div v-if="item">
        <div v-if="item.Effect">
          <div class="text-cc-overline text-disabled mt-1">
            <v-icon :icon="item.Icon" size="small" class="mt-n1" />
            EQUIPMENT EFFECT
          </div>
          <p v-html-safe="item.Effect" class="text-text mb-1" />
        </div>

        <div v-if="item.Actions?.length" class="mb-2 mt-1">
          <div class="text-cc-overline text-disabled mb-1">
            <v-icon size="small" icon="cc:activate" class="mt-n1" />
            EQUIPMENT ACTIONS
          </div>
          <cc-action v-for="a in item.Actions" :action="a" :panel="!mobile" class="mb-1" />
        </div>

        <div v-if="item.Deployables?.length" class="mb-2">
          <div class="text-cc-overline text-disabled mb-1">
            <v-icon size="small" icon="cc:drone" class="mt-n1" />
            EQUIPMENT DEPLOYABLES
          </div>
          <cc-deployable-info
            v-for="d in item.Deployables"
            :deployable="d"
            :panel="!mobile"
            class="mb-1"
            :name-override="item.Name" />
        </div>

        <v-row dense align="center">
          <v-col cols="auto">
            <cc-tags
              v-if="item.Tags"
              :tags="item.Tags"
              :color="color"
              :bonus="mech.Pilot.LimitedBonus" />
          </v-col>

          <v-col
            v-show="item.Profiles.length > 1"
            v-for="p in item.Profiles"
            class="mr-4"
            cols="auto">
            <div v-if="p.Tags.length">
              <div class="text-cc-overline" v-text="p.Name" />
              <cc-tags
                v-if="p.Tags"
                :tags="p.Tags"
                :color="color"
                :bonus="mech.Pilot.LimitedBonus" />
            </div>
          </v-col>

          <v-col cols="auto">
            <cc-tags
              v-if="item.Mod"
              :tags="item.Mod.AddedTags"
              color="mod"
              :bonus="mech.Pilot.LimitedBonus" />
          </v-col>
          <v-col cols="auto" class="ml-auto mr-4">
            <cc-bonus-display :item="item" />
            <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large />
          </v-col>
        </v-row>
      </div>

      <div
        v-if="empty"
        class="py-3 text-center fade-select"
        style="height: 100%; cursor: pointer"
        @click="selectorDialog = true">
        <v-row style="height: 100%">
          <div class="heading h2 text-disabled my-auto py-5" style="width: 100%">
            // {{ mobile ? 'TAP' : 'CLICK' }} TO ADD //
          </div>
        </v-row>
      </div>
    </v-card-text>
  </v-card>

  <cc-solo-modal v-model="detailDialog" :title="item?.Name || ''" :icon="item?.Icon || ''" shrink>
    <cc-item-card :item="item" notes />
    <slot name="detail" />
  </cc-solo-modal>

  <cc-solo-modal v-model="selectorDialog" title="select equipment">
    <slot name="selector" />
  </cc-solo-modal>
</template>

<script lang="ts">
import { ItemType } from '@/class';

export default {
  name: 'slot-card-base',
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
      default: null,
    },
    empty: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    titleColor: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    detailDialog: false,
    selectorDialog: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    portrait() {
      return this.$vuetify.display.xs;
    },
    synergyLocation() {
      if (!this.item) return 'none';
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system';
    },
  },
};
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
