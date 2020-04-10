<template>
  <v-card flat tile class="my-1" color="transparent">
    <v-card-title :class="`${item.Feature.Color} sliced pa-0`">
      <div class="heading h3 flavor-text white--text pa-0 ml-2">
        <item-menu
          v-if="!readonly && !active"
          :item="item"
          :active="active"
          @remove-feature="$emit('remove-feature', $event)"
          @add-reaction="$emit('add-reaction', $event)"
          @recalc="$emit('recalc')"
        />
        <span v-if="readonly">
          {{ item.Feature.Name }}
        </span>
        <span v-else :style="item.Destroyed ? 'text-decoration: line-through' : ''">
          {{ item.Name }} (T{{ item.Tier }})
        </span>
        <span v-if="!item.Destroyed && !active" class="caption">//{{ item.Feature.Origin }}</span>
        &emsp;
      </div>
    </v-card-title>
    <v-card-text
      :class="`py-1 mt-n1 px-2 text--text ${item.Destroyed ? 'error lighten-1' : 'stark-panel'}`"
      :style="`border: 1px solid var(--v-${item.Feature.Color}-base)!important`"
    >
      <p
        v-if="item.Description"
        class="flavor-text px-2 light-panel stark--text mb-1"
        v-html="item.Description"
      />
      <slot />
      <div v-if="active">
        <v-divider class="my-1" />
        <v-row dense>
          <slot name="extra-action" />
          <v-col v-if="item.Feature.IsRecharging" class="ml-2 mt-n1">
            <v-switch
              v-model="item.IsCharged"
              :label="item.IsCharged ? 'Charged' : `Recharges on ${item.Feature.ChargeRoll}+`"
              inset
              dense
              hide-details
              color="primary"
              class="mt-0 flavor-text"
            />
          </v-col>
          <v-col v-if="item.MaxUses" class="ml-2 mt-n1">
            <span class="caption">USES:</span>
            <cc-item-uses class="d-inline" :item="item" />
          </v-col>
          <v-col v-if="destructable" cols="auto" class="ml-auto mr-2 mt-n2">
            <cc-tooltip simple :content="`Mark ${item.Destroyed ? 'Repaired' : 'Destroyed'}`">
              <v-btn
                icon
                :color="item.Destroyed ? 'secondary' : 'error'"
                class="fadeSelect"
                @click="item.Destroyed = !item.Destroyed"
              >
                <v-icon>
                  {{ item.Destroyed ? 'cci-repair' : 'mdi-image-broken-variant' }}
                </v-icon>
              </v-btn>
            </cc-tooltip>
          </v-col>
        </v-row>
        <slot name="active-actions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemMenu from './_ItemMenu.vue'

export default Vue.extend({
  name: 'npc-item-card-base',
  components: { ItemMenu },
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
  },
  computed: {
    destructable() {
      return (
        !this.readonly &&
        (this.item.Feature.FeatureType === 'System' ||
          this.item.Feature.FeatureType === 'Weapon' ||
          this.item.Feature.FeatureType === 'Tech')
      )
    },
  },
})
</script>
