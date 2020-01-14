<template>
  <div>
    <v-row dense style="height: calc(100vh - 185px); overflow-y: scroll">
      <v-col>
        <v-card flat outlined height="100%">
          <v-card-text>
            <player-card v-if="selected && isPlayer(selected)" :mech="selected" />
            <npc-card v-else-if="selected" :npc="selected" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <hr />
    <v-row dense style="min-height: 100px">
      <v-col cols="11">
        <v-card flat outlined height="100%">
          <v-slide-group
            v-model="selectedActor"
            mandatory
            active-class="success"
            show-arrows
            style="height: calc(100% - 8px)"
          >
            <div style="position: relative">
              <div class="overline font-weight-bold" style="position: absolute; top: -2px">
                TURN PENDING
              </div>
            </div>
            <slide-item v-for="a in initiative" :key="a.ID" :actor="a" />
            <v-divider
              v-if="finished.length"
              vertical
              class="mx-4"
              style="border-color: darkgrey"
            />
            <div style="position: relative">
              <div
                v-if="finished.length"
                class="overline font-weight-bold"
                style="position: absolute; top: -2px"
              >
                TURN COMPLETE
              </div>
            </div>
            <slide-item v-for="a in finished" :key="a.ID" :actor="a" complete />
            <v-divider
              v-if="destroyed.length"
              vertical
              class="mx-4"
              style="border-color: darkgrey"
            />
            <div style="position: relative">
              <div
                v-if="destroyed.length"
                class="overline font-weight-bold"
                style="position: absolute; top: -2px"
              >
                DESTROYED
              </div>
            </div>
            <slide-item v-for="a in destroyed" :key="a.ID" :actor="a" destroyed />
          </v-slide-group>
        </v-card>
      </v-col>
      <v-col cols="1" class="text-center">
        <div class="heading h3">
          ROUND
          <b class="primary--text">{{ encounter.Round }}</b>
        </div>
        <v-btn block tile color="primary" @click="stageRoundEnd()">End Round</v-btn>
        <v-divider class="my-2" />
        <v-btn block small color="primary" outlined>
          Complete
          <br />
          Encounter
        </v-btn>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="endConfirmDialog" title="Confirm End Round" @confirm="commitRoundEnd()">
      <div class="flavor-text my-2">The following actors still have activations remaining:</div>
      <div v-for="a in initiative" :key="`diag_${a.ID}`" class="heading h3 text--text">
        <v-icon left>{{ a.Icon }}</v-icon>
        {{ a.EncounterName }}
      </div>
      <div class="flavor-text my-2">
        Ending this round will cause these actors to lose their unspent activations. Continue?
      </div>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SlideItem from '../components/SlideItem.vue'
import PlayerCard from '../components/PlayerCard.vue'
import NpcCard from '../components/NpcCard.vue'

export default Vue.extend({
  name: 'encounter-view',
  components: { SlideItem, PlayerCard, NpcCard },
  props: {
    activeMission: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedActor: null,
  }),
  computed: {
    actors(): IActor[] {
      return this.activeMission.Pilots.map(x => x.ActiveMech).concat(
        this.encounter.Npcs
      ) as IActor[]
    },
    selected(): IActor {
      return this.actors.find(x => x.ID === this.selectedActor)
    },
    initiative() {
      return this.actors.filter(x => x.Activations > 0 && !x.Destroyed)
    },
    finished() {
      return this.actors.filter(x => x.Activations === 0 && !x.Destroyed)
    },
    destroyed() {
      return this.actors.filter(x => x.Destroyed)
    },
  },
  methods: {
    isPlayer(a: any) {
      return !!a.Frame
    },
    stageRoundEnd() {
      if (this.initiative.length) {
        this.$refs.endConfirmDialog.show()
      } else this.commitRoundEnd()
    },
    commitRoundEnd() {
      this.finished.forEach((a: IActor) => {
        a.NewTurn()
      })
      this.encounter.Round++
    },
  },
})
</script>
