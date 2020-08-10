<template>
  <div>
    <span class="overline">
      DEPLOYED EQUIPMENT
      <v-btn small right icon class="fadeSelect" @click="showDeployed = !showDeployed">
        <v-icon small v-html="showDeployed ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
      </v-btn>
    </span>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'deployed-block',
  data: () => ({
    showDeployed: true,
  }),
})
</script>
