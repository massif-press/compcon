<template>
  <v-table class="text-left">
    <thead>
      <th v-for="h in (headers as any[])">{{ h.title }}</th>
      <th width="1px" />
    </thead>
    <tbody>
      <tr v-for="item in (items as CompendiumItem[])">
        <td v-for="h in (headers as any[])" :width="h.value === 'Name' ? '30%' : ''">
          <cc-item-chip v-if="h.value === 'Name'" :item="item" />
          <div v-else-if="h.value === 'Range'">
            <cc-range-element small :range="(item as any).Range" />
          </div>
          <div v-else-if="h.value === 'Damage'">
            <cc-damage-element small :damage="(item as any).Damage" />
          </div>
          <div v-else>
            {{ item[h.value] }}
          </div>
        </td>
        <td>
          <v-btn color="accent" size="small" @click="$emit('equip', item)">
            <v-icon start>mdi-plus</v-icon>
            Equip
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- <v-data-table
    :headers="headers"
    :items="items"
    item-value="ID"
    style="text-transform: uppercase; background-color: transparent; max-width: 100vw !important"
  >
    <template #[`item.data-table-select`]="{ item }">
      <div v-if="$vuetify.display.smAndDown" class="text-left" style="display: grid">
        <v-btn
          block
          text
          :color="item.IsExotic ? 'exotic' : 'accent'"
          @click="$refs[`modal_${item.ID}`].show()"
        >
          {{ item.Name }}
        </v-btn>
      </div>
      <v-btn v-else x-small fab color="primary" dark @click="$refs[`modal_${item.ID}`].show()">
        <v-icon icon="mdi-open-in-new" />
      </v-btn>
      <cc-solo-dialog :ref="`modal_${item.ID}`" :title="`${item.Source} ${item.Name}`" large>
        <cc-item-card :item="item" />
      </cc-solo-dialog>
    </template>
    <template #[`item.ItemType`]="{ item }">
      <v-icon v-html="item.Icon" />
    </template>
    <template #[`item.Name`]="{ item }">
      <span v-if="spDisable && item.SP > sp && !spIgnore" class="stat-text text-subtle">
        {{ item.Name }}
        <cc-tooltip inline content="Equipment exceeds System Point capacity">
          <v-icon color="warning">mdi-alert</v-icon>
        </cc-tooltip>
      </span>
      <span v-else :class="`stat-text ${item.IsExotic ? 'text-amber text-accent-4' : ''}`">
        {{ item.Name }}
      </span>
    </template>
    <template #[`item.SizeInt`]="{ item }">
      {{ item.Size }}
    </template>
     <template #[`item.Damage[0].Max`]="{ item }">
      <cc-damage-element small :damage="e.Damage" />
    </template>
    <template #[`item.Range[0].Max`]="{ item }">
      <cc-range-element small :range="item.Range" />
    </template> 
    <template #[`item.Detail`]="{ item }">
      <v-icon color="accent" @click="$refs[`modal_${item.ID}`].show()">
        mdi-information-outline
      </v-icon>
      <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
    </template>
    <template #[`item.Equip`]="{ item }">
      <div v-if="$vuetify.display.smAndDown" class="text-left pl-0 ml-n6" style="display: grid">
        <v-btn color="accent" small tile @click="$emit('equip', item)">
          <v-icon small left>mdi-plus</v-icon>
          Equip {{ item.Name }}
        </v-btn>
      </div>
      <v-btn v-else color="accent" small tile @click="$emit('equip', item)">
        <v-icon small left>mdi-plus</v-icon>
        Equip
      </v-btn>
    </template>
    <template #[`item.Add`]="{ item }">
      <div v-if="$vuetify.display.smAndDown" class="text-left pl-0 ml-n6" style="display: grid">
        <v-btn color="accent" small tile @click="$emit('equip', item)">
          <v-icon small left>mdi-plus</v-icon>
          Add {{ item.Name }}
        </v-btn>
      </div>
      <v-btn v-else color="accent" small tile @click="$emit('equip', item)">
        <v-icon small left>mdi-plus</v-icon>
        Add
      </v-btn>
    </template>
  </v-data-table> -->
</template>

<script lang="ts">
import { CompendiumItem } from '@/class';

export default {
  name: 'selector-table',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    equipped: {
      type: Object,
      required: false,
    },
  },
};
</script>
