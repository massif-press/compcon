<template>
  <v-select
    v-model="arr"
    :label="label"
    :items="items"
    item-text="name"
    multiple
    :color="color"
    dense
    hide-details
    outlined
    clearable
  >
    <template v-slot:selection="{ item }">
      <v-menu top offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-chip small :dark="dark" :color="color" v-on="on">
            <b>{{ item.name }}</b>
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <ul>
              <li v-for="e in item.effects" :key="e" v-html="e" />
            </ul>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'status-select', })
export default class CCStatusSelect extends Vue {
  
  @Prop({ type: Array, required: true, })
  readonly items!: Status[]

  @Prop({ type: Array, required: true, })
  readonly model!: Status[]

  @Prop({ type: String, required: false, default: '', })
  readonly color: string

  @Prop({ type: String, required: false, default: '', })
  readonly label: string

  @Prop({ type: Boolean, })
  readonly dark?: boolean

  get arr() {
    return this.model
  }
  set arr(val) {
    this.$emit('set', val)
  }

}
</script>
