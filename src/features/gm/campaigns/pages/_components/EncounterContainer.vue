<template>
  <v-card v-if="!item?.Data" variant="outlined" color="panel" class="pa-6 ma-2">
    <div class="text-center text-caption text-disabled"><i>No Encounter Selected</i></div>
  </v-card>

  <v-card v-else class="pa-2 ma-2" variant="outlined" color="panel">
    <encounter-content :data="item.Data" />
  </v-card>

  <v-footer height="35">
    <v-menu v-if="item && item.Data" width="40vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" size="x-small" icon class="mt-n1 ml-n3 elevation-0">
          <v-icon
            size="x-large"
            icon="mdi-link-variant"
            :color="isItemLinked ? 'success' : 'rgba(155,155,155,0.5)'" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text v-if="isItemLinked">
          <div>
            This item is currently linked to a Narrative Element in your GM Collection. As
            modifications are made to the linked element, this item will automatically receive
            updates. Click the button to unlink this item from the GM Collection and store it as an
            instanced element in campaign data.
          </div>
          <div class="my-4">
            To re-link this item, select it in the "Set Narrative Element" menu.
          </div>
          <v-btn
            block
            color="error"
            variant="tonal"
            prepend-icon="mdi-link-off"
            @click="item.Unlink()">
            Unlink Element
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <div>
            This item is not linked to a Narrative Element in your GM Collection and will not
            receive automatic updates, but will be saved as a instanced element in campaign data.
          </div>
          <div class="mt-4">
            To link this item to a Narrative Element, select it in the "Set Narrative Element" menu.
          </div>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-spacer />
    <v-btn
      color="accent"
      size="small"
      variant="tonal"
      prepend-icon="cc:encounter"
      class="ml-2"
      @click="encounterDialog = true">
      Set Encounter
    </v-btn>

    <v-dialog v-model="encounterDialog" width="80vw">
      <encounter-selector
        @select="
          addEncounter($event);
          encounterDialog = false;
        "
        @close="encounterDialog = false" />
    </v-dialog>
  </v-footer>
</template>

<script lang="ts">
import { EncounterStore } from '@/stores';
import EncounterSelector from './EncounterSelector.vue';
import EncounterContent from './EncounterContent.vue';

export default {
  name: 'encounter-content-container',
  components: { EncounterSelector, EncounterContent },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    menu: false,
    tab: 0,
    search: '',
    encounterDialog: false,
  }),
  computed: {
    isItemLinked() {
      return (
        this.item.Data &&
        this.item.Data.ID &&
        EncounterStore()
          .Encounters.filter((x) => !x.SaveController.IsDeleted)
          .find((x) => x.ID === this.item.Data.ID)
      );
    },
  },
  methods: {
    addEncounter(encounter) {
      this.item.Data = encounter;
    },
  },
};
</script>
