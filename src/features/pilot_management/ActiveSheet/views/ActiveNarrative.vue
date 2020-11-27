<template>
  <div>
    <pilot-block v-if="!pilot.IsDead" :pilot="pilot" />
    <clone-block v-else hide-quirks readonly />
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import PilotBlock from '../layout/PilotBlock.vue'
import CloneBlock from '@/features/pilot_management/PilotSheet/sections/info/components/CloneBlock.vue'

export default vueMixins(activePilot).extend({
  name: 'active-narrative',
  components: {
    PilotBlock,
    CloneBlock,
  },
})
</script>
