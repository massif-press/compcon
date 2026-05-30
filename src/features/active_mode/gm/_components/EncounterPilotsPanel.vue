<template>
  <v-row>
    <v-col cols="1"
      class="text-center">
      <v-icon icon="cc:pilot"
        :color="pilots.length ? 'success' : 'panel'"
        size="50" />
    </v-col>
    <v-col>
      <div class="text-cc-overline mb-1">
        <cc-slashes class="pr-1" />
        <span class="text-disabled">Pilots</span>
      </div>
      <cc-panel>
        <cc-titled-divider v-if="!pilots.length"
          title="Add Pilots"
          color="accent" />
        <div>
          <v-row v-for="p in pilots"
            :key="p.ID"
            no-gutters
            class="mb-2 bg-background"
            style="border: 2px solid; border-color: rgb(var(--v-theme-primary))">
            <v-col cols="auto"
              class="bg-primary pr-1"
              style="padding: 2px">
              <v-avatar flat
                tile
                size="64">
                <cc-avatar v-if="p.PortraitController.Avatar"
                  :avatar="p.PortraitController.Avatar"
                  size="64" />
                <cc-img v-else-if="p.Portrait"
                  :src="p.Portrait"
                  height="64"
                  width="64" />
              </v-avatar>
            </v-col>
            <v-col class="ml-n1">
              <cc-title>
                &nbsp;
                <span class="heading h3">
                  {{ p.Callsign }}
                  <span class="text-cc-overline text-disabled">
                    <cc-slashes />
                    {{ p.Name }}
                    <span v-if="p.Player">({{ p.Player }})</span>
                  </span>
                </span>
              </cc-title>
              <v-row dense
                class="mx-4 pt-1">
                <v-col cols="auto"
                  class="text-center">
                  <div class="text-cc-overline">LL</div>
                  <v-divider />
                  <div class="heading">{{ p.Level }}</div>
                </v-col>
                <v-col v-if="p.ActiveMech"
                  cols="auto"
                  class="mx-4">
                  <div class="text-cc-overline">Active Mech</div>
                  <v-divider />
                  <div class="heading">
                    {{ p.ActiveMech?.Name }}
                    <span class="text-cc-overline text-disabled">
                      <cc-slashes />
                      {{ p.ActiveMech?.Frame.Source }}
                      {{ p.ActiveMech.Frame.Name }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto">
              <v-btn flat
                tile
                stacked
                height="100%"
                color="primary"
                prepend-icon="mdi-close"
                @click="emit('remove-pilot', p)" />
            </v-col>
          </v-row>

          <v-row v-for="(p, i) in placeholders"
            :key="p.ID"
            no-gutters
            class="mb-2 bg-background"
            style="border: 2px solid; border-color: rgb(var(--v-theme-primary))">
            <v-col cols="auto"
              class="bg-primary pr-1"
              style="padding: 2px">
              <v-avatar flat
                tile
                size="64">
                <v-icon icon="cc:pilot"
                  size="64" />
              </v-avatar>
            </v-col>
            <v-col class="ml-n1">
              <cc-title>
                &nbsp;
                <span class="heading h3">Pilot Placeholder #{{ i + 1 }}</span>
              </cc-title>
              <v-row dense
                class="pa-1 px-2">
                <v-col>
                  <cc-text-field v-model="p.Name"
                    color="panel"
                    placeholder="Pilot name or Callsign"
                    prepend-icon="cc:pilot" />
                </v-col>
                <v-col>
                  <cc-text-field v-model="p.Mechname"
                    color="panel"
                    placeholder="Frame or Mech Name"
                    prepend-icon="cc:frame" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto">
              <v-btn flat
                tile
                stacked
                height="100%"
                color="primary"
                prepend-icon="mdi-close"
                @click="emit('remove-placeholder', i)" />
            </v-col>
          </v-row>
        </div>
        <v-divider class="my-4" />
        <v-row dense>
          <v-col>
            <add-from-roster :encounter="encounter"
              :pilots="pilots" />
          </v-col>
          <v-col>
            <add-from-share :pilots="pilots" />
          </v-col>
          <v-col>
            <cc-modal title="Import"
              icon="mdi-import">
              <template #activator="{ open }">
                <cc-button color="primary"
                  size="small"
                  block
                  tooltip="Import a pilot from JSON data"
                  prepend-icon="mdi-file-import-outline"
                  @click="open">
                  Add from File
                </cc-button>
              </template>
              <template #default="{ close }">
                <file-import skip-roster-save
                  @import-complete="emit('add-pilot', $event)"
                  @done="close" />
              </template>
            </cc-modal>
          </v-col>
          <v-col>
            <cc-button size="small"
              block
              color="primary"
              tooltip="Adds a pilot-type combatant placeholder without any pilot data."
              prepend-icon="mdi-account-outline"
              @click="emit('add-placeholder')">
              add pilot placeholder
            </cc-button>
          </v-col>
        </v-row>
      </cc-panel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AddFromRoster from './AddFromRoster.vue';
import AddFromShare from './AddFromShare.vue';
import FileImport from '@/features/pilot_management/Roster/components/add_panels/FileImport.vue';

defineProps<{
  encounter: any
  pilots: any[]
  placeholders: any[]
}>()

const emit = defineEmits<{
  'remove-pilot': [pilot: any]
  'remove-placeholder': [index: number]
  'add-pilot': [pilot: any]
  'add-placeholder': []
}>()
</script>
