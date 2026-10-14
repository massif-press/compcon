<template>
  <stepper-content
    :complete="pilot.HasIdent"
    mandatory
    exit="../pilot_management"
    @complete="$emit('next')"
  >
    <cc-title offset>{{ $t('pm.new.newPilotRegistration') }}</cc-title>
    <div class="heading h2">
      {{ $t('pm.new.identServiceName') }}
      <cc-slashes />
      {{ $t('pm.new.rm4PersonnelPilotC') }}
    </div>
    <p
      class="flavor-text"
      style="font-size: 14px"
    >
      {{ $t('pm.new.identWelcome') }}
    </p>
    <v-alert
      color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
    >
      <div class="heading">
        {{ $t('pm.new.allFieldsMarkedWithThe') }}
        <v-icon
          color="error"
          size="small"
          class="mt-n1"
        >
          mdi-alert
        </v-icon>
        {{ $t('pm.new.glyphMustBePopulated') }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pm.new.attestation') }}
      </p>
    </v-alert>

    <v-row dense>
      <v-col
        cols="12"
        md="5"
        class="mr-auto"
      >
        <div class="my-2">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldName') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('pm.new.pilotName') }}
          </div>
          <cc-text-field
            v-model="pilot.Name"
            variant="outlined"
            :placeholder="$t('common.name')"
            :icon="pilot.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Name ? 'success' : 'error'"
            class="my-1 d-inline"
          >
            <template #extra>
              <cc-button
                icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pm.shared.generateRandomName')"
                @click="randomName()"
              />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldCallsign') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('common.callsign') }}
          </div>
          <cc-text-field
            v-model="pilot.Callsign"
            variant="outlined"
            :placeholder="$t('common.callsign')"
            :icon="pilot.Callsign ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Callsign ? 'success' : 'error'"
            class="my-1 d-inline"
          >
            <template #extra>
              <cc-button
                icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pm.identificationPage.generateRandomCallsign')"
                @click="randomCallsign()"
              />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldBackground') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('common.background') }}
          </div>
          <cc-text-field
            v-model="pilot.Background"
            variant="outlined"
            :placeholder="$t('common.background')"
            :icon="pilot.Background ? 'mdi-check-circle-outline' : 'mdi-circle-outline'"
            :color="pilot.Background ? 'success' : 'light-panel'"
            class="my-1 d-inline"
          >
            <template #extra>
              <v-tooltip :text="$t('pm.identificationPage.selectPredefinedBackground')">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <background-selector
                      @select="$emit('set', { attr: 'Background', val: $event })"
                    />
                  </span>
                </template>
              </v-tooltip>
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldBiography') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('pm.new.biography') }}
          </div>
          <v-row
            align="center"
            dense
          >
            <v-col>
              <cc-button
                block
                size="small"
                :color="!pilot.History ? 'light-panel' : 'success'"
                @click="bioDialog = true"
              >
                <div v-if="!pilot.History">{{ $t('pm.new.addPilotBiography') }}</div>
                <div v-else>{{ $t('pm.new.editPilotBiography') }}</div>
                <CCTextEditorDialog
                  v-model="bioDialog"
                  :title="$t('pm.new.editPilotBiography')"
                  :original="pilot.History"
                  @save="$emit('set', { attr: 'History', val: $event })"
                />
              </cc-button>
            </v-col>
            <v-col
              cols="auto"
              class="ml-2"
            >
              <v-icon
                v-if="!pilot.History"
                color="grey"
              >
                mdi-circle-outline
              </v-icon>
              <v-icon
                v-else
                color="success"
              >
                mdi-check-circle-outline
              </v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldHealthResults') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('pm.new.appearance') }}
          </div>
          <v-row
            align="center"
            dense
          >
            <v-col>
              <cc-button
                block
                size="small"
                :color="!pilot.TextAppearance ? 'light-panel' : 'success'"
                @click="appearanceDialog = true"
              >
                <div v-if="!pilot.TextAppearance">{{ $t('pm.new.addPilotDescription') }}</div>
                <div v-else>{{ $t('pm.identificationPage.editPilotDescription') }}</div>
                <CCTextEditorDialog
                  v-model="appearanceDialog"
                  :title="$t('pm.identificationPage.editPilotDescription')"
                  :original="pilot.TextAppearance"
                  @save="$emit('set', { attr: 'TextAppearance', val: $event })"
                />
              </cc-button>
            </v-col>
            <v-col
              cols="auto"
              class="ml-2"
            >
              <v-icon
                v-if="!pilot.TextAppearance"
                color="grey"
              >
                mdi-circle-outline
              </v-icon>
              <v-icon
                v-else
                color="success"
              >
                mdi-check-circle-outline
              </v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div
            v-if="!mobile"
            class="text-caption"
          >
            {{ $t('pm.new.formFieldLicenseTransfer') }}
          </div>
          <div
            v-else
            class="text-caption"
          >
            {{ $t('pm.new.startingLL') }}
          </div>
          <cc-number-field
            v-model.number="pilot.Level"
            type="number"
            :label="$t('pm.identificationPage.startingLicenseLevel')"
            :max="12"
            :min="0"
            :color="pilot.Level ? 'warning' : 'success'"
            :tooltip="$t('pm.identificationPage.startAtLevelHint')"
            tooltip-icon="mdi-alert"
            class="my-1 d-inline"
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="auto"
        class="mx-auto mt-2"
        style="max-width: 325px"
      >
        <div
          v-if="!mobile"
          class="text-caption"
        >
          {{ $t('pm.new.formFieldPortrait') }}
          <div class="mt-n1 text-disabled">{{ $t('pm.new.portraitRetinalNote') }}</div>
        </div>
        <div
          class="border mr-8 ml-auto mr-auto"
          style="width: 300px; height: 300px"
        >
          <cc-img
            v-if="pilot.Portrait"
            :src="pilot.Portrait"
            aspect-ratio="1"
          />
        </div>
        <div class="mt-3">
          <cc-dialog
            :title="$t('pm.sheet.setPilotPortrait')"
            icon="cc:pilot"
            :close-on-click="false"
            major
            full-height
            max-width="90vw"
          >
            <template #activator="{ open }">
              <cc-button
                block
                size="small"
                :color="pilot.Portrait ? 'success' : 'panel'"
                :append-icon="pilot.Portrait ? '' : 'mdi-check-circle-outline'"
                :prepend-icon="pilot.Portrait ? 'mdi-circle-edit-outline' : 'mdi-plus'"
                @click="open"
              >
                {{ pilot.Portrait ? $t('pm.new.editPilotImage') : $t('pm.new.addPilotImage') }}
              </cc-button>
            </template>
            <cc-image-selector
              ref="imageSelector"
              :item="pilot"
              type="pilot"
              avatar
            />
          </cc-dialog>
        </div>
      </v-col>
    </v-row>
    <v-row
      dense
      class="text-center my-6 pt-2 pb-1 px-3 bg-surface"
    >
      <v-col
        cols="12"
        sm="6"
      >
        <cc-button
          size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="savePilot"
        >
          {{ $t('pm.new.skipNewPilotRegistration') }}
        </cc-button>
        <div class="text-caption text-disabled">
          <i>{{ $t('pm.new.recommendedForAdvancedUsers') }}</i>
        </div>
      </v-col>
      <v-spacer />
      <v-col
        cols="12"
        sm="6"
      >
        <cc-button
          size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="$emit('templates')"
        >
          {{ $t('pm.new.selectCharacterTemplate') }}
        </cc-button>
        <div class="text-caption text-disabled">
          <i>{{ $t('pm.new.recommendedForNewPlayers') }}</i>
        </div>
      </v-col>
    </v-row>
  </stepper-content>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CCTextEditorDialog from '@/ui/components/CCTextEditorDialog.vue'
  import { PilotStore } from '@/stores'
  import StepperContent from '../../_components/StepperContent.vue'
  import BackgroundSelector from '../../_components/selectors/BackgroundSelector.vue'
  import { name, callsign } from '@/io/Generators'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { useDisplay } from 'vuetify'

  defineOptions({ name: 'identification-page' })

  const { smAndDown: mobile, xs: portrait } = useDisplay()

  const props = defineProps<{
    pilot: Pilot
    groupID?: string
  }>()

  const emit = defineEmits<{
    set: [payload: any]
    templates: []
    next: []
    done: []
  }>()

  const imageSelector = ref<any>(null)

  const bioDialog = ref(false)
  const appearanceDialog = ref(false)

  async function randomCallsign() {
    const generatedCallsign = await callsign()
    emit('set', { attr: 'Callsign', val: generatedCallsign })
  }
  async function randomName() {
    const generatedName = await name()
    emit('set', { attr: 'Name', val: generatedName })
  }
  async function savePilot() {
    PilotStore().AddPilot(props.pilot as Pilot, props.groupID)
    await emit('done')
  }
</script>
