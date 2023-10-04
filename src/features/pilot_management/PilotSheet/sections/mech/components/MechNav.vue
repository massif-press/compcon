<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <div class="d-inline">
      <!-- Uncomment if/when pilot analytics are done -->
      <!-- <cc-tooltip inline delayed content="Active Mech Configuration">
        <nav-item tile depressed :selected="selected === 0" @click="$emit('set-page', 0)">
          MECH CONFIGURATION
        </nav-item>
      </cc-tooltip>
      <cc-tooltip simple inline content="Feature In Development">
        <nav-item disabled :selected="selected === 1" @click="$emit('set-page', 1)">
          COMBAT ANALYTICS
        </nav-item>
      </cc-tooltip> -->
      <cc-tooltip inline delayed content="Pilot Sheet">
        <v-btn icon variant="plain" class="unskew mt-n2" @click="toTacticalProfile()">
          <v-icon size="30" icon="cc:pilot" />
        </v-btn>
      </cc-tooltip>
    </div>

    <v-menu offset-y top>
      <template #activator="{ props }">
        <v-btn class="unskew mt-n1" icon variant="plain" v-bind="props">
          <cc-tooltip inline delayed content="Mech Options">
            <v-icon icon="mdi-cog" />
          </cc-tooltip>
        </v-btn>
      </template>
      <v-list two-line subheader class="bg-panel">
        <div class="heading h2 text-white primary py-0 px-2">Mech Options</div>
        <v-divider />

        <v-list-item
          prepend-icon="mdi-printer"
          title="Print"
          subtitle="Print a tabletop-ready mech sheet"
          @click="$router.push(`/print/${pilot.ID}/${mechID}`)"
        />

        <v-list-item
          prepend-icon="mdi-file-document-outline"
          title="Generate Statblock"
          subtitle="Get a plaintext representation of this mech configuration"
          @click="($refs as any).statblockDialog.show()"
        />

        <v-divider />

        <v-list-item
          class="text-error"
          prepend-icon="mdi-delete"
          title="Delete Mech"
          subtitle="Remove mech from the Hangar"
          @click="$emit('delete')"
        />
      </v-list>
    </v-menu>

    <statblock-dialog
      ref="statblockDialog"
      class="unskew"
      :pilot="(pilot as Pilot)"
      :mechID="mechID"
    />
  </div>
</template>

<script lang="ts">
import StatblockDialog from '../../../components/StatblockDialog.vue';
import { Pilot } from '@/class';

export default {
  name: 'mech-nav',
  components: { StatblockDialog },
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
  right: -60px;
  height: 40px;
  padding: 0px 70px 0px 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  color: white;
  z-index: 10;
}

.unskew {
  transform: skew(0.65rad);
}
</style>
