<template>
  <div>
    <v-row id="scroll" dense style="height: calc(100vh - 185px); overflow-y: scroll">
      <v-col>
        <v-card flat outlined height="100%">
          <v-card-text>
            <player-card v-for="p in players" v-show="p === selected" :key="p.ID" :mech="p" />
            <npc-card v-for="(n, i) in npcs" v-show="n === selected" :key="n.ID + i" :npc="n" />
            <encounter-nav
              v-if="selected"
              :mission="activeMission"
              :encounter="activeMission.Encounter"
              :actor="selected"
              @delete-actor="deleteActor()"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <hr />
    <v-row v-if="actors" dense style="min-height: 100px">
      <v-col cols="11">
        <v-card flat outlined height="100%">
          <v-slide-group
            v-model="selectedActor"
            mandatory
            show-arrows
            center-active
            style="height: calc(100% - 8px)"
          >
            <div style="position: relative">
              <div class="overline font-weight-bold" style="position: absolute; top: -2px">
                TURN PENDING
              </div>
            </div>
            <slide-item v-for="(a, i) in initiative" :key="`i_${a.ID}_${i}`" :actor="a" />
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
            <slide-item v-for="(a, i) in finished" :key="`f_${a.ID}_${i}`" :actor="a" complete />
            <v-divider
              v-if="defeated.length"
              vertical
              class="mx-4"
              style="border-color: darkgrey"
            />
            <div style="position: relative">
              <div
                v-if="defeated.length"
                class="overline font-weight-bold"
                style="position: absolute; top: -2px"
              >
                DEFEATED
              </div>
            </div>
            <slide-item v-for="(a, i) in defeated" :key="`d_${a.ID}_${i}`" :actor="a" defeated />
          </v-slide-group>
        </v-card>
      </v-col>
      <v-col cols="1" class="text-center">
        <div class="heading h3">
          ROUND
          <b class="accent--text">{{ activeMission.Round }}</b>
        </div>
        <v-btn block tile color="primary" @click="stageRoundEnd()">End Round</v-btn>
        <v-divider class="my-2" />
        <v-menu offset-x left>
          <template v-slot:activator="{ on }">
            <v-btn block small color="accent" outlined v-on="on">
              Complete
              <br />
              Encounter
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="text-center font-weight-bold">
              This will conclude the encounter and progress the mission. This can not be undone. Are
              you sure you want to continue?
              <v-divider class="my-2" />
              <v-row dense>
                <v-btn small text>CANCEL</v-btn>
                <v-btn small color="primary" class="ml-auto" @click="$emit('finish')">
                  CONFIRM
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
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
import EncounterNav from '../components/EncounterNav.vue'

export default Vue.extend({
  name: 'encounter-view',
  components: { SlideItem, PlayerCard, NpcCard, EncounterNav },
  props: {
    activeMission: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedActor: null,
  }),
  computed: {
    actors(): IActor[] {
      return this.players.concat(this.npcs)
    },
    players(): IActor[] {
      return this.activeMission.Pilots.map(x => x.ActiveMech)
    },
    npcs(): IActor[] {
      return this.activeMission.ActiveNpcs
    },
    selected(): IActor {
      return this.actors.find(x => x.ID === this.selectedActor)
    },
    initiative() {
      return this.actors.filter(x => x.Activations > 0 && !x.Defeat)
    },
    finished() {
      return this.actors.filter(x => x.Activations === 0 && !x.Defeat)
    },
    defeated() {
      return this.actors.filter(x => x.Defeat)
    },
  },
  watch: {
    selectedActor() {
      document.getElementById('scroll').scrollTop = 0
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
      this.activeMission.Round++
    },
    deleteActor() {
      if (this.isPlayer(this.selected)) {
        this.activeMission.RemovePilot(this.selected)
      } else {
        this.activeMission.RemoveActiveNpc(this.selected)
      }
    },
  },
})
</script>
