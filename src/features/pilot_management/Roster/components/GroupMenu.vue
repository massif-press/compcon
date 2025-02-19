<template>
  <v-card-text class="pt-2">
    <div class="heading" :class="mobile ? 'h4' : 'h3'">
      UAD/CAVCOM Office of Records
      <cc-slashes />
      <br v-if="mobile" />
      &nbsp;I-7a Self-Service Unit Registration
    </div>
    <v-container class="flavor-text" style="font-size: 13px">
      <div class="mt-n2">
        IDENT-CR-7a (CAVALRY UNIT REGISTRATION) is a self-directed registration form for the purpose
        of registering a new unit designation for one or more IDENT-registered pilots. This form is
        to be used by pilots who are not currently assigned to a unit or who are registering a new
        unit designation for the first time. If you wish to register a new designation for an
        existing unit, please submit form CR-7b (CAVALRY UNIT DOCUMENTATION UPDATE) instead.
        <br />
        Unit registration submission will be reviewed by the UAD/CAVCOM Office of Records in the
        order they are received.
      </div>
    </v-container>
    <v-row align="center">
      <v-col>
        <div class="my-2">
          <div class="text-caption">
            CR-7-00 // ENCODED DATA REMIT
            <i class="text-disabled">(OPTIONAL)</i>
          </div>
          <div class="px-10 pt-1">
            <group-file-import @toggle-import="importHide = $event" @done="$emit('close')" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="!importHide" class="mt-4 mb-5" />
    <v-expand-transition>
      <div v-if="!importHide">
        <v-row align="start">
          <v-col cols="12" md="5" class="mr-auto">
            <div class="my-2">
              <div class="text-caption">CR-7-01 // UNIT DESIGNATION</div>
              <cc-text-field
                v-model="group.Name"
                variant="outlined"
                placeholder="Name"
                :icon="group.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
                :color="group.Name ? 'success' : 'error'"
                hide-details
                density="compact"
                class="my-1 d-inline">
                <template #extra>
                  <cc-button
                    icon="mdi-dice-multiple"
                    variant="outlined"
                    size="x-small"
                    tooltip="Generate random name"
                    @click="randomName()" />
                </template>
              </cc-text-field>
            </div>

            <div class="my-4">
              <div class="text-caption">CR-7-02a // ATTACHED NDAP COMP/DISP ANALYSIS RESULTS</div>
              <v-row align="center" dense>
                <v-col>
                  <cc-modal
                    title="Group Description"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button
                        block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.Description ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">Add Group Description</div>
                        <div v-else>Edit Group Description</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <quill-editor
                          theme="snow"
                          v-model:content="group.Description"
                          content-type="html" />
                        <div class="text-right mt-3">
                          <cc-button color="primary" size="small" @click="close">
                            Save and Close
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon size="large" v-if="!group.Description" color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon size="large" v-else color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>

            <div class="my-4">
              <div class="text-caption">
                CR-7-02b // ATTACHED TACANALYSIS RECORDS (SUPPLEMENTAL)
              </div>
              <v-row align="center" dense>
                <v-col>
                  <cc-modal
                    title="Group Description"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button
                        block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.History ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">Add Group History</div>
                        <div v-else>Edit Group History</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <quill-editor
                          theme="snow"
                          v-model:content="group.History"
                          content-type="html" />
                        <div class="text-right mt-3">
                          <cc-button color="primary" size="small" @click="close">
                            Save and Close
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon size="large" v-if="!group.History" color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon size="large" v-else color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" md="5" class="ml-auto">
            <div class="text-caption">CR-7-03 // UNIT LIVERY</div>
            <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
              <cc-img v-if="group.Portrait" :src="group.Portrait" aspect-ratio="1" />
              <div class="mt-3 text-center">
                <cc-button color="secondary" @click="($refs.imageSelector as any).open()">
                  <div v-if="!group.Portrait">
                    <v-icon start>mdi-plus</v-icon>
                    Add group emblem
                  </div>
                  <div v-else>
                    <v-icon start>mdi-circle-edit-outline</v-icon>
                    Edit group emblem
                  </div>
                  <div style="position: absolute; right: -30px">
                    <v-icon v-if="!group.Portrait" color="grey">mdi-circle-outline</v-icon>
                    <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
                  </div>
                </cc-button>
                <cc-image-selector ref="imageSelector" :item="group" type="emblem" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card-text>
  <div style="position: fixed; bottom: 0; right: 0; left: 0">
    <cc-button block color="primary" :disabled="!group.Name" @click="submit()">Submit</cc-button>
  </div>
</template>

<script lang="ts">
import { PilotStore } from '../../store';
import { PilotGroup } from '../../store/PilotGroup';
import { teamName } from '@/io/Generators';
import GroupFileImport from './add_panels/GroupFileImport.vue';

export default {
  name: 'group-menu',
  data: () => ({
    group: {} as PilotGroup,
    fileValue: null,
    importHide: false,
  }),
  components: { GroupFileImport },
  created: function () {
    this.group = new PilotGroup();
  },
  emits: ['close'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    async randomName() {
      this.group.Name = await teamName();
    },
    submit() {
      PilotStore().AddGroup(this.group as PilotGroup);
      this.$emit('close');
    },
  },
};
</script>
