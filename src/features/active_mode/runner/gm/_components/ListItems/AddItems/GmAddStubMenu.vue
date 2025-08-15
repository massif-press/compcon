<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-receipt-text-edit"
        @click="props.onClick($event)">
        Add Placeholder
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat color="primary" height="40">
          <div class="heading h3 px-4">Add Placeholder</div>
          <v-spacer />
          <v-btn flat tile icon @click="isActive.value = false">
            <v-icon icon="mdi-close" class="white--text" />
          </v-btn>
        </v-toolbar>
        <cc-alert
          type="info"
          class="ma-4"
          icon="mdi-information-outline"
          title="What is a Placeholder?">
          Placeholders are ad-hoc stat containers used to track entities within an encounter that
          aren't in your COMP/CON roster, or, can't be represented within COMP/CON. They can be used
          for PCs, NPCs, complex encounter elements, environmental hazards, and so forth.
          <strong>Placeholders do not persist outside of the encounter they are created in.</strong>
          <br />
        </cc-alert>
        <v-card-text>
          <cc-select
            v-model="newPlaceholder.type"
            :items="[
              { title: 'PC', value: 'pilot' },
              { title: 'NPC', value: 'npc' },
              { title: 'Other', value: 'other' },
            ]"
            label="Type"
            chip-variant="text"
            class="mb-4" />
          <cc-select
            v-model="newPlaceholder.side"
            :items="[
              { title: 'Ally', value: 'ally' },
              { title: 'Enemy', value: 'enemy' },
              { title: 'Neutral', value: 'neutral' },
            ]"
            label="Side"
            chip-variant="text"
            class="mb-4" />
          <div class="mb-4">
            <cc-text-field v-model="newPlaceholder.name" label="Name" />
          </div>

          <v-fade-transition>
            <cc-text-field
              v-if="newPlaceholder.type === 'pilot'"
              v-model="newPlaceholder.Mechname"
              label="Mech Name" />
          </v-fade-transition>

          <cc-text-area
            v-model="newPlaceholder.notes"
            label="Notes"
            rows="3"
            auto-grow
            class="mt-4" />
        </v-card-text>
        <div class="d-flex mb-2 mx-4">
          <v-spacer />
          <v-btn
            flat
            tile
            prepend-icon="mdi-plus"
            color="primary"
            :disabled="!newPlaceholder.name"
            @click="
              add();
              isActive.value = false;
            ">
            Add Placeholder
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { Placeholder } from '@/classes/encounter/Placeholder';
import _ from 'lodash';

export default {
  name: 'GmAddStubMenu',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    newPlaceholder: {
      name: '',
      type: 'NPC',
      side: 'enemy',
      Mechname: '',
      notes: '',
    },
  }),
  methods: {
    add() {
      const ph = new Placeholder({
        id: _.uniqueId('placeholder-'),
        name: this.newPlaceholder.name,
        type: this.newPlaceholder.type,
        side: this.newPlaceholder.side,
        Mechname: this.newPlaceholder.Mechname,
        notes: this.newPlaceholder.notes,
      });

      this.encounterInstance.Combatants.push({
        id: ph.ID,
        index: -1,
        number: -1,
        type: 'placeholder',
        side: ph.Side,
        actor: ph,
        deployables: [],
      });

      this.encounterInstance.Placeholders.push(ph);
    },
  },
};
</script>
