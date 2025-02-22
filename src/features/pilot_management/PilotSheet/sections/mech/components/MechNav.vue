<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <div class="d-inline">
      <v-tooltip text="Return to Pilot Sheet" location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            icon
            variant="plain"
            class="unskew mt-n2"
            @click="toTacticalProfile()">
            <v-icon size="25" icon="cc:pilot" />
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <v-menu offset-y top>
      <template #activator="{ props }">
        <v-btn class="unskew mt-n1" icon variant="plain" size="small" v-bind="props">
          <v-tooltip text="Mech Options" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="24" class="mt-n1 ml-4" icon="mdi-cog" />
            </template>
          </v-tooltip>
        </v-btn>
      </template>
      <div class="heading h2 bg-primary py-0 px-2">Mech Options</div>
      <v-list lines="two" density="compact" slim>
        <v-list-item
          prepend-icon="mdi-printer"
          title="Print"
          subtitle="Print a tabletop-ready mech sheet"
          @click="$router.push(`/print/${pilot.ID}/${mechID}`)" />

        <v-list-item
          prepend-icon="mdi-file-document-outline"
          title="Generate Statblock"
          subtitle="Get a plaintext representation of this mech configuration"
          @click="statblockDialog = true" />

        <v-divider v-if="!pilot.IsRemote" />

        <v-list-item
          v-if="!pilot.IsRemote"
          class="text-error"
          prepend-icon="mdi-delete"
          title="Delete Mech"
          subtitle="Remove mech from the Hangar"
          @click="$emit('delete')" />
      </v-list>
    </v-menu>

    <div id="end-cap" />
  </div>
  <cc-solo-modal v-model="statblockDialog" title="Generate Statblock" icon="mdi-code-block-tags">
    <statblock-dialog :pilot="<Pilot>pilot" :mechID="mechID" />
  </cc-solo-modal>
</template>

<script lang="ts">
import StatblockDialog from '../../../components/StatblockDialog.vue';
import { Pilot } from '@/class';

export default {
  name: 'mech-nav',
  components: { StatblockDialog },
  data: () => ({
    statblockDialog: false,
  }),
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    selected: {
      type: Number,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
    },
  },
  methods: {
    toTacticalProfile() {
      this.$router.push({ name: 'pilot_sheet_redirect', params: { pilotID: this.pilot.ID } });
    },
  },
};
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  right: -40px;
  height: 30px;
  padding: 0px 70px 0px 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  z-index: 10;
}

.unskew {
  transform: skew(0.65rad);
}

#end-cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 5px;
  height: 30px;
  right: 178px;
  top: 0;
  z-index: 9;
  transition: filter 0.2s ease-in-out;
}

.nav-body:hover #end-cap {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
