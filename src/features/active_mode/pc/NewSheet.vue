<template>
  <v-container>
    <cc-alert>info about character sheets</cc-alert>
    <v-row dense class="mt-4">
      <v-col cols="1" class="text-center">
        <v-icon icon="cc:pilot" :color="selectedPilot ? 'success' : 'panel'" size="50" />
      </v-col>
      <v-col>
        <cc-panel>
          <cc-titled-divider title="select pilot" color="accent" />
          <v-row dense align="center" justify="space-between">
            <v-col>
              <cc-text-field v-model="search" color="primary" icon="mdi-magnify" />
            </v-col>
            <v-col>sort by: name - ll - created - updated</v-col>
          </v-row>
          <div style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden" class="mt-2">
            <v-hover v-for="pilot in pilots" :key="pilot.ID">
              <template #default="{ isHovering, props }">
                <v-slide-y-transition>
                  <v-row
                    v-if="!selectedPilot || selectedPilot.ID === pilot.ID"
                    v-bind="props"
                    class="mb-1 pa-1"
                    :class="
                      isHovering && !selectedPilot
                        ? 'bg-panel cursor'
                        : selectedPilot && selectedPilot.ID === pilot.ID
                          ? 'bg-primary clipped'
                          : ''
                    "
                    no-gutters
                    @click="setPilot(pilot)"
                    :key="pilot.ID">
                    <v-col cols="auto">
                      <cc-avatar
                        v-if="pilot.PortraitController.Avatar"
                        :avatar="pilot.PortraitController.Avatar"
                        :size="mobile ? 40 : 75" />
                      <cc-img
                        v-else-if="pilot.PortraitController.Portrait"
                        :src="pilot.PortraitController.Portrait"
                        aspect-ratio="1"
                        position="top center"
                        :height="mobile ? '40px' : '75px'"
                        :width="mobile ? '40px' : '75px'" />
                    </v-col>
                    <v-col class="ml-2">
                      <div class="heading">{{ pilot.Callsign }}</div>
                      <div class="text-cc-overline">
                        {{ pilot.Name }}
                        <cc-slashes />
                        LL{{ pilot.Level }}
                      </div>
                      <div>
                        additional info about the pilot, like traits, skills, available mechs, etc.
                      </div>
                    </v-col>
                    <v-col cols="auto">
                      <v-icon
                        v-if="selectedPilot"
                        color="error"
                        icon="mdi-close"
                        @click.stop="setPilot(null)" />
                    </v-col>
                  </v-row>
                </v-slide-y-transition>
              </template>
            </v-hover>
          </div>
          <div v-if="!selectedPilot" class="d-flex justify-end mt-2">
            <cc-button size="small" variant="outlined" color="accent" prepend-icon="mdi-plus-box">
              Create New Pilot
            </cc-button>
          </div>
        </cc-panel>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <v-row v-if="selectedPilot">
        <v-col cols="1" class="text-center">
          <v-icon icon="cc:mech" :color="selectedMech ? 'success' : 'panel'" size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="select active mech" color="accent" class="mb-1" />
            <div style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden">
              <v-hover v-for="mech in mechs">
                <template #default="{ isHovering, props }">
                  <v-slide-y-transition>
                    <v-row
                      v-if="!selectedMech || mech.ID === selectedMech.ID"
                      :key="mech.ID"
                      v-bind="props"
                      class="mb-1 pa-1"
                      no-gutters
                      :class="
                        isHovering && !selectedMech
                          ? 'bg-panel cursor'
                          : selectedMech && selectedMech.ID === mech.ID
                            ? 'bg-primary clipped'
                            : ''
                      "
                      dense
                      @click="setMech(mech)">
                      <v-col cols="auto">
                        <cc-avatar
                          v-if="mech.PortraitController.Avatar"
                          :avatar="mech.PortraitController.Avatar"
                          :size="mobile ? 40 : 75" />
                        <cc-img
                          v-else-if="mech.PortraitController.Portrait"
                          :src="mech.PortraitController.Portrait"
                          aspect-ratio="1"
                          cover
                          position="top center"
                          :height="mobile ? '40px' : '75px'"
                          :width="mobile ? '40px' : '75px'" />
                      </v-col>
                      <v-col class="ml-2">
                        <div class="heading">{{ mech.Name }}</div>
                        <div class="text-cc-overline">
                          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
                        </div>
                        <div>additional info about the mech</div>
                      </v-col>
                      <v-col cols="auto">
                        <v-icon
                          v-if="selectedMech"
                          color="error"
                          icon="mdi-close"
                          @click.stop="setMech(null)" />
                      </v-col>
                    </v-row>
                  </v-slide-y-transition>
                </template>
              </v-hover>
            </div>
            <div v-if="!selectedMech" class="d-flex justify-end mt-2">
              <cc-button size="small" variant="outlined" color="accent" prepend-icon="mdi-plus-box">
                Add New Mech
              </cc-button>
              <cc-button
                size="small"
                variant="outlined"
                color="accent"
                prepend-icon="mdi-cancel"
                class="ml-2">
                Skip Selection
              </cc-button>
            </div>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="selectedPilot && (skipMech || selectedMech)">
        <v-col cols="1" class="text-center">
          <v-icon
            icon="mdi-checkbox-marked-circle-auto-outline"
            :color="confirmed ? 'success' : 'panel'"
            size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="Overview" color="accent" />
            pilot stats and info
            <br />
            mech stats and info
            <br />
            mech loadout
            <br />
            <cc-button
              class="my-2+"
              block
              size="small"
              color="success"
              prepend-icon="mdi-check-circle-outline"
              append-icon="mdi-chevron-triple-right"
              @click="confirmed = true">
              Confirm Selection
              <template #subtitle>
                <div class="text-cc-overline">
                  Pilot {{ selectedPilot.Callsign }} // active mech info
                </div>
              </template>
            </cc-button>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="confirmed">
        <v-col cols="1" class="text-center">
          <v-icon icon="cc:squad" :color="confirmed ? 'success' : 'panel'" size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            select table or local sheet
            <br />
            cancel and return to sheet manager
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { PilotStore } from '@/stores';

export default {
  name: 'NewSheet',
  data: () => ({
    selectedPilot: null,
    selectedMech: null,
    confirmed: false,
    search: '',
    skipMech: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    pilots() {
      const pilots = PilotStore().Pilots.filter((p) => !p.SaveController.IsDeleted);
      if (this.search) {
        return pilots.filter(
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
  },
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
