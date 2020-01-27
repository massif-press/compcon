<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-icon small class="fadeSelect" v-on="on">mdi-circle-edit-outline</v-icon>
    </template>
    <v-card outlined>
      <v-card-text>
        <v-combobox
          v-model="sel"
          autofocus
          background-color="stark-panel"
          dense
          outlined
          hide-details
          :items="items"
          item-value="value"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-short-string-editor', })
export default class CCComboSelect extends Vue {

  @Prop({ type: Array, required: true, })
  readonly items!: { 
    text: string | number | object
    value: string | number | object
  }[]
  
  sel = ''
  menu = false
  
  @Watch('sel')
  onSelChange() {
    const s = typeof this.sel === 'string' ? this.sel : this.sel.value
    this.$emit('set', s)
  }
}
</script>
