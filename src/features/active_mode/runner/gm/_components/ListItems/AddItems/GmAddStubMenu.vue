<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-receipt-text-edit"
        @click="props.onClick($event)">
        {{ $t('active.addStub.addPlaceholder') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat
          color="primary"
          height="40">
          <div class="heading h3 px-4">{{ $t('active.addStub.addPlaceholder') }}</div>
          <v-spacer />
          <v-btn flat
            tile
            icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close"
              class="white--text" />
          </v-btn>
        </v-toolbar>
        <cc-alert type="info"
          class="ma-4"
          icon="mdi-information-outline"
          :title="$t('active.titles.whatIsAPlaceholder')">
          <i18n-t keypath="active.addStub.description"
            tag="span"
            scope="global">
            <template #emphasis><strong>{{ $t('active.addStub.noPersist') }}</strong></template>
          </i18n-t>
          <br />
        </cc-alert>
        <v-card-text>
          <cc-select v-model="newPlaceholder.type"
            :items="[
              { title: 'PC', value: 'pilot' },
              { title: 'NPC', value: 'npc' },
              { title: 'Other', value: 'other' },
            ]"
            :label="$t('common.type')"
            chip-variant="text"
            class="mb-4" />
          <cc-select v-model="newPlaceholder.side"
            :items="[
              { title: 'Ally', value: 'ally' },
              { title: 'Enemy', value: 'enemy' },
              { title: 'Neutral', value: 'neutral' },
            ]"
            :label="$t('common.side')"
            chip-variant="text"
            class="mb-4" />
          <div class="mb-4">
            <cc-text-field v-model="newPlaceholder.name"
              :label="$t('common.name')" />
          </div>

          <v-fade-transition>
            <cc-text-field v-if="newPlaceholder.type === 'pilot'"
              v-model="newPlaceholder.Mechname"
              :label="$t('active.fields.mechName')" />
          </v-fade-transition>

          <cc-text-area v-model="newPlaceholder.notes"
            :label="$t('common.notes')"
            rows="3"
            auto-grow
            class="mt-4" />
        </v-card-text>
        <div class="d-flex mb-2 mx-4">
          <v-spacer />
          <v-btn flat
            tile
            prepend-icon="mdi-plus"
            color="primary"
            :disabled="canAdd"
            @click="
              add();
            isActive.value = false;
            ">
            {{ $t('active.addStub.addPlaceholder') }}
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref } from 'vue'
import { Placeholder } from '@/classes/encounter/Placeholder';
import * as _ from 'lodash-es';

const props = defineProps<{
  encounterInstance: EncounterInstance
}>()

const newPlaceholder = ref({
      name: '',
      type: 'NPC',
      side: 'enemy',
      Mechname: '',
      notes: '',
    })

const canAdd = computed(() => {
      if (newPlaceholder.value.type === 'pilot') {
        return !newPlaceholder.value.name.trim().length || !newPlaceholder.value.Mechname.trim().length;
      }
      return !newPlaceholder.value.name.trim().length;
    })

function add() {
      const ph = new Placeholder({
        id: _.uniqueId('placeholder-'),
        name: newPlaceholder.value.name,
        type: newPlaceholder.value.type,
        side: newPlaceholder.value.side,
        Mechname: newPlaceholder.value.Mechname,
        notes: newPlaceholder.value.notes,
      });

      props.encounterInstance.Combatants.push({
        id: ph.ID,
        index: -1,
        number: -1,
        type: 'placeholder',
        side: ph.Side,
        actor: ph,
        deployables: [],
      });
    }
</script>
