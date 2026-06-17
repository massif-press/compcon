<template>
  <v-card-text class="pt-2">
    <div class="heading"
      :class="mobile ? 'h4' : 'h3'">
      {{ $t('pm.roster.uadCAVCOMOfficeOfRecords') }}
      <cc-slashes />
      <br v-if="mobile" />
      &nbsp;{{ $t('pm.roster.i7aSelfServiceUnitRegistration') }}
    </div>
    <v-container class="flavor-text"
      style="font-size: 13px">
      <div class="mt-n2">
        {{ $t('pm.roster.identCR7aCAVALRYUNITREGISTRATION') }}
        <br />
        {{ $t('pm.roster.unitRegistrationSubmissionWillBeReviewed') }}
      </div>
    </v-container>
    <v-row align="center">
      <v-col>
        <div class="my-2">
          <div class="text-caption">
            {{ $t('pm.roster.cr700ENCODEDDATAREMIT') }}
            <i class="text-disabled">{{ $t('pm.roster.optional') }}</i>
          </div>
          <div class="px-10 pt-1">
            <group-file-import @toggle-import="importHide = $event"
              @done="$emit('close')" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="!importHide"
      class="mt-4 mb-5" />
    <v-expand-transition>
      <div v-if="!importHide">
        <v-row align="start">
          <v-col cols="12"
            md="5"
            class="mr-auto">
            <div class="my-2">
              <div class="text-caption">{{ $t('pm.roster.cr701UNITDESIGNATION') }}</div>
              <cc-text-field v-model="group.Name"
                variant="outlined"
                :placeholder="$t('pm.fields.name')"
                :icon="group.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
                :color="group.Name ? 'success' : 'error'"
                class="my-1 d-inline">
                <template #extra>
                  <cc-button icon="mdi-dice-multiple"
                    variant="outlined"
                    size="small"
                    :tooltip="$t('pm.tooltips.generateRandomName')"
                    @click="randomName()" />
                </template>
              </cc-text-field>
            </div>

            <div class="my-4">
              <div class="text-caption">{{ $t('pm.roster.cr702aATTACHEDNDAPCOMP') }}</div>
              <v-row align="center"
                dense>
                <v-col>
                  <cc-modal :title="$t('pm.titles.groupDescription')"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.Description ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">{{ $t('pm.roster.addGroupDescription') }}</div>
                        <div v-else>{{ $t('pm.roster.editGroupDescription') }}</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <cc-text-editor-inline :original="group.Description"
                          @save="group.Description = $event" />
                        <div class="text-right mt-3">
                          <cc-button color="primary"
                            size="small"
                            @click="close">
                            {{ $t('common.saveAndClose') }}
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon v-if="!group.Description"
                    size="large"
                    color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon v-else
                    size="large"
                    color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>

            <div class="my-4">
              <div class="text-caption">
                {{ $t('pm.roster.cr702bATTACHEDTACANALYSISRECORDS') }}
              </div>
              <v-row align="center"
                dense>
                <v-col>
                  <cc-modal :title="$t('pm.titles.groupDescription')"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.History ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">{{ $t('pm.roster.addGroupHistory') }}</div>
                        <div v-else>{{ $t('pm.roster.editGroupHistory') }}</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <cc-text-editor-inline :original="group.History"
                          @save="group.History = $event" />
                        <div class="text-right mt-3">
                          <cc-button color="primary"
                            size="small"
                            @click="close">
                            {{ $t('common.saveAndClose') }}
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon v-if="!group.History"
                    size="large"
                    color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon v-else
                    size="large"
                    color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12"
            md="5"
            class="ml-auto">
            <div class="text-caption">{{ $t('pm.roster.cr703UNITLIVERY') }}</div>
            <div class="border mr-8 ml-auto mr-auto"
              style="width: 300px; height: 300px">
              <cc-img v-if="group.Portrait"
                :src="group.Portrait"
                aspect-ratio="1" />
              <div class="mt-3 text-center">
                <group-emblem-modal :group="group" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card-text>
  <div style="position: fixed; bottom: 0; right: 0; left: 0">
    <cc-button block
      color="primary"
      :disabled="!group.Name"
      @click="submit()">{{ $t('common.submit') }}</cc-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { PilotGroupStore } from '../../store';
import { PilotGroup } from '../../store/PilotGroup';
import { teamName } from '@/io/Generators';
import GroupFileImport from './add_panels/GroupFileImport.vue';
import GroupEmblemModal from './_GroupEmblemModal.vue';

const emit = defineEmits<{ close: [] }>()

const { smAndDown: mobile } = useDisplay()

const group = ref(new PilotGroup())
const fileValue = ref(null)
const importHide = ref(false)

async function randomName() {
  group.value.Name = await teamName()
}

function submit() {
  PilotGroupStore().AddGroup(group.value as PilotGroup)
  emit('close')
}
</script>
