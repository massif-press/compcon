<template>
  <div>
    <cc-title small color="pilot">
      <span class="ml-9">&emsp;</span>
      Player Notes
    </cc-title>
    <v-textarea v-model="pilot.Notes" class="mt-2" outlined auto-grow />
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'notes-block',
})
</script>
