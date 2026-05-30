<template>
  <div>
    <cc-button block
      color="primary"
      class="mt-2"
      @click="dialog = true">
      Set NPC Features
    </cc-button>
    <v-row no-gutters
      justify="end">
      <v-col cols="auto">
        <cc-button size="small"
          color="error"
          class="mt-2"
          @click="npc.NpcFeatureController.ResetFeatures()">
          Reset Features
        </cc-button>
      </v-col>
    </v-row>
    <cc-solo-modal v-model="dialog"
      title="Set NPC Features"
      icon="cc:npc_feature">
      <template #toolbar-items>
        <npc-feature-alerts :hide="npc.BrewController.MissingContent"
          :template-controller="npc.NpcTemplateController"
          hide-complete
          class="d-inline" />
      </template>
      <v-layout style="position: relative">
        <div style="position: absolute; z-index: 999"
          :style="`left: ${showNav ? '352' : '3'}px; top: 6px`">
          <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
            size="small"
            color="primary"
            @click="showNav = !showNav" />
        </div>
        <v-navigation-drawer v-model="showNav"
          class="mt-2"
          width="350">
          <v-list density="compact"
            slim
            nav
            class="side-fixed mt-n1"
            color="panel">
            <v-list-item color="accent"
              selectable
              prepend-icon="cc:npc_feature"
              @click="featureSet = 'all'">
              <template #title>
                <b class="text-button">All Available Features</b>
              </template>
            </v-list-item>
            <v-list-item color="accent"
              selectable
              prepend-icon="cc:npc_feature"
              @click="featureSet = 'assigned'">
              <template #title>
                <b class="text-button">All Assigned Features</b>
              </template>
            </v-list-item>
            <v-divider />

            <v-list-subheader class="mb-n3">SELECTED CLASS</v-list-subheader>
            <v-list-item color="accent"
              :prepend-icon="npc.NpcClassController.Class.Icon"
              @click="featureSet = npc.NpcClassController.Class.ID">
              <template #title>
                <span class="text-button">{{ npc.NpcClassController.Class.Name }} Features</span>
              </template>
            </v-list-item>
            <v-list-subheader v-if="npc.NpcTemplateController.Templates.length > 0"
              class="mb-n3">
              SELECTED TEMPLATE{{ npc.NpcTemplateController.Templates.length > 1 ? 'S' : '' }}
            </v-list-subheader>
            <v-list-item v-for="t in npc.NpcTemplateController.Templates"
              :key="t.ID"
              prepend-icon="cc:npc_template"
              color="accent"
              @click="featureSet = t.ID">
              <template #title>
                <span class="text-button">{{ t.Name }} Features</span>
              </template>
            </v-list-item>
            <v-divider />

            <v-list-group no-action
              color="accent">
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <span class="text-button">
                      <b>Other NPC Classes</b>
                    </span>
                  </template>
                </v-list-item>
              </template>

              <v-list-item v-for="c in allClasses"
                :key="c.ID"
                color="accent"
                class="ml-n8"
                :prepend-icon="c.Icon"
                @click="featureSet = c.ID">
                <template #title>
                  <span class="text-button">{{ c.Name }} Features</span>
                </template>
              </v-list-item>
            </v-list-group>

            <v-list-group no-action
              color="accent">
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <span class="text-button">
                      <b>Other NPC Templates</b>
                    </span>
                  </template>
                </v-list-item>
              </template>

              <v-list-item v-for="t in allTemplates"
                :key="t.ID"
                color="accent"
                class="ml-n8"
                prepend-icon="cc:npc_template"
                @click="featureSet = t.ID">
                <template #title>
                  <span class="text-button">{{ t.Name }} Features</span>
                </template>
              </v-list-item>
            </v-list-group>
            <v-list-item key="no-origin-items"
              color="accent"
              @click="featureSet = 'no-origin'">
              <template #title>
                <b class="text-button">Other Features</b>
              </template>
            </v-list-item>
          </v-list>
          <div style="height: 20px" />
        </v-navigation-drawer>

        <v-main style="height: calc(100vh - 35px) !important; overflow-y: scroll">
          <v-container class="px-10 py-4">
            <v-row dense
              align="start"
              class="mt-n3">
              <v-col>
                <span class="heading h3">{{ currentSelection }} Features</span>
              </v-col>
              <v-col cols="auto">
                <cc-switch v-if="featureSet === 'assigned'"
                  v-model="allowDupes"
                  label="Allow Duplicates" />
                <cc-switch v-else
                  v-model="ignoreLimit"
                  label="Ignore Limit" />

              </v-col>
            </v-row>
            <npc-feature-alerts :hide="npc.BrewController.MissingContent"
              :template-controller="npc.NpcTemplateController"
              expanded
              hide-complete />

            <v-divider class="mt-2 mb-4" />
            <div v-if="featureSet === 'all' || featureSet === 'assigned'"
              align="center">
              <v-btn-toggle v-model="shownOrigins"
                density="compact"
                class="mb-4"
                multiple
                flat
                tile
                size="small">
                <v-btn v-for="o in availableOrigins"
                  :key="o.ID"
                  color="accent"
                  variant="tonal"
                  :value="o.ID">
                  {{ o.Name }}
                </v-btn>
              </v-btn-toggle>
            </div>

            <cc-masonry-grid :items="shownFeatures"
              :key-mapper="item => item.ID">
              <template #default="{ item }">
                <div v-if="item"
                  :key="item.ID">
                  <cc-dense-card :item="item">
                    <template #pre>
                      <div class="text-disabled text-cc-overline mt-n1">
                        {{ item.Base ? 'Base' : 'Optional' }} Feature
                      </div>
                    </template>
                  </cc-dense-card>
                  <div class="mt-n2">
                    <cc-button v-if="hasItem(item)"
                      color="warning"
                      block
                      size="x-small"
                      prepend-icon="mdi-minus"
                      @click="npc.NpcFeatureController.RemoveFeature(item)">
                      Remove {{ item.Name }}
                    </cc-button>
                    <cc-button v-else-if="!hasItem(item) || allowDupes"
                      color="secondary"
                      block
                      size="x-small"
                      prepend-icon="mdi-plus"
                      @click="npc.NpcFeatureController.AddFeature(item)">
                      Add {{ item.Name }}
                    </cc-button>
                  </div>
                </div>
              </template>
            </cc-masonry-grid>

            <div v-if="!shownFeatures.length"
              class="my-6">
              <v-alert v-if="
                featureSet === 'all' &&
                !npc.NpcTemplateController.FeatureRequirements.some(
                  x => !x.complete || !x.optional_complete
                )
              "
                variant="outlined"
                class="text-center">
                No NPC Feature selections remaining
                <br />
                <span class="caption text--secondary">
                  Additional features beyond the recommended guidelines can be added by toggling the
                  "Ignore Limit" option above
                </span>
              </v-alert>
              <v-alert v-else-if="featureSet === 'assigned'"
                variant="outlined"
                class="text-center">
                No NPC Features assigned
              </v-alert>
              <v-alert v-else
                variant="outlined"
                class="text-center">
                No NPC Features could be found for this selection
              </v-alert>
            </div>

            <div style="height: 30px" />
          </v-container>
        </v-main>
      </v-layout>
    </cc-solo-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as _ from 'lodash-es'
import { CompendiumStore } from '@/stores'
import NpcFeatureAlerts from './NpcFeatureAlerts.vue'
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';

defineOptions({ name: 'NpcFeatureSelectMenu' })

const props = defineProps<{
  npc: object
}>()

const dialog = ref(false)
const featureSet = ref('all')
const ignoreLimit = ref(false)
const allowDupes = ref(false)
const shownOrigins = ref([] as any[])
const showNav = ref(true)

const currentSelection = computed(() => {
      switch (featureSet.value) {
        case 'all':
          return 'All Available'
        case 'assigned':
          return 'All Assigned'
        case 'no-origin':
          return 'Other'
        default:
          const selClass = allClasses.value.find(x => x.ID === featureSet.value)
          const selTemp = allTemplates.value.find(x => x.ID === featureSet.value)
          return selClass ? selClass.Name : selTemp?.Name || 'all'
      }
    })
const featureOrigins = computed(() => {
      return _.uniqBy(shownFeatures.value, 'Origin.ID').map(x => x.Origin)
    })
const availableOrigins = computed(() => {
      return _.uniq(props.npc.NpcFeatureController.AvailableFeatures.map(x => x.Origin))
    })

shownOrigins.value = availableOrigins.value.map(x => x.ID)

const hasNoOriginFeatures = computed(() => {
      return CompendiumStore().NpcFeatures.some(x => !x._originID)
    })
const shownFeatures = computed(() => {
      if (featureSet.value === 'no-origin') {
        return CompendiumStore().NpcFeatures.filter(
          x =>
            x._originID === 'no-origin'
        )
      }

      if (featureSet.value === 'all') {
        const selectionsRemaining = props.npc.NpcTemplateController.FeatureRequirements.some(
          x => !x.complete || !x.optional_complete
        )

        if (selectionsRemaining || ignoreLimit.value) {
          return props.npc.NpcFeatureController.AvailableFeatures.filter(
            (x: NpcFeature) => shownOrigins.value.includes(x.Origin.ID)
          )
        } else return [] as NpcFeature[]
      }

      if (featureSet.value === 'assigned') return props.npc.NpcFeatureController.Features


      return allFeatures.value.filter(x => x.Origin.ID === featureSet.value)
    })
const allFeatures = computed(() => {
      if (!props.npc.LcpConfig) return CompendiumStore().NpcFeatures
      return CompendiumStore().NpcFeatures.filter(
        x =>
          !x.InLcp ||
          props.npc.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
          props.npc.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
      )
    })
const allClasses = computed(() => {
      return CompendiumStore().NpcClasses
    })
const allTemplates = computed(() => {
      return CompendiumStore().NpcTemplates
    })

function hasItem(feature) {
      return feature && props.npc.NpcFeatureController.Features.some(y => y.ID === feature.ID)
    }
</script>
