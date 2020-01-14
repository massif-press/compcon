<template>
  <div>
    <v-menu offset-x right>
      <template v-slot:activator="{ on }">
        <v-btn large icon v-on="on">
          <v-icon large>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-if="!defeated" @click="reactionDialog = true">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-redo-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Stage Custom Reaction</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!defeated" @click="removeDialog = true">
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
        <v-btn
          block
          large
          tile
          color="secondary"
          :disabled="!reaction"
          @click="emit('stage-reaction', reaction)"
        >
          Stage Reaction: {{ reaction }}
        </v-btn>
      </cc-titled-panel>
    </v-dialog>
    <v-dialog v-model="removeDialog" width="50%">
      <cc-titled-panel title="Remove Actor from Battlefield">
        <v-combobox v-model="reason" label="Reason" :items="remove" outlined hide-details />
        <v-btn
          block
          large
          tile
          color="secondary"
          :disabled="!reason"
          @click="emit('remove', reason)"
        >
          Remove from Battle ({{ reason ? reason : ' . . . ' }})
        </v-btn>
      </cc-titled-panel>
    </v-dialog>
    <v-dialog v-model="repairDialog" width="50%">
      <cc-titled-panel title="WARNING: Full Repair">
        This will restore the selected actor to a fully-repaired and refreshed state. Any current
        stat or damage tracking will be lost. This will also return the actor to the battlefield, if
        it had been removed. Are you sure you want to continue?
        <v-btn block large tile color="success darken-1" @click="emit('repair')">
          Confirm Full Repair
        </v-btn>
      </cc-titled-panel>
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="50%">
      <cc-titled-panel title="WARNING: Delete Actor">
        Deleting this actor will remove it permanently from this mission. Any stat or record
        tracking for this entity will be lost. Are you sure you want to continue?
        <v-btn block large tile color="error" @click="emit('delete-actor')">
          Confirm Deletion
        </v-btn>
      </cc-titled-panel>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'card-options-menu',
  props: {
    defeated: {
      type: Boolean,
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
  }),
  methods: {
    emit(event: string, data: any) {
      this.$emit(event, data)
      this.reactionDialog = false
      this.removeDialog = false
      this.repairDialog = false
      this.deleteDialog = false
    },
  },
})
</script>
