<template>
  <div>
    <div>
      <v-tooltip top v-if="item.ItemType === 'Frame'">
        <v-btn
          slot="activator"
          @click="model = true"
          block
          outline
          :color="itemColor(item.ItemType)"
        >
          "{{ item.Name }}" Frame
        </v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
      <v-tooltip top v-else-if="item.ItemType === 'MechWeapon'">
        <v-btn
          slot="activator"
          @click="model = true"
          block
          outline
          :color="itemColor(item.ItemType)"
        >
          {{ item.Name }}
        </v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
      <v-tooltip top v-else>
        <v-btn
          slot="activator"
          @click="model = true"
          block
          outline
          :color="itemColor(item.ItemType)"
        >
          {{ item.Name }}
        </v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
    </div>
    <v-dialog
      lazy
      v-model="model"
      :width="item.ItemType === 'Frame' ? '95vw' : '50vw'"
    >
      <v-toolbar :color="itemColor(item.ItemType)" dark>
        <v-toolbar-title>
          {{ item.Name }}
          <span class="caption">
            ({{ item.Source }}
            <span v-if="item.ItemType !== 'Frame'">
              {{ item.License }} {{ item.LicenseLevel }}
            </span>
            )
          </span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <item-card :itemData="item" popup />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemCard from './ItemCard.vue'
import colors from '@/features/_shared/UI/CCColors'
import {
  CompendiumItem,
  ItemType,
  Frame,
  MechWeapon,
  MechSystem,
  WeaponMod,
} from '@/class'

export default Vue.extend({
  name: 'item-badge',
  data: () => ({
    model: false,
  }),
  props: {
    item: Object,
  },
  components: { ItemCard },
  methods: {
    tooltip(item: CompendiumItem) {
      if (item.ItemType === ItemType.Frame) {
        const f = item as Frame
        return `<b>FRAME</b><br>${f.MechTypeString}`
      } else if (item.ItemType === ItemType.MechWeapon) {
        const w = item as MechWeapon
        return `<b>MECH WEAPON</b><br>${w.Size} ${w.Type}`
      } else if (item.ItemType === ItemType.WeaponMod) {
        const m = item as WeaponMod
        return `<b>WEAPON MOD</b><br>${m.AppliedString}`
      } else {
        const s = item as MechSystem
        return `<b>MECH SYSTEM</b><br>${s.Type}`
      }
    },
    itemColor(t: string) {
      if (t === 'Frame') {
        return colors.frame.light
      } else if (t === 'MechWeapon') {
        return colors.weapon.light
      }
      return colors.system.light
    },
  },
})
</script>
