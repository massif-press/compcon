<template>
  <div>
    <div>
      <v-tooltip top v-if="item.data_type === 'frame'">
        <v-btn slot="activator" @click="model = true" block outline :color="itemColor(item.data_type)" >"{{item.name}}" Frame</v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
      <v-tooltip top v-else-if="item.data_type === 'weapon'">
        <v-btn slot="activator" @click="model = true" block outline :color="itemColor(item.data_type)" >{{item.name}}</v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
      <v-tooltip top v-else>
        <v-btn slot="activator" @click="model = true" block outline :color="itemColor(item.data_type)">{{item.name}}</v-btn>
        <span v-html="tooltip(item)" />
      </v-tooltip>
    </div>
    <v-dialog lazy v-model="model" :width="item.data_type === 'frame' ? '95vw' : '50vw'">
      <v-toolbar :color="itemColor(item.data_type)" dark>
        <v-toolbar-title>{{item.name}}
          <span class="caption">({{ item.source }}<span v-if="item.data_type !== 'frame'"> {{item.license}} {{item.license_level}}</span>)</span>
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
  import { thisItem } from '@/data_interfaces/type_guards'
  import ItemCard from './ItemCard.vue'
  import colors from '@/features/_shared/UI/CCColors'

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
      tooltip(item: CCItem) {
        if (thisItem.isFrame(item)) {
          return `<b>FRAME</b><br>${item.mechtype}`
        } else if (thisItem.isWeapon(item)) {
          return `<b>MECH WEAPON</b><br>${item.mount} ${item.type}`
        } else if (thisItem.isMod(item)) {
          return `<b>WEAPON MOD</b><br>${item.applied_string}`
        } else {
          return `<b>MECH SYSTEM</b><br>${item.type}`
        }
      },
      itemColor(t: string) {
        var c: any = colors.colors
        if (t === 'frame') { return c.frame.light }
        else if (t === 'weapon') { return c.weapon.light }
        return c.system.light
      },
    }
  })
</script>