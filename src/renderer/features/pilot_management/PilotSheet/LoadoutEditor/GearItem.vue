<template>
  <v-layout fill-height>
    <v-flex xs2>
      <v-tooltip top>
        <v-btn
          slot="activator"
          block
          @click="clicked"
          color="grey lighten-3"
          style="height:100%; margin:0"
        >
          {{ empty || itemData.err ? 'Equip' : '' }} {{ itemType }}
        </v-btn>
        <span>{{ empty ? 'Add' : 'Change' }} {{ itemType }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex xs10>
      <div v-if="empty">
        <v-expansion-panel>
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading">EMPTY</span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else-if="itemData.err">
        <v-expansion-panel>
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading grey--text">
              // MISSING ITEM DATA //&emsp;
              <span v-if="item.brew" class="caption grey--text">
                ({{ item.brew }})
              </span>
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <v-layout slot="header">
              <span class="subheading font-weight-bold">
                {{ itemData.name }}
              </span>
              <v-spacer />
              <span
                v-if="itemData.type === 'armor'"
                class="mr-5"
                style="display: inline-flex;"
              >
                ARMOR: {{ itemData.armor || 0 }} // EDEF:
                {{ itemData.edef || 0 }} // EVASION:
                {{ itemData.evasion || 0 }} // SPEED: {{ itemData.speed || 0 }}
              </span>
              <span
                v-else-if="itemData.type === 'weapon'"
                class="mr-5"
                style="display: inline-flex;"
              >
                <range-element small :range="itemData.range" />
                &emsp;&mdash;&emsp;
                <damage-element small size="16" :dmg="itemData.damage" />
              </span>
              <span v-else class="mr-5" style="display: inline-flex;">
                {{ itemData.uses ? `${itemData.uses} Uses` : '' }}
              </span>
            </v-layout>
            <gear-card :itemData="itemData" table-item />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement, GearCard } from '../../components/UI'

export default Vue.extend({
  name: 'gear-item',
  components: { GearCard, RangeElement, DamageElement },
  props: {
    item: Object,
    itemType: String,
  },
  computed: {
    empty(): boolean {
      return this.item === null || this.item === undefined
    },
    itemData(): any {
      var vm = this as any
      if (vm.empty) return {} as any
      return vm.item
    },
  },
  methods: {
    clicked() {
      this.$emit('clicked')
    },
  },
})
</script>
