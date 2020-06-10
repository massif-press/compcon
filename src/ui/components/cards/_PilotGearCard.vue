<template>
  <equipment-card-base :item="item">
    <span class="large-text">
      <b class="accent--text">{{ item.uses ? item.uses : 'Unlimited' }}</b>
      Use{{ !item.uses || item.uses > 1 ? 's' : '' }}
    </span>
  </equipment-card-base>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EquipmentCardBase from './_EquipmentCardBase.vue'
import { PilotGear } from '@/class'

@Component({
  components: { EquipmentCardBase },
})
export default class PilotGearCard extends Vue{
  @Prop({ type: Object, required: true, })
  readonly item: PilotGear
}
</script>
