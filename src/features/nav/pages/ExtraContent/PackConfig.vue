<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="heading h2">{{ pc.title }}</div>
    <cc-alert class="mt-4 bg-panel pr-12 mb-4"
      color="info"
      prominent
      variant="text">
      <p class="text-text">
        {{ pc.description }}
      </p>

      <p class="text-text mt-2">
        {{ pc.applyNote }}
      </p>
    </cc-alert>

    <div v-if="!user.LcpConfigs.length"
      class="text-disabled text-center">
      <i>{{ pc.noConfigs }}</i>
    </div>
    <v-card v-for="(config, index) in user.LcpConfigs"
      v-else
      :key="config.id"
      flat
      tile
      border
      max-width="800px"
      class="mb-2 mx-auto">
      <v-card-text v-if="editingIndex === index">
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon="mdi-list-status"
              size="40" />
          </v-col>
          <v-col>
            <v-text-field v-model="config.name"
              color="primary"
              density="compact"
              hide-details
              class="mb-4"
              @change="debouncedSave(config)" />
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top"
              :text="pc.deleteConfig">
              <template #activator="{ props }">
                <v-btn color="error"
                  size="40"
                  icon
                  flat
                  tile
                  v-bind="props"
                  @click="removeConfig(config.id)">
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <div class="text-text text-cc-overline">{{ pc.lcpsInConfig }}:</div>

        <v-card v-if="!config.packList.length"
          flat
          tile
          color="background"
          class="text-center pa-4">
          <i>
            {{ pc.noLcpsPrefix }}
            <b class="text-accent">{{ pc.lancerCoreBook }}</b>
            {{ pc.willBeAvailable }}
          </i>
        </v-card>

        <div v-else
          class="mx-4 mt-4 mb-8">
          <v-row v-for="lcp in config.packList"
            :key="lcp.packID"
            class="bg-panel">
            <v-col cols="auto">
              <v-avatar color="primary"
                size="30">
                <v-icon icon="cc:campaign" />
              </v-avatar>
            </v-col>
            <v-col>
              <span class="heading">{{ lcp.packName }}</span>
              <span class="text-disabled"> {{ $t('nav.packConfig.byAuthor', { author: lcp.packAuthor }) }}</span>
            </v-col>
            <v-col cols="auto">
              <v-tooltip location="top"
                :text="pc.removeFromConfig">
                <template #activator="{ props }">
                  <v-btn color="error"
                    size="30"
                    icon
                    flat
                    tile
                    v-bind="props"
                    @click="removePack(config, lcp)">
                    <v-icon icon="mdi-close" />
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />

        <v-row align="center">
          <v-col cols="auto">
            <v-select v-model="selection"
              color="primary"
              density="compact"
              hide-details
              return-object
              :items="getEligiblePacks(config)"
              item-title="Name"
              min-width="300px"
              max-width="400px"
              :label="pc.addLcp"
              @update:model-value="AddPack(config)" />
          </v-col>
          <v-col cols="auto"
            class="ml-auto">
            <v-btn color="success"
              flat
              tile
              icon
              @click="editingIndex = null">
              <v-icon icon="mdi-content-save" />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row v-else
        dense
        class="pa-1">
        <v-col cols="auto">
          <v-icon icon="mdi-list-status"
            size="40" />
        </v-col>
        <v-col>
          <div class="heading h3">{{ config.name }}</div>
          <div class="text-disabled text-caption">
            <span v-if="config.packList.length">
              {{ $t('nav.packConfig.lcpsSuffix', { list: config.packList.map(x => x.packName).join(' // ') }) }}
            </span>
            <span v-else>{{ pc.coreBookOnly }}</span>
          </div>
        </v-col>
        <v-col cols="auto"
          class="ml-auto">
          <v-tooltip location="top"
            :text="pc.editConfig">
            <template #activator="{ props }">
              <v-btn color="primary"
                size="40"
                icon
                flat
                tile
                v-bind="props"
                @click="editingIndex = index">
                <v-icon icon="mdi-pencil" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>

    <cc-button color="primary"
      size="small"
      class="ma-0"
      block
      @click="user.AddConfig()">
      <v-icon left>mdi-plus</v-icon>
      {{ pc.createConfig }}
    </cc-button>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore, UserStore } from '@/stores'
import { LcpConfig, LcpConfigData } from '@/user'
import { debounce } from 'lodash-es'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const { smAndDown: mobile } = useDisplay()
const pc = section('packConfig')

const selection = ref<any>(null)
const editingIndex = ref<number | null>(null)

const user = computed(() => UserStore().User)

function getEligiblePacks(config: LcpConfig) {
  return CompendiumStore().ContentPacks.filter(
    p => !config.packList.some(x => x.packID === p.ID)
  )
}

function AddPack(config: LcpConfig) {
  if (!selection.value) return
  if (!config) return
  config.packList.push({
    packID: selection.value.ID,
    packName: selection.value.Manifest.name,
    packAuthor: selection.value.Manifest.author,
    packVersion: selection.value.Manifest.version,
    allowed: true,
  } as LcpConfigData)
  user.value.updateConfig(config.id, config)
  selection.value = null
}

function removePack(config: LcpConfig, pack: LcpConfigData) {
  const index = config.packList.findIndex(p => p.packID === pack.packID)
  if (index === -1) return
  config.packList.splice(index, 1)
  user.value.updateConfig(config.id, config)
}

function removeConfig(id: string) {
  user.value.RemoveConfig(id)
}

const debouncedSave = debounce((config: LcpConfig) => {
  UserStore().User.updateConfig(config.id, config)
}, 500)
</script>
