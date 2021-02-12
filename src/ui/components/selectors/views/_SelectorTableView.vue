<template>
  <v-data-table
    v-resize="onResize"
    :headers="headers"
    :items="items"
    :custom-sort="customSort"
    item-key="ID"
    :height="tableHeight"
    hide-default-footer
    disable-pagination
    class="elevation-0 flavor-text"
    calculate-widths
    fixed-header
    show-select
    single-select
    style="text-transform: uppercase; background-color: transparent"
  >
    <template v-slot:[`item.data-table-select`]="{ item }">
      <cc-tooltip simple inline :content="`Equip ${item.Name}`">
        <v-btn
          icon
          color="accent"
          dark
          :disabled="spDisable && item.SP > sp && !spIgnore"
          @click="$emit('equip', item)"
        >
          <v-icon v-if="spDisable && item.SP > sp && !spIgnore">mdi-cancel</v-icon>
          <v-icon v-else large>cci-accuracy</v-icon>
        </v-btn>
      </cc-tooltip>
    </template>
    <template v-slot:[`item.Name`]="{ item }">
      <span v-if="spDisable && item.SP > sp && !spIgnore" class="stat-text subtle--text">
        {{ item.Name }}
        <cc-tooltip inline content="Equipment exceeds System Point capacity">
          <v-icon color="warning">mdi-alert</v-icon>
        </cc-tooltip>
      </span>
      <span v-else class="stat-text">{{ item.Name }}</span>
    </template>
    <template v-slot:[`item.SizeInt`]="{ item }">
      {{ item.Size }}
    </template>
    <template v-slot:[`item.Damage[0].Max`]="{ item }">
      <cc-damage-element small :damage="item.Damage" />
    </template>
    <template v-slot:[`item.Range[0].Max`]="{ item }">
      <cc-range-element small :range="item.Range" />
    </template>
    <template v-slot:[`item.Detail`]="{ item }">
      <v-icon color="accent" @click="$refs[`modal_${item.ID}`].show()">
        mdi-information-outline
      </v-icon>
      <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MechWeapon, PilotWeapon } from '@/class'

@Component({ name: 'selector-table-view' })
export default class SelectorTableView extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  readonly headers: string[]

  @Prop({
    type: Array,
    required: true,
  })
  readonly items: PilotWeapon[] | MechWeapon[]

  @Prop({ type: Boolean })
  readonly spDisable: boolean

  @Prop({ type: Boolean })
  readonly spIgnore: boolean

  @Prop({ type: Number, required: false, default: 0 })
  readonly sp: boolean

  tableHeight = 535
  mounted() {
    this.onResize()
  }

  customSort(items, index, descending) {
    const desc = descending[0]
    items.sort((a, b) => {
      if (index[0] === 'Damage[0].Max') {
        return desc ? b.MaxDamage - a.MaxDamage : a.MaxDamage - b.MaxDamage
      } else if (index[0] === 'Range[0].Max') {
        return desc ? b.Range[0].Max - a.Range[0].Max : a.Range[0].Max - b.Range[0].Max
      } else {
        return desc ? (a[index[0]] < b[index[0]] ? -1 : 1) : b[index[0]] < a[index[0]] ? -1 : 1
      }
    })
    return items
  }

  onResize() {
    this.tableHeight = window.innerHeight - 215
  }
}
</script>
