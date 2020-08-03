<template>
  <div>if mounted -> show mounted block if dismounted -> show pilot block rest</div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'active-rest',
})
</script>
