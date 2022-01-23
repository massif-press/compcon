<template>
  <div>
    <v-select
      v-model="arr"
      :label="label"
      :items="items"
      item-text="name"
      multiple
      color="accent"
      item-color="accent"
      dense
      hide-details
      outlined
      clearable
    >
      <template v-slot:selection="{ item }">
        <v-menu v-if="item.effects" bottom offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <v-chip small :dark="dark" :color="color" v-on="on">
              <b>{{ item.name }}</b>
            </v-chip>
          </template>
          <v-card>
            <v-card-text>
              <p v-html-safe="item.effects" class="body-text ma-0 pa-1" />
            </v-card-text>
          </v-card>
        </v-menu>
        <v-chip v-else small :dark="dark" :color="color">
          <b>{{ item.name }}</b>
        </v-chip>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'status-select' })
export default class CCStatusSelect extends Vue {
  @Prop({ type: Array, required: true })
  readonly items!: Status[]

  @Prop({ required: true })
  readonly model!: Status[]

  @Prop({ type: String, required: false, default: '' })
  readonly color: string

  @Prop({ type: String, required: false, default: '' })
  readonly label: string

  @Prop({ type: Boolean })
  readonly dark?: boolean

  get arr(): any {
    return this.model
  }
  set arr(val) {
    if (!Array.isArray(val)) val = [val]
    this.$emit('set', val)
  }
}
</script>
