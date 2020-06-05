<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <cc-nav-item v-if="actor.Activations > 0" @clicked="actor.Activations -= 1">
      <cc-tooltip simple content="End Turn">
        <v-icon size="50" color="white" class="end-turn mt-n2 pl-n2">
          cci-activate
        </v-icon>
      </cc-tooltip>
    </cc-nav-item>
    <div v-if="actor.Activations > 0" id="divider-2" />
    <cc-nav-item @clicked="noteSheet = true">
      <cc-tooltip simple content="GM Notepad">
        <v-icon>mdi-note</v-icon>
      </cc-tooltip>
    </cc-nav-item>
    <cc-nav-item @clicked="$refs.infoDialog.show()">
      <cc-tooltip simple content="Encounter Information">
        <v-icon>mdi-map</v-icon>
      </cc-tooltip>
    </cc-nav-item>
    <cc-nav-item @clicked="$refs.reinforcementDialog.show()">
      <cc-tooltip simple content="Reinforcements">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </cc-tooltip>
    </cc-nav-item>
    <div id="divider" />
    <cc-nav-item>
      <v-menu v-if="actor" offset-y top>
        <template v-slot:activator="{ on }">
          <v-icon large color="white" v-on="on">
            {{ actor.Frame ? 'cci-pilot' : actor.Class.RoleIcon }}
          </v-icon>
        </template>
        <v-list dense>
          <v-list-item v-if="!actor.Defeated" @click="reactionDialog = true">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon>cci-reaction</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Stage Custom Reaction</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!actor.Defeated" @click="removeDialog = true">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon>mdi-close</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove from Battle</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="repairDialog = true">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon>cci-repair</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Full Repair</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item @click="deleteDialog = true">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Delete from Encounter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog v-model="reactionDialog" width="50%">
        <cc-titled-panel title="Stage Reaction">
          <v-text-field v-model="reaction" label="Reaction" outlined hide-details />
          <v-btn block large tile color="secondary" :disabled="!reaction" @click="react()">
            Stage Reaction: {{ reaction }}
          </v-btn>
        </cc-titled-panel>
      </v-dialog>
      <v-dialog v-model="removeDialog" width="50%">
        <cc-titled-panel title="Remove Actor from Battlefield">
          <v-combobox v-model="reason" label="Reason" :items="remove" outlined hide-details />
          <v-btn block large tile color="secondary" :disabled="!reason" @click="removeActor()">
            Remove from Battle ({{ reason ? reason : ' . . . ' }})
          </v-btn>
        </cc-titled-panel>
      </v-dialog>
      <v-dialog v-model="repairDialog" width="50%">
        <cc-titled-panel title="WARNING: Full Repair">
          This will restore the selected actor to a fully-repaired and refreshed state. Any current
          stat or damage tracking will be lost. This will also return the actor to the battlefield,
          if it had been removed. Are you sure you want to continue?
          <v-btn block large tile color="success darken-1" @click="repair()">
            Confirm Full Repair
          </v-btn>
        </cc-titled-panel>
      </v-dialog>
      <v-dialog v-model="deleteDialog" width="50%">
        <cc-titled-panel title="WARNING: Delete Actor">
          Deleting this actor will remove it permanently from this mission. Any stat or record
          tracking for this entity will be lost. Are you sure you want to continue?
          <v-btn block large tile color="error" class="mb-2" @click="deleteActor()">
            Confirm Deletion
          </v-btn>
        </cc-titled-panel>
      </v-dialog>
    </cc-nav-item>
    <cc-solo-dialog ref="infoDialog" icon="mdi-map" no-confirm title="Mission Information" large>
      <info-modal :mission="mission.Mission" :encounter="encounter" :step="mission.Step" />
    </cc-solo-dialog>
    <v-bottom-sheet v-model="noteSheet">
      <v-sheet class="text-center" height="35vh">
        <div class="primary white--text heading h3">GM NOTES</div>
        <v-textarea
          v-model="mission.Note"
          filled
          dense
          autofocus
          no-resize
          rows="13"
          class="mx-2"
        />
      </v-sheet>
    </v-bottom-sheet>
    <cc-solo-dialog
      ref="reinforcementDialog"
      icon="mdi-plus-circle-outline"
      no-confirm
      title="Encounter Reinforcements"
      large
    >
      <reinforcements-modal :mission="mission" :encounter="encounter" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfoModal from './InfoModal.vue'
import ReinforcementsModal from './ReinforcementsModal.vue'

export default Vue.extend({
  name: 'encounter-nav',
  components: { InfoModal, ReinforcementsModal },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
    mission: {
      type: Object,
      required: true,
    },
    actor: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    reaction: '',
    reason: '',
    remove: ['Destroyed', 'Routed', 'Escaped', 'Retreated'],
    reactionDialog: false,
    removeDialog: false,
    repairDialog: false,
    deleteDialog: false,
    reinforcementDialog: false,
    noteSheet: false,
  }),
  methods: {
    react() {
      this.actor.AddReaction(this.reaction)
      this.reaction = ''
      this.close()
    },
    removeActor() {
      this.actor.Defeat = this.reason
      this.reason = ''
      this.close()
    },
    repair() {
      this.actor.FullRepair()
      this.close()
    },
    deleteActor() {
      this.$emit('delete-actor')
      this.close()
    },
    close() {
      this.reactionDialog = false
      this.removeDialog = false
      this.repairDialog = false
      this.deleteDialog = false
    },
  },
})
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 140px;
  right: -70px;
  min-height: 40px;
  padding: 5px 80px 5px 20px;
  transform: skew(-0.65rad);
  background-color: var(--v-primary-base);
  color: white;
  z-index: 10;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 47px;
  right: 150px;
  top: 0;
  z-index: 11;
  background-color: white;
  opacity: 0.5;
  position: absolute;
}

#divider-2 {
  width: 2px;
  min-width: 2px;
  height: 47px;
  right: 350px;
  top: 0;
  z-index: 11;
  background-color: white;
  opacity: 0.5;
  position: absolute;
}

.unskew {
  transform: skew(0.65rad);
}

.end-turn {
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
}

.end-turn:hover {
  text-shadow: 1px 1px 10px #fff, 1px 1px 10px #ccc;
}
</style>
