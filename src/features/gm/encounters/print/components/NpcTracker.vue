<template>
  <v-card
    class="pa-2 text-caption mx-1 mb-1 no-print-break"
    variant="outlined"
    :style="`border-color: ${borderColor}`"
  >
    <div class="text-right">
      <span
        v-if="combatant.playerCount > 1"
        cols="auto"
      >
        <v-icon
          icon="mdi-account-group"
          color="accent"
          class="mr-1 mt-n1"
          size="small"
        />
        <i18n-t
          keypath="gm.encPrint.atLeastPcs"
          tag="span"
          scope="global"
        >
          <template #count>
            <b>{{ combatant.playerCount }}</b>
          </template>
        </i18n-t>
      </span>
      <span
        v-if="combatant.reinforcement"
        cols="auto"
      >
        <v-icon
          icon="mdi-refresh"
          color="accent"
          class="mr-1"
        />
        {{ $t('common.reinforcement') }}
      </span>
      <span
        v-if="combatant.reinforcement && combatant.reinforcementTurn > 0"
        cols="auto"
      >
        <cc-slashes />
        {{ $t('gm.encPrint.reinforcesOnTurn', { turn: combatant.reinforcementTurn }) }}
      </span>
    </div>

    <v-row
      dense
      class="text-center"
      justify="space-between"
    >
      <v-col cols="auto">
        <div class="heading">{{ npc.Name }}</div>
      </v-col>
      <!-- <v-col cols="auto">
        <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
        {{ npc.StatController.getMax('Activations') }}
      </v-col>
      <v-col cols="auto">
        <v-icon v-for="n in npc.StatController.getMax('Activations')" icon="cc:activate" />
      </v-col> -->
      <v-col cols="auto">
        <v-icon icon="mdi-checkbox-blank-outline" />
        <v-icon icon="mdi-skull" />
      </v-col>
    </v-row>

    <v-row
      dense
      class="text-center mt-n3"
      justify="space-around"
    >
      <v-col
        v-for="s in npc.StatController.TrackableStats"
        :key="s.key"
        cols="auto"
      >
        <div class="text-caption mb-n1 text-uppercase">{{ s.key }}</div>
        <blank-line
          :height="20"
          :width="60"
          class="d-inline-block mb-n1"
        />
        <b
          class="flavor-text pt-3 text-black"
          v-text="`/${getBonusVal(s.key)}`"
        />
      </v-col>
    </v-row>

    <div class="text-center mt-1">
      <v-chip
        v-for="s in statuses"
        :key="s.ID"
        prepend-icon="mdi-checkbox-blank-outline"
        size="small"
        variant="outlined"
        color="grey-darken-4"
        style="border-color: lightgrey"
        class="mx-2"
      >
        <v-icon
          :icon="s.Icon"
          size="large"
          class="mt-n1"
        />
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import BlankLine from '@/ui/components/print/BlankLine.vue'
  import { CompendiumStore } from '@/stores'

  const props = defineProps<{ combatant: Record<string, any> }>()

  const npc = computed(() => props.combatant.npc)
  const statuses = computed(() => CompendiumStore().Statuses)
  const borderColor = computed(() =>
    props.combatant.side === 'enemy'
      ? 'red'
      : props.combatant.side === 'ally'
        ? 'green'
        : 'lightgrey'
  )

  function getBonusVal(key: string) {
    return npc.value.StatController.getMaxWithBonuses(key)
  }
</script>
