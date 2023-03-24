<template>
  <div>
    <div
      v-show="$vuetify.display.mdAndUp"
      style="
        position: absolute;
        top: 0;
        right: 0;
        height: 108px;
        width: 100px;
        overflow-x: hidden;
      "
      class="primary"
    />
    <v-tabs background-color="primary" hide-slider grow>
      <v-tab>
        <b>Pilot Bonuses</b>
      </v-tab>
      <v-tab>
        <b>Resource Reserves</b>
      </v-tab>
      <v-tab>
        <b>Tactical Reserves</b>
      </v-tab>
      <v-tab>
        <b>Mech Reserves</b>
      </v-tab>
      <v-tab>
        <b>Custom Reserve</b>
      </v-tab>
      <v-tab>
        <b>Project</b>
      </v-tab>
      <v-tab>
        <b>Organization</b>
      </v-tab>
      <v-tab-item>
        <v-row dense>
          <v-col
            v-for="r in reserves['Bonus']"
            :key="`item_${r.ID}`"
            cols="12"
            md="6"
          >
            <reserve-item
              :reserve="r"
              icon="cc:pilot"
              color="pilot"
              class="ma-2"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row dense>
          <v-col
            v-for="r in reserves['Resource']"
            :key="`item_${r.ID}`"
            cols="12"
            md="6"
          >
            <reserve-item
              :reserve="r"
              icon="cc:reserve-resource"
              color="reserve--resource"
              class="ma-2"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row dense>
          <v-col
            v-for="r in reserves['Tactical']"
            :key="`item_${r.ID}`"
            cols="12"
            md="6"
          >
            <reserve-item
              :reserve="r"
              icon="cc:reserve-tactical"
              color="reserve--tactical"
              class="ma-1"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row dense>
          <v-col
            v-for="r in reserves['Mech']"
            :key="`item_${r.ID}`"
            cols="12"
            md="6"
          >
            <reserve-item
              :reserve="r"
              icon="cc:reserve-mech"
              color="reserve--mech"
              class="ma-1"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <custom-reserve-panel class="mt-2" @add="add($event)" />
      </v-tab-item>
      <v-tab-item>
        <downtime-project-panel class="mt-2" @add="add($event)" />
      </v-tab-item>
      <v-tab-item>
        <organization-panel class="mt-2" @add="addOrg($event)" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import ReserveItem from './components/_ReserveItem.vue';
import CustomReservePanel from './components/_CustomReservePanel.vue';
import DowntimeProjectPanel from './components/_DowntimeProjectPanel.vue';
import OrganizationPanel from './components/_OrganizationPanel.vue';
import { Reserve, Organization, Pilot } from '@/class';
import _, { Dictionary } from 'lodash';

export default {
  name: 'CCReserveSelector',
  components: {
    ReserveItem,
    CustomReservePanel,
    DowntimeProjectPanel,
    OrganizationPanel,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabModel: 0,
  }),
  computed: {
    reserves(): Dictionary<Reserve[]> {
      return _.groupBy(this.compendium.Reserves, 'Type');
    },
  },
  methods: {
    add(reserve: Reserve): void {
      this.pilot.ReservesController.AddReserve({ ...reserve });
      this.$emit('close');
    },
    addOrg(org: Organization): void {
      this.pilot.ReservesController.AddOrganization({ ...org });
      this.$emit('close');
    },
  },
};
</script>
