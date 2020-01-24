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
import { MechEquipment, MechSystem, PilotGear } from '@/class'


@Component({ name: 'cc-item-uses' })
export default class CCItemUses extends Vue{
  
  @Prop({ type: Boolean, })
  small?: boolean
  @Prop({ type: Boolean, })
  large?: boolean
  @Prop({ type: String, required: false, default: 'mdi-hexagon-outline', })
  emptyIcon: string 
  @Prop({ type: String, required: false, default: 'mdi-hexagon-slice-6', })
  fullIcon: string
  @Prop({ type: String, required: false, default: 'primary', })
  color: string

  @Prop({ type: Object, required: true, validator: (item) => item.MaxUses && item.Uses, })
  item!: MechEquipment | MechSystem | PilotGear
  @Prop({ type: Number, required: false, default: 0, })
  bonus: number

  get max() {
    return this.item.MaxUses + this.bonus
  }
  get current() {
    return this.item.Uses
  }

  set(val) {
    if (val > this.current) Vue.set(this.item, 'Uses', this.item.Uses + 1)
    else Vue.set(this.item, 'Uses', this.item.Uses - 1)
  }
}
</script>
