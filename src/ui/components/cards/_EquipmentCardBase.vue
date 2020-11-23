<template>
  <v-card-text class="mb-0 pb-0">
    <v-row class="flavor-text" no-gutters>
      <slot />
    </v-row>

    <v-row v-if="item.LicenseString">
      <v-divider class="mt-3" />
      <v-icon color="panel-border">cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
      <v-divider class="mt-3" />
    </v-row>

    <slot name="statblock" />

    <div v-if="item.Effect">
      <div class="overline ml-n2 subtle--text">EQUIPMENT EFFECT</div>
      <p class="text--text body-text mb-1" v-html="item.Effect" />
    </div>
    <slot name="other_effects" />

    <div v-if="item.Actions.length">
      <div class="overline ml-n2 subtle--text">EQUIPMENT ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in item.Actions" :key="`${item.Name}_action_${i}`" cols="auto">
          <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="item.Deployables.length">
      <div class="overline ml-n2 subtle--text">EQUIPMENT DEPLOYABLES</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(d, i) in item.Deployables" :key="`${item.Name}_deployable_${i}`" cols="auto">
          <cc-deployable-info
            :deployable="d"
            :panel="$vuetify.breakpoint.lgAndUp"
            :name-override="item.Name"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="item.IntegratedEquipment.length">
      <div class="overline ml-n2 subtle--text">EQUIPMENT INTEGRATIONS</div>
      <v-row no-gutters justify="center">
        <v-col
          v-for="(x, i) in item.IntegratedEquipment"
          :key="`${item.Name}_integrated_${i}`"
          cols="auto"
        >
          <cc-integrated-info :item="x" :panel="$vuetify.breakpoint.lgAndUp" />
        </v-col>
      </v-row>
    </div>

    <div v-if="item.Tags && item.Tags.length">
      <div class="overline ml-n2 mb-n1 subtle--text">EQUIPMENT TAGS</div>
      <cc-tags :tags="item.Tags" extended />
    </div>
    <div v-else-if="item.ProfileTags && item.ProfileTags.length">
      <div class="overline ml-n2 mb-n1 subtle--text">EQUIPMENT TAGS</div>
      <cc-tags :tags="item.ProfileTags" extended />
    </div>
    <div v-if="item.Description" class="mt-2">
      <div class="overline ml-n2 mb-n2">COMPENDIUM ENTRY</div>
      <p class="flavor-text mb-1" v-html="item.Description" />
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'equipment-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
