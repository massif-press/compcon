<template>
  <v-row>
    <v-col cols="1"
      class="text-center">
      <v-icon icon="mdi-checkbox-marked-circle-auto-outline"
        :color="(pilots.length || placeholders.length) ? 'success' : 'panel'"
        size="50" />
    </v-col>
    <v-col>
      <div class="text-cc-overline mb-1">
        <cc-slashes class="pr-1" />
        <span class="text-disabled">{{ $t('active.encSummary.overview') }}</span>
      </div>
      <cc-panel>
        <div class="heading h2">{{ encounter.Name }}</div>
        <div class="text-cc-overline">
          <span class="text-disabled">{{ $t('active.labels.environment') }} <cc-slashes /></span>
          {{ encounter.Environment.Name }} &mdash;
          <span class="text-disabled">{{ $t('active.labels.sitrep') }} <cc-slashes /></span>
          {{ encounter.Sitrep.Name }}
        </div>
        <v-row class="mt-1 mb-2">
          <v-col>
            <cc-panel color="panel"
              flat
              tile
              class="pb-4">
              <div class="heading" h3><cc-slashes /> {{ $t('active.encSummary.pilots') }}</div>
              <v-divider class="mb-2" />
              <v-row v-for="(p, i) in participants"
                :key="p.key"
                :class="i % 2 === 0 ? 'bg-background' : 'bg-surface'"
                flat tile dense class="px-2">
                <v-col cols="auto" class="mr-1">
                  <cc-avatar v-if="p.avatar"
                    :avatar="p.avatar"
                    size="48" />
                  <cc-img v-else-if="p.portrait"
                    :src="p.portrait"
                    height="48"
                    width="48" />
                  <v-icon v-else
                    size="48"
                    icon="cc:pilot"
                    class="text-primary" />
                </v-col>
                <v-col>
                  <div class="heading h3">
                    {{ p.title }}
                    <span v-if="p.player"
                      class="text-cc-overline text-disabled">({{ p.player }})</span>
                  </div>
                  <div class="text-cc-overline">
                    <cc-slashes />
                    <span v-if="p.mechName">{{ p.mechName }}</span>
                    {{ p.frameInfo }}
                  </div>
                </v-col>
              </v-row>
            </cc-panel>
          </v-col>
          <v-col>
            <cc-panel color="panel"
              flat
              tile
              class="pb-4">
              <div class="heading" h3><cc-slashes /> {{ $t('active.encSummary.npcs') }}</div>
              <v-divider class="mb-2" />
              <v-row v-for="(n, i) in encounter.Combatants.sort((a, b) =>
                a.side.localeCompare(b.side)
              ).filter((c) => (c.playerCount ?? 1) <= 1 || (c.playerCount ?? 1) <= pilots.length)"
                :key="n.id"
                :class="Number(i) % 2 === 0 ? 'bg-background' : 'bg-surface'"
                flat tile dense class="px-2">
                <v-col cols="auto" class="mr-n2">
                  <v-icon size="48" :icon="n.actor.Icon" />
                </v-col>
                <v-col cols="auto" class="mr-1">
                  <cc-img v-if="n.actor.Portrait"
                    :src="n.actor.Portrait"
                    height="48"
                    width="48" />
                  <v-icon v-else size="48" :icon="n.actor.TagIcon" />
                </v-col>
                <v-col>
                  <div class="heading h3">{{ n.actor.Name }}</div>
                  <div class="text-cc-overline">
                    <span v-if="n.actor.NpcClassController?.Tier" class="pr-1">
                      {{ $t('gm.npcStats.tier', { n: n.actor.NpcClassController?.Tier }) }}
                    </span>
                    <span v-if="n.actor.NpcClassController?.Class" class="pr-1">
                      {{ n.actor.NpcClassController?.Class.Name }}
                    </span>
                    <span v-if="n.actor.Tag" class="pr-1">{{ n.actor.Tag }}</span>
                    <span v-if="n.actor.NpcTemplateController?.Templates.length">
                      <cc-slashes />
                      {{ n.actor.NpcTemplateController?.Templates.map((t) => t.Name).join(', ') }}
                    </span>
                  </div>
                  <div v-if="n.reinforcement"
                    class="bg-panel text-center text-cc-overline pa-0">
                    {{ $t('active.encSummary.reinforcement') }}
                    <span v-if="n.reinforcementTurn">{{ $t('active.encSummary.turnN', { n: n.reinforcementTurn }) }}</span>
                  </div>
                </v-col>
                <v-col cols="auto" class="pr-0">
                  <v-chip size="x-small" flat tile class="text-cc-overline" :color="n.side">
                    {{ n.side }}
                  </v-chip>
                </v-col>
              </v-row>
            </cc-panel>
          </v-col>
        </v-row>
        <cc-button block
          color="success"
          :disabled="!pilots.length && !placeholders.length"
          :prepend-icon="pilots.length && placeholders.length
            ? 'mdi-arrow-right-bold-hexagon-outline' : 'mdi-alert'"
          @click="emit('create', true)">
          <span v-if="!pilots.length && !placeholders.length">
            {{ $t('active.encSummary.requiresPilot') }}
          </span>
          <span v-else>{{ $t('active.encSummary.createAndLaunch') }}</span>
        </cc-button>
        <v-row v-if="pilots.length || placeholders.length"
          dense class="mt-1">
          <v-col cols="3">
            <cc-button block size="small" color="error"
              prepend-icon="mdi-close"
              @click="emit('cancel')">
              {{ $t('common.cancel') }}
            </cc-button>
          </v-col>
          <v-col>
            <cc-button block size="small" color="primary"
              prepend-icon="mdi-content-save"
              @click="emit('create', false)">
              {{ $t('active.encSummary.createReturnLibrary') }}
            </cc-button>
          </v-col>
        </v-row>
      </cc-panel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Placeholder } from '@/classes/encounter/Placeholder'
import type { Pilot } from '@/classes/pilot/Pilot'
import type { Encounter } from '@/classes/encounter/Encounter'
const props = defineProps<{
  encounter: Encounter
  pilots: Pilot[]
  placeholders: Placeholder[]
}>()

const participants = computed(() => [
  ...props.pilots.map((p) => ({
    key: p.ID,
    avatar: p.PortraitController?.Avatar,
    portrait: p.Portrait as string | undefined,
    title: p.Callsign || p.Name || 'Unnamed Pilot',
    player: p.PlayerName as string | undefined,
    mechName: undefined as string | undefined,
    frameInfo: p.ActiveMech && p.ActiveMech.Frame
      ? `${p.ActiveMech.Frame.Source} ${p.ActiveMech.Frame.Name}`
      : 'No Active Mech',
  })),
  ...props.placeholders.map((p) => ({
    key: p.ID,
    avatar: undefined,
    portrait: undefined as string | undefined,
    title: p.Name || 'Unnamed Pilot',
    player: undefined as string | undefined,
    mechName: p.Mechname,
    frameInfo: p.Mechname ? '' : 'No Active Mech',
  })),
])

const emit = defineEmits<{
  'create': [launch: boolean]
  'cancel': []
}>()
</script>
