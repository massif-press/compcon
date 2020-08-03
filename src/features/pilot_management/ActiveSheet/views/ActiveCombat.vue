<template>
  <div>
    <div>
      <pilot-block v-if="!pilot.Mounted" :pilot="pilot" />
      <mech-block v-else :pilot="pilot" />
    </div>
    drone tracker
    <br />
    deployable tracker
  </div>
</template>

<script lang="ts">
import PilotBlock from '../layout/PilotBlock.vue'
import MechBlock from '../layout/MechBlock.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'active-combat',
  components: { PilotBlock, MechBlock },
})
</script>
