<template>
  <v-row
    class="mb-1"
    dense
  >
    <v-col>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">
        {{ $t('active.eidolon.tierEidolon', { n: combatant.actor.Tier }) }}
      </div>
    </v-col>
    <v-col
      v-for="n in combatant.actor.Layers.length"
      :key="`layer-${n}`"
      cols="auto"
      align-self="center"
      class="text-center"
    >
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            flat
            tile
            stacked
            :variant="n - 1 === combatant.actor.ActiveLayerIndex ? 'elevated' : 'tonal'"
            :color="n - 1 === combatant.actor.ActiveLayerIndex ? 'exotic' : 'primary'"
            @click="combatant.actor.SetActiveLayer(n - 1)"
          >
            <v-icon
              :icon="
                combatant.actor.Layers[n - 1].CombatController.IsDestroyed
                  ? 'mdi-layers-off'
                  : 'mdi-layers'
              "
              :size="n - 1 === combatant.actor.ActiveLayerIndex ? 50 : 40"
            />
            <div class="text-cc-overline">{{ combatant.actor.Layers[n - 1].Name }}</div>
          </v-btn>
        </template>
        {{ $t('active.eidolon.nameLayer', { name: combatant.actor.Layers[n - 1].Name }) }}
        <span v-if="n - 1 === combatant.actor.ActiveLayerIndex">
          &nbsp;{{ $t('active.eidolon.active') }}
        </span>
      </v-tooltip>
    </v-col>
  </v-row>
  <cc-alert
    v-if="layer.CombatController.IsDestroyed && !combatant.actor.IsDefeated"
    class="ma-2"
    outlined
  >
    <p>{{ $t('active.eidolon.metamorphosisDetail') }}</p>
    <cc-button
      block
      size="small"
      color="exotic"
      class="mt-2"
      @click="combatant.actor.DestroyActiveLayer(combatant)"
    >
      {{ $t('active.eidolon.metamorphose') }}
    </cc-button>
  </cc-alert>
  <cc-alert
    v-else-if="combatant.actor.Manifesting"
    class="ma-2"
    outlined
  >
    <p>{{ $t('active.eidolon.manifestingDetail') }}</p>
    <cc-button
      block
      size="small"
      color="exotic"
      class="mt-2"
      :tooltip="$t('active.eidolon.manifestTooltip')"
      @click="combatant.actor.Manifest(combatant, hostileCount)"
    >
      {{ $t('active.eidolon.manifestLayer', { name: layer.Name }) }}
    </cc-button>
  </cc-alert>
  <panel-base
    :item="layer"
    hide-palette
  >
    <template #name-block>
      <div class="mr-12">
        <div class="text-cc-overline">{{ $t('active.eidolon.activeLayer') }}</div>
        <div class="heading h3 border-primary text-accent text-center">
          {{ layer.Name }}
        </div>
        <v-divider class="my-1" />
        <cc-button
          block
          size="small"
          color="primary"
          :disabled="!shardCount"
          @click="combatant.actor.CreateShards(combatant, hostileCount)"
        >
          <span v-if="shardCount">
            {{ $t('active.eidolon.generateShards', { n: shardCount }, shardCount) }}
          </span>
          <span v-else>{{ $t('active.eidolon.noShards') }}</span>
        </cc-button>
      </div>
    </template>

    <template #subtitle>
      <div
        v-if="layer.Description"
        class="text-cc-overline mt-2"
      >
        {{ $t('gm.eidolon.layerDescription') }}
      </div>
      <p
        v-if="layer.Description"
        v-html-safe="layer.Description"
        class="px-4 py-2 border"
      />
      <div
        v-if="layer.Layer.Appearance"
        class="my-2"
      >
        <cc-panel :title="$t('common.reportedAppearances')">
          <p v-html-safe="layer.Layer.Appearance" />
        </cc-panel>
      </div>
      <div
        v-if="layer.Layer.Hints"
        class="my-2"
      >
        <cc-panel :title="$t('common.hints')">
          <p v-html-safe="layer.Layer.Hints" />
          <div
            class="text-right"
            style="position: absolute; bottom: 0; right: 22px"
          >
            <v-btn
              variant="text"
              size="x-small"
              class="fade-select"
              @click="clip(combatant.actor.Scan)"
            >
              <v-icon
                start
                icon="mdi-content-copy"
              />
              {{ $t('active.scan.scan') }}
            </v-btn>
          </div>
        </cc-panel>
      </div>
      <div
        v-if="layer.Layer.Rules"
        class="my-2"
      >
        <cc-panel :title="$t('common.rules')">
          <p v-html-safe="layer.Layer.RulesByTier(combatant.actor.Tier)" />
        </cc-panel>
      </div>
    </template>

    <v-expansion-panels
      class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion"
    >
      <v-expansion-panel class="py-0">
        <v-expansion-panel-title class="text-cc-overline py-0">
          <div class="text-cc-overline">
            <v-icon
              icon="cc:trait"
              class="mt-n1"
              start
            />
            {{ $t('active.eidolon.persistentTraits', { n: traits.length }) }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid
            :items="traits"
            :xl-columns="xlColumns"
          >
            <template #default="{ item }">
              <div class="heading h4 text-accent">{{ item.name }}</div>
              <p v-html-safe="item.detail" />
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <template
      v-for="(items, i) in [features, shardFeatures]"
      :key="i"
    >
      <template v-if="i && items.length">
        <div class="text-cc-overline mt-2">
          {{ $t('active.eidolon.shardFeatures', { n: items.length }) }}
        </div>
        <p
          v-html-safe="layer.Layer.Shards.Detail"
          class="px-2 pb-2"
        />
      </template>
      <cc-masonry-grid
        :items="items"
        :xl-columns="xlColumns"
      >
        <template #default="{ item }">
          <fieldset
            class="px-2 pb-2"
            style="border-color: rgba(155, 155, 155, 0.6)"
          >
            <unit-feature-card
              :key="item.ID"
              :item="item"
              :unit="layer"
              @deploy="deploy($event)"
            />
          </fieldset>
        </template>
      </cc-masonry-grid>
    </template>
  </panel-base>
</template>

<script setup lang="ts">
  import { computed, provide } from 'vue'
  import { useDisplay } from 'vuetify'
  import { EncounterContextKey } from './encounterContext'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import UnitFeatureCard from './_components/loadouts/_unitFeatureCard.vue'
  import PanelBase from './_PanelBase.vue'
  import { persistentTraits } from '@/classes/npc/eidolon/EidolonLayer'
  import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

  const props = defineProps({
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: EncounterInstance,
      required: true,
    },
  })

  provide(EncounterContextKey, {
    owner: computed(() => props.combatant as CombatantData),
    encounterInstance: computed(() => props.encounterInstance),
  })

  const emit = defineEmits(['deselect'])

  const { smAndDown: mobile, xs: portrait } = useDisplay()

  const { layout } = useLayoutOptions()
  const xlColumns = computed(() => layout.value.maxColumns)
  const traits = computed(() => persistentTraits())
  const layer = computed(() => (props.combatant as any).actor.ActiveLayer)
  const features = computed(() => layer.value?.Layer?.Features || [])
  const shardFeatures = computed(() => layer.value?.Layer?.Shards?.Features || [])
  const hostileCount = computed(() => props.encounterInstance.HostileCount)
  const shardCount = computed(() => (props.combatant as any).actor.ShardCount(hostileCount.value))

  function deploy(deployable) {
    ;(props.encounterInstance as any).Deploy(deployable, props.combatant)
  }
  function clip(text) {
    navigator.clipboard.writeText(text)
  }
</script>
