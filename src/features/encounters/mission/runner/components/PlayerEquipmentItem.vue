<template>
  <v-col cols="4">
    <v-card :color="item.Destroyed ? 'error' : ''" outlined class="ma-1">
      <v-card-text class="py-2 px-3">
        <v-row dense align="center">
          <v-col lg="12" xl="auto" class="mr-2">
            <div class="heading h3" :style="item.Destroyed ? 'text-decoration: line-through;' : ''">
              <span v-if="item.FlavorName">
                {{ item.Name }}
                <span class="caption">{{ item.TrueName }}</span>
              </span>
              <span v-else>
                {{ item.Name }}
              </span>
            </div>
          </v-col>
          <v-col v-if="item.Damage" cols="auto">
            <cc-damage-element
              :damage="item.Damage"
              :type-override="item.DamageTypeOverride"
              small
              class="d-inline"
            />
          </v-col>
          <v-col v-if="item.Range" cols="auto">
            <cc-range-element :range="item.Range" small class="d-inline" />
          </v-col>
          <v-col v-if="item.MaxUses" cols="auto" class="mb-n1">
            <cc-item-uses :item="item" />
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <v-dialog width="75vw">
              <template v-slot:activator="{ on }">
                <v-icon slot="button" class="fadeSelect" v-on="on">mdi-information-outline</v-icon>
              </template>
              <cc-titled-panel :title="item.Name" :color="$_.kebabCase(item.ItemType)">
                <cc-item-card :item="item" />
              </cc-titled-panel>
            </v-dialog>
          </v-col>
          <v-col cols="auto">
            <cc-tooltip simple :content="`Mark ${item.Destroyed ? 'Repaired' : 'Destroyed'}`">
              <v-icon
                :color="item.Destroyed ? 'secondary' : 'error'"
                class="fadeSelect"
                @click="item.Destroyed = !item.Destroyed"
              >
                {{ item.Destroyed ? 'cci-repair' : 'mdi-image-broken-variant' }}
              </v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'player-equipment-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
