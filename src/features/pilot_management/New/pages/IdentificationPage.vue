<template>
  <stepper-content :complete="pilot.HasIdent"
    mandatory
    exit="../pilot_management"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pm.new.newPilotRegistration') }}</cc-title>
    <div class="heading h2">
      {{ $t('pm.new.uadIDENTService') }}
      <cc-slashes />
      {{ $t('pm.new.rm4PersonnelPilotC') }}
    </div>
    <p class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.new.welcomeToTheUnionAdministrativeDepartment') }}
    </p>
    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2">
      <div class="heading">
        {{ $t('pm.new.allFieldsMarkedWithThe') }}
        <v-icon color="error"
          size="small"
          class="mt-n1">mdi-alert</v-icon>
        {{ $t('pm.new.glyphMustBePopulated') }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pm.new.bySubmittingThisFormYouAttest') }}
      </p>
    </v-alert>

    <v-row dense>
      <v-col cols="12"
        md="5"
        class="mr-auto">
        <div class="my-2">
          <div v-if="!mobile"
            class="text-caption">{{ $t('pm.new.rm401FULLNAMEOR') }}</div>
          <div v-else
            class="text-caption">{{ $t('pm.new.pilotNAME') }}</div>
          <cc-text-field v-model="pilot.Name"
            variant="outlined"
            placeholder="Name"
            :icon="pilot.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Name ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                tooltip="Generate random name"
                @click="randomName()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pm.new.rm402APPROVEDCALLSIGNOR') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pm.new.callsign') }}</div>
          <cc-text-field v-model="pilot.Callsign"
            variant="outlined"
            placeholder="Callsign"
            :icon="pilot.Callsign ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Callsign ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                tooltip="Generate random callsign"
                @click="randomCallsign()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pm.new.rm403PRIOROCCUPATIONOR') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pm.new.background') }}</div>
          <cc-text-field v-model="pilot.Background"
            variant="outlined"
            placeholder="Background"
            :icon="pilot.Background ? 'mdi-check-circle-outline' : 'mdi-circle-outline'"
            :color="pilot.Background ? 'success' : 'light-panel'"
            class="my-1 d-inline">
            <template #extra>
              <v-tooltip text="Select Predefined Background">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <background-selector
                      @select="$emit('set', { attr: 'Background', val: $event })" />
                  </span>
                </template>
              </v-tooltip>
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pm.new.rm404ATTACHEDBIOGRAPHICALDOSSIER') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pm.new.biography') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.History ? 'light-panel' : 'success'"
                @click="bioDialog = true">
                <div v-if="!pilot.History">{{ $t('pm.new.addPilotBiography') }}</div>
                <div v-else>{{ $t('pm.new.editPilotBiography') }}</div>
                <CCTextEditorDialog v-model="bioDialog"
                  title="Edit Pilot Biography"
                  :original="pilot.History"
                  @save="$emit('set', { attr: 'History', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto"
              class="ml-2">
              <v-icon v-if="!pilot.History"
                color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else
                color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pm.new.rm405ATTACHEDOHMHEALTH') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pm.new.appearance') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.TextAppearance ? 'light-panel' : 'success'"
                @click="appearanceDialog = true">
                <div v-if="!pilot.TextAppearance">{{ $t('pm.new.addPilotDescription') }}</div>
                <div v-else>{{ $t('pm.new.editPilotDescription') }}</div>
                <CCTextEditorDialog v-model="appearanceDialog"
                  title="edit Pilot Description"
                  :original="pilot.TextAppearance"
                  @save="$emit('set', { attr: 'TextAppearance', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto"
              class="ml-2">
              <v-icon v-if="!pilot.TextAppearance"
                color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else
                color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pm.new.rm4EXTERNALLICENSEDATATRANSFER') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pm.new.startingLL') }}</div>
          <cc-number-field v-model.number="pilot.Level"
            type="number"
            label="Starting License Level"
            :max="12"
            :min="0"
            :color="pilot.Level ? 'warning' : 'success'"
            tooltip="Start this Pilot at a specific license level. Recommended for advanced users."
            tooltip-icon="mdi-alert"
            class="my-1 d-inline" />
        </div>
      </v-col>
      <v-col cols="12"
        md="auto"
        class="mx-auto mt-2"
        style="max-width: 325px">
        <div v-if="!mobile"
          class="text-caption">
          {{ $t('pm.new.rm406ATTACHEDOHMIMAGING') }}
          <div class="mt-n1 text-disabled">{{ $t('pm.new.mustINCLUDERETINALDATA') }}</div>
        </div>
        <div class="border mr-8 ml-auto mr-auto"
          style="width: 300px; height: 300px">
          <cc-img v-if="pilot.Portrait"
            :src="pilot.Portrait"
            aspect-ratio="1" />
        </div>
        <div class="mt-3">
          <cc-modal title="set pilot portrait"
            icon="cc:pilot">
            <template #activator="{ open }">
              <cc-button block
                size="small"
                :color="pilot.Portrait ? 'success' : 'panel'"
                :append-icon="pilot.Portrait ? '' : 'mdi-check-circle-outline'"
                :prepend-icon="pilot.Portrait ? 'mdi-circle-edit-outline' : 'mdi-plus'"
                @click="open">
                {{ pilot.Portrait ? $t('pm.new.editPilotImage') : $t('pm.new.addPilotImage') }}
              </cc-button>
            </template>
            <cc-image-selector ref="imageSelector"
              :item="pilot"
              type="pilot"
              avatar />
          </cc-modal>
        </div>
      </v-col>
    </v-row>
    <v-row dense
      class="text-center my-6 pt-2 pb-1 px-3 bg-surface">
      <v-col cols="12"
        sm="6">
        <cc-button size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="savePilot">
          {{ $t('pm.new.skipNewPilotRegistration') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pm.new.recommendedForAdvancedUsers') }}</i></div>
      </v-col>
      <v-spacer />
      <v-col cols="12"
        sm="6">
        <cc-button size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="$emit('templates')">
          {{ $t('pm.new.selectCharacterTemplate') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pm.new.recommendedForNewPlayers') }}</i></div>
      </v-col>
    </v-row>
  </stepper-content>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CCTextEditorDialog from '@/ui/components/CCTextEditorDialog.vue'
import { PilotStore } from '@/stores';
import StepperContent from '../../_components/StepperContent.vue';
import BackgroundSelector from '../../_components/selectors/BackgroundSelector.vue';
import { name, callsign } from '@/io/Generators';
import { Pilot } from '@/classes/pilot/Pilot'
import { useDisplay } from 'vuetify';

defineOptions({ name: 'identification-page' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  pilot: Pilot
  groupID?: string
}>()

const emit = defineEmits<{
  'set': []
  'templates': []
  'next': []
  'done': []
}>()

const imageSelector = ref<any>(null)

const bioDialog = ref(false)
const appearanceDialog = ref(false)

async function randomCallsign() {
      const generatedCallsign = await callsign();
      emit('set', { attr: 'Callsign', val: generatedCallsign });
      _forceUpdate();
    }
async function randomName() {
      const generatedName = await name();
      emit('set', { attr: 'Name', val: generatedName });
      _forceUpdate();
    }
async function savePilot() {
      props.pilot.Callsign = props.pilot.Callsign;
      props.pilot.Name = props.pilot.Name;
      PilotStore().AddPilot(props.pilot as Pilot, props.groupID);
      await emit('done');
    }
</script>
