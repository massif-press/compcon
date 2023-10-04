<template>
  <v-container>
    <div>
      <div class="heading h2">
        UAD/CAVCOM Office of Records
        <cc-slashes />
        &nbsp;I-7a Self-Service Unit Registration
      </div>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n4">
          IDENT-CR-7a (CAVALRY UNIT REGISTRATION) is a self-directed registration form for the
          purpose of registering a new unit designation for one or more IDENT-registered pilots.
          This form is to be used by pilots who are not currently assigned to a unit or who are
          registering a new unit designation for the first time. If you wish to register a new
          designation for an existing unit, please submit form CR-7b (CAVALRY UNIT DOCUMENTATION
          UPDATE) instead.
          <br />
          Unit registration submission will be reviewed by the UAD/CAVCOM Office of Records in the
          order they are received.
        </div>
      </v-container>
      <v-row align="center">
        <v-col>
          <div class="my-2">
            <div class="text-caption">
              CR-7-00 // ENCODED DATA REMIT <i class="text-disabled">(OPTIONAL)</i>
            </div>
            <div class="px-10 pt-1">
              <group-file-import @toggle-import="importHide = $event" @done="$emit('close')" />
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider v-if="!importHide" class="mb-4" />
      <v-expand-transition>
        <div v-if="!importHide">
          <v-row align="start">
            <v-col cols="12" md="5" class="mr-auto">
              <div class="my-2">
                <div class="text-caption">CR-7-01 // UNIT DESIGNATION</div>
                <v-text-field
                  v-model="group.Name"
                  variant="outlined"
                  label="Name"
                  hide-details
                  density="compact"
                  class="my-1"
                >
                  <template #prepend>
                    <cc-tooltip simple content="Generate Random Name">
                      <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
                    </cc-tooltip>
                  </template>
                  <template #append>
                    <v-icon v-if="!group.Name" color="error">mdi-alert</v-icon>
                    <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
                  </template>
                </v-text-field>
              </div>

              <div class="my-4">
                <div class="text-caption">CR-7-02a // ATTACHED NDAP COMP/DISP ANALYSIS RESULTS</div>
                {{ group.Description }}
                <v-row align="center">
                  <v-col cols="auto">
                    <cc-text-editor
                      ref="appearance"
                      label="Group Description"
                      color="secondary"
                      :original="group.Description"
                    />
                  </v-col>
                  <v-col>
                    <v-btn
                      variant="outlined"
                      block
                      color="secondary"
                      @click="($refs.appearance as any).show()"
                    >
                      <div v-if="!group.Description">Add Group Description</div>
                      <div v-else>Edit Group Description</div>
                    </v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-icon v-if="!group.Description" color="grey">mdi-circle-outline</v-icon>
                    <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
                  </v-col>
                </v-row>
              </div>

              <div class="my-4">
                <div class="text-caption">
                  CR-7-02b // ATTACHED TACANALYSIS RECORDS (SUPPLEMENTAL)
                </div>
                <v-row align="center">
                  <v-col cols="auto">
                    <cc-text-editor
                      ref="bio"
                      label="Group History"
                      color="secondary"
                      :original="group.History"
                    />
                  </v-col>
                  <v-col>
                    <v-btn
                      variant="outlined"
                      block
                      color="secondary"
                      @click="($refs.bio as any).show()"
                    >
                      <div v-if="!group.History">Add Group History</div>
                      <div v-else>Edit Group History</div>
                    </v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-icon v-if="!group.History" color="grey">mdi-circle-outline</v-icon>
                    <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="ml-auto">
              <div class="text-caption">CR-7-03 // UNIT LIVERY</div>
              <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
                <v-img v-if="group.Portrait" :src="group.Portrait" aspect-ratio="1" />
              </div>
              <div class="mr-8 mt-3">
                <v-btn
                  variant="outlined"
                  large
                  block
                  color="secondary"
                  @click="($refs.imageSelector as any).open()"
                >
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
                </v-btn>
                <cc-image-selector ref="imageSelector" :item="group" type="emblem" />
              </div>
            </v-col>
          </v-row>
          <v-row align="end" justify="end">
            <v-col cols="auto">
              <v-btn size="large" color="accent" @click="submit()">Submit</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </div>
  </v-container>
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
