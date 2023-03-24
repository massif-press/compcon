<template>
  <div>
    <pilot-block v-if="!pilot.State.IsMounted" />
    <mech-block v-else />
    <deployed-block />
  </div>
</template>

<script lang="ts">
import PilotBlock from '../layout/PilotBlock.vue';
import MechBlock from '../layout/MechBlock.vue';
import DeployedBlock from '../layout/DeployedBlock.vue';

export default {
  name: 'active-combat',
  components: { PilotBlock, MechBlock, DeployedBlock },
};
</script>
