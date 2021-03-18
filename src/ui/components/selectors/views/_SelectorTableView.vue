<template>
  <v-data-table
    v-resize="onResize"
    :headers="shownHeaders"
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
    style="text-transform: uppercase; background-color: transparent; max-width: 100vw!important"
  >
    <template v-slot:[`item.data-table-select`]="{ item }">
      <div v-if="$vuetify.breakpoint.smAndDown" class="text-left" style="display: grid">
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
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <cc-solo-dialog :ref="`modal_${item.ID}`" :title="`${item.Source} ${item.Name}`" large>
        <cc-item-card :item="item" />
      </cc-solo-dialog>
    </template>
    <template v-slot:[`item.ItemType`]="{ item }">
      <v-icon v-html="item.Icon" />
    </template>
    <template v-slot:[`item.Name`]="{ item }">
      <span v-if="spDisable && item.SP > sp && !spIgnore" class="stat-text subtle--text">
        {{ item.Name }}
        <cc-tooltip inline content="Equipment exceeds System Point capacity">
          <v-icon color="warning">mdi-alert</v-icon>
        </cc-tooltip>
      </span>
      <span v-else :class="`stat-text ${item.IsExotic ? 'amber--text text-accent-4' : ''}`">
        {{ item.Name }}
      </span>
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
    <template v-slot:[`item.Equip`]="{ item }">
      <div v-if="$vuetify.breakpoint.smAndDown" class="text-left pl-0 ml-n6" style="display: grid">
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
    <template v-slot:[`item.Add`]="{ item }">
      <div v-if="$vuetify.breakpoint.smAndDown" class="text-left pl-0 ml-n6" style="display: grid">
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
  readonly headers: any[]

  get shownHeaders(): any[] {
    const hide = ['weapon', 'system', 'item', 'license level']
    return this.$vuetify.breakpoint.smAndDown
      ? this.headers.filter(x => !hide.includes(x.text.toLowerCase()))
      : this.headers
  }

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
