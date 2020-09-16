<template>
  <equipment-card-base :item="item" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EquipmentCardBase from './_EquipmentCardBase.vue'
import { PilotGear } from '@/class'

@Component({
  components: { EquipmentCardBase },
})
export default class PilotGearCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly item: PilotGear
}
</script>
