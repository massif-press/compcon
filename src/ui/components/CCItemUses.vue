<template>
  <div class="mt-n1">
    <v-icon
      v-for="n in max"
      :key="`chk_${item.ID}-${n}`"
      class="d-inline ma-0"
      :small="small"
      :large="large"
      :color="color"
      @click.stop="set(n)"
      v-html="n <= current ? fullIcon : emptyIcon"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MechEquipment, PilotGear } from '@/class'

@Component({ name: 'cc-item-uses' })
export default class CCItemUses extends Vue {
  @Prop({ type: Boolean })
  readonly small?: boolean
  @Prop({ type: Boolean })
  readonly large?: boolean
  @Prop({ type: String, required: false, default: 'mdi-hexagon-outline' })
  readonly emptyIcon: string
  @Prop({ type: String, required: false, default: 'mdi-hexagon-slice-6' })
  readonly fullIcon: string
  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string

  @Prop({
    type: Object,
    required: true,
  })
  readonly item!: MechEquipment | PilotGear
  @Prop({ type: Number, required: false, default: 0 })
  readonly bonus: number

  get max(): number {
    return this.item.MaxUses + this.bonus
  }
  get current(): number {
    return this.item.Uses
  }

  set(val): void {
    if (val > this.current) Vue.set(this.item, 'Uses', this.item.Uses + 1)
    else Vue.set(this.item, 'Uses', this.item.Uses - 1)
  }
}
</script>
