<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -70px !important">
      <span class="ml-9">&emsp;</span>
      Player Notes
    </cc-title>
    <v-lazy>
      <v-textarea v-model="pilot.Notes" class="mt-2" outlined auto-grow />
    </v-lazy>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'notes-block',
})
</script>
