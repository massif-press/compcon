<template>
  <div>
    <pilot-block v-if="!pilot.State.IsMounted" />
    <mech-block v-else />
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
