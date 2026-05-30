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
        <span class="text-disabled">Overview</span>
      </div>
      <cc-panel>
        <div class="heading h2">{{ encounter.Name }}</div>
        <div class="text-cc-overline">
          <span class="text-disabled">ENVIRONMENT <cc-slashes /></span>
          {{ encounter.Environment.Name }} &mdash;
          <span class="text-disabled">SITREP <cc-slashes /></span>
          {{ encounter.Sitrep.Name }}
        </div>
        <v-row class="mt-1 mb-2">
          <v-col>
            <cc-panel color="panel"
              flat
              tile
              class="pb-4">
              <div class="heading" h3><cc-slashes /> pilots</div>
              <v-divider class="mb-2" />
              <v-row v-for="(p, i) in pilots.concat(placeholders)"
                :key="p.ID"
                :class="i % 2 === 0 ? 'bg-background' : 'bg-surface'"
                flat tile dense class="px-2">
                <v-col cols="auto" class="mr-1">
                  <cc-avatar v-if="p.PortraitController && p.PortraitController.Avatar"
                    :avatar="p.PortraitController.Avatar"
                    size="48" />
                  <cc-img v-else-if="p.Portrait"
                    :src="p.Portrait"
                    height="48"
                    width="48" />
                  <v-icon v-else
                    size="48"
                    icon="cc:pilot"
                    class="text-primary" />
                </v-col>
                <v-col>
                  <div class="heading h3">
                    {{ p.Callsign || p.Name || 'Unnamed Pilot' }}
                    <span v-if="p.PlayerName"
                      class="text-cc-overline text-disabled">({{ p.PlayerName }})</span>
                  </div>
                  <div class="text-cc-overline">
                    <cc-slashes />
                    <span v-if="p.Mechname">{{ p.Mechname }}</span>
                    {{ p.ActiveMech && p.ActiveMech.Frame
                      ? `${p.ActiveMech.Frame.Source} ${p.ActiveMech.Frame.Name}`
                      : p.Mechname ? '' : 'No Active Mech' }}
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
              <div class="heading" h3><cc-slashes /> NPCs</div>
              <v-divider class="mb-2" />
              <v-row v-for="(n, i) in encounter.Combatants.sort((a, b) =>
                a.side.localeCompare(b.side)
              ).filter((c) => c.playerCount <= 1 || c.playerCount <= pilots.length)"
                :key="n.ID"
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
                      Tier {{ n.actor.NpcClassController?.Tier }}
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
                    Reinforcement
                    <span v-if="n.reinforcementTurn">(TURN {{ n.reinforcementTurn }})</span>
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
            An encounter requires at least one pilot.
          </span>
          <span v-else>Create and Launch Encounter</span>
        </cc-button>
        <v-row v-if="pilots.length || placeholders.length"
          dense class="mt-1">
          <v-col cols="3">
            <cc-button block size="small" color="error"
              prepend-icon="mdi-close"
              @click="emit('cancel')">
              Cancel
            </cc-button>
          </v-col>
          <v-col>
            <cc-button block size="small" color="primary"
              prepend-icon="mdi-content-save"
              @click="emit('create', false)">
              Create and return to library
            </cc-button>
          </v-col>
        </v-row>
      </cc-panel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  encounter: any
  pilots: any[]
  placeholders: any[]
}>()

const emit = defineEmits<{
  'create': [launch: boolean]
  'cancel': []
}>()
</script>
