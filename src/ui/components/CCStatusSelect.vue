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
      <v-menu v-if="item.effects" top offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-chip small :dark="dark" :color="color" v-on="on">
            <b>{{ item.name }}</b>
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <p class="flavor-text" v-html="item.effects" />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-chip v-else small :dark="dark" :color="color">
        <b>{{ item.name }}</b>
      </v-chip>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'status-select' })
export default class CCStatusSelect extends Vue {
  @Prop({ type: Array, required: true })
  readonly items!: Status[]

  @Prop({ type: Array, required: true })
  readonly model!: Status[]

  @Prop({ type: String, required: false, default: '' })
  readonly color: string

  @Prop({ type: String, required: false, default: '' })
  readonly label: string

  @Prop({ type: Boolean })
  readonly dark?: boolean

  get arr(): Status[] {
    return this.model
  }
  set arr(val) {
    this.$emit('set', val)
  }
}
</script>
