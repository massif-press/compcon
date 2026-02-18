<template>
  <v-container :fluid="$vuetify.display.mdAndDown">
    <div class="heading h2">New Character Sheet</div>
    <v-row dense
      class="mt-2">
      <v-col cols="1"
        v-if="!mobile"
        class="text-center">
        <v-icon icon="cc:pilot"
          :color="selectedPilot ? 'success' : 'panel'"
          size="50" />
      </v-col>
      <v-col>
        <cc-panel>
          <cc-titled-divider title="select pilot"
            color="accent">
            <template v-if="mobile"
              #prepend>
              <v-icon icon="cc:pilot"
                :color="selectedPilot ? 'success' : 'panel'" />
            </template>
          </cc-titled-divider>

          <v-row dense
            align="center"
            justify="space-between">
            <v-col cols="12"
              md="">
              <cc-text-field v-model="search"
                color="primary"
                icon="mdi-magnify" />
            </v-col>
            <v-col> <cc-select v-model="group"
                :items="groups"
                color="primary"
                bg-color="panel"
                prepend-inner-icon="mdi-folder"
                prepend-icon="mdi-folder" /></v-col>
          </v-row>
          <div style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden"
            class="mt-2">
            <v-hover v-for="pilot in pilots"
              :key="pilot.ID">
              <template #default="{ isHovering, props }">
                <v-slide-y-transition>
                  <v-row v-if="!selectedPilot || selectedPilot.ID === pilot.ID"
                    v-bind="props"
                    class="mb-2 border-sm"
                    :class="isHovering && !selectedPilot
                      ? 'bg-panel cursor'
                      : selectedPilot && selectedPilot.ID === pilot.ID
                        ? 'bg-primary clipped'
                        : ''
                      "
                    no-gutters
                    @click="setPilot(pilot)"
                    :key="pilot.ID">
                    <v-col cols="auto">
                      <cc-avatar v-if="!mobile && pilot.PortraitController.Avatar"
                        :avatar="pilot.PortraitController.Avatar"
                        size="100" />
                      <cc-img v-else-if="pilot.PortraitController.Portrait"
                        :src="pilot.PortraitController.Portrait"
                        :width="mobile ? '45px' : '100px'"
                        height="100%"
                        color="panel"
                        cover />
                    </v-col>

                    <v-col class="ml-2">
                      <div class="heading">
                        <v-row no-gutters>
                          <v-col>
                            {{ pilot.Callsign }}</v-col><v-col cols="auto"> <v-chip flat
                              size="x-small"
                              tile
                              :color="statusColor(pilot.Status)"
                              class="text-center text-cc-overline"
                              style="letter-spacing: 10px;">
                              {{ pilot.Status }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </div>
                      <div class="text-cc-overline">
                        {{ pilot.Name }}
                        <cc-slashes />
                        LL{{ pilot.Level }}
                      </div>
                      <div class="mt-1"
                        v-if="!mobile">
                        <pilot-list-item-details :pilot="<Pilot>pilot" />
                      </div>


                    </v-col>
                    <v-col cols="auto">
                      <v-icon v-if="selectedPilot"
                        color="error"
                        icon="mdi-close"
                        @click.stop="setPilot(null)" />
                    </v-col>
                  </v-row>
                </v-slide-y-transition>
              </template>
            </v-hover>
          </div>
          <div v-if="!selectedPilot"
            class="d-flex justify-end mt-2">
            <cc-button size="small"
              variant="outlined"
              color="accent"
              prepend-icon="mdi-plus-box"
              @click="$router.push({ name: 'new', params: { groupID: 'no_group' } })">
              Create New Pilot
            </cc-button>
          </div>
        </cc-panel>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <v-row v-if="selectedPilot">
        <v-col v-if="!mobile"
          cols="1"
          class="text-center">
          <v-icon icon="cc:mech"
            :color="selectedMech ? 'success' : 'panel'"
            size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="select active mech"
              color="accent"
              class="mb-1">
              <template v-if="mobile"
                #prepend>
                <v-icon icon="cc:mech"
                  :color="selectedMech ? 'success' : 'panel'" />
              </template>
            </cc-titled-divider>

            <div style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden">
              <v-hover v-for="mech in mechs">
                <template #default="{ isHovering, props }">
                  <v-slide-y-transition>
                    <v-row v-if="!selectedMech || mech.ID === selectedMech.ID"
                      :key="mech.ID"
                      v-bind="props"
                      class="mb-1 pa-1"
                      no-gutters
                      :class="isHovering && !selectedMech
                        ? 'bg-panel cursor'
                        : selectedMech && selectedMech.ID === mech.ID
                          ? 'bg-primary clipped'
                          : ''
                        "
                      dense
                      @click="setMech(mech)">
                      <v-col cols="auto">
                        <cc-img v-if="mech.PortraitController.Portrait"
                          :src="mech.PortraitController.Portrait"
                          :width="mobile ? '45px' : '100px'"
                          height="100%"
                          cover />
                      </v-col>
                      <v-col :class="!mobile ? 'ml-5' : ''">
                        <div class="heading">{{ mech.Name }}</div>
                        <div class="text-cc-overline">
                          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
                        </div>

                        <v-row dense
                          class="text-cc-overline bg-panel my-1"
                          justify="space-around">
                          <v-col cols="auto">
                            <span>
                              STR
                              <b>{{ mech.MaxStructure }}</b>
                            </span>
                          </v-col>

                          <v-col cols="auto">
                            <span>
                              HP
                              <b>{{ mech.MaxHP }}</b>
                            </span>
                          </v-col>

                          <v-col cols="auto">
                            <span>
                              Stress
                              <b>{{ mech.MaxStress }}</b>
                            </span>
                          </v-col>

                          <v-col cols="auto">
                            <span>
                              Heat
                              <b>{{ mech.HeatCapacity }}</b>
                            </span>
                          </v-col>

                          <v-col cols="auto">
                            <span>
                              RepCap
                              <b>{{ mech.RepairCapacity }}</b>
                            </span>
                          </v-col>
                        </v-row>

                        <mech-card-loadout-field :mech="mech" />

                      </v-col>
                      <v-col cols="auto">
                        <v-icon v-if="selectedMech"
                          color="error"
                          icon="mdi-close"
                          @click.stop="setMech(null)" />
                      </v-col>
                    </v-row>
                  </v-slide-y-transition>
                </template>
              </v-hover>
            </div>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="selectedPilot && (selectedMech)">
        <v-col cols="1"
          v-if="!mobile"
          class="text-center">
          <v-icon icon="mdi-checkbox-marked-circle-auto-outline"
            color="success""
            size="
            50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="Confirm"
              color="accent">
              <template v-if="mobile"
                #prepend>
                <v-icon icon="mdi-checkbox-marked-circle-auto-outline"
                  color="success" />
              </template>
            </cc-titled-divider>

            <div class="my-3">
              <div class="text-cc-overline text-disabled">Campaign Name</div>
              <cc-text-field v-model="campaign"
                max-width="600px"
                tooltip="Optional, for organizational purposes."
                color="primary" />
            </div>

            <cc-button block
              color="success"
              prepend-icon="mdi-arrow-right-bold-hexagon-outline"
              @click="createSheet(true)">
              <span>Create and Launch ACtive Mode</span>
            </cc-button>
            <v-row dense
              class="mt-1">
              <v-col cols="3">
                <cc-button block
                  size="small"
                  color="error"
                  :prepend-icon="mobile ? '' : 'mdi-close'"
                  @click="reset()">
                  <span v-if="!mobile">Cancel</span>
                  <v-icon v-else
                    size="47"
                    icon=mdi-close />
                </cc-button>
              </v-col>
              <v-col>
                <cc-button block
                  size="small"
                  color="primary"
                  prepend-icon="mdi-content-save"
                  @click="createSheet(false)">
                  Create and return to library
                </cc-button>
              </v-col>
            </v-row>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>

  </v-container>
</template>

<script lang="ts">
import { Mech, Pilot, PilotGroup } from '@/class';
import MechCardLoadoutField from '@/features/pilot_management/PilotSheet/sections/hangar/components/MechCardLoadoutField.vue';
import PilotListItemDetails from '@/features/pilot_management/Roster/components/_pilotListItemDetails.vue';
import { PilotStore } from '@/stores';

export default {
  name: 'NewSheet',
  components: {
    PilotListItemDetails,
    MechCardLoadoutField,
  },
  data: () => ({
    selectedPilot: null as Pilot | null,
    selectedMech: null as Mech | null,
    confirmed: false,
    search: '',
    group: null,
    campaign: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    groups() {
      let groups = [{ title: 'All Pilots', value: null }];
      return [...groups,
      ...(PilotStore().PilotGroups as PilotGroup[]).map((g: PilotGroup) => ({ title: g.Name, value: g.ID }))
      ];
    },
    pilots() {
      let pilots = PilotStore().Pilots.filter((p) => !p.SaveController.IsDeleted);
      if (this.group) {
        pilots = pilots.filter((p) => PilotStore().PilotGroups.find((g) => g.ID === this.group)?.Pilots.some((gp) => gp.id === p.ID));
      }
      if (this.search) {
        pilots = pilots.filter(
          (p) =>
            p.Callsign.toLowerCase().includes(this.search.toLowerCase()) ||
            p.Name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      return pilots;
    },
    mechs() {
      return this.selectedPilot
        ? this.selectedPilot.Mechs.filter((m) => !m.SaveController.IsDeleted)
        : [];
    },
  },
  methods: {
    setPilot(pilot) {
      this.selectedPilot = pilot;
    },
    setMech(mech) {
      this.selectedMech = mech;
    },
    statusColor(status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
        case 'err':
          return 'error';
        default:
          return 'text';
      }
    },
    async createSheet(launch) {
      if (!this.selectedPilot || !this.selectedMech) return;
      this.selectedPilot.ActiveMech = this.selectedMech;

      await PilotStore().AddPilotSheet(this.selectedPilot as Pilot, this.campaign);
      if (launch) this.$router.push('pilot-runner');
      else this.$router.push('sheet-manager');
    },
    reset() {
      this.selectedPilot = null;
      this.selectedMech = null;
    }
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
