<template>
  <cc-compendium-browser :items="baseTalents"
    item-type="Talent"
    :options="options"
    :active-ids="activeTalentIds"
    outline-selected
    view-key="sel-talent"
    page-scroll>
    <template #item="{ item }">
      <cc-talent :talent="item"
        :rank="pilot.TalentsController.getTalentRank(item.ID)"
        :can-add="canAdd(item.ID)"
        hide-change
        selectable
        @add="pilot.TalentsController.AddTalent(item)"
        @remove="pilot.TalentsController.RemoveTalent(item)" />
    </template>

    <template #header>
      <div class="text-right">
        <selector-options-menu :disabled="!pilot.TalentsController.Talents.length"
          @reset="pilot.TalentsController.ClearTalents()" />
      </div>
    </template>

    <template #top>
      <missing-item-alert v-if="pilot.TalentsController.MissingTalents.length"
        :type="$t('common.talents')"
        :items="pilot.TalentsController.MissingTalents"
        @remove="pilot.TalentsController.RemoveTalent($event)" />

      <selector-header :current="pilot.TalentsController.CurrentTalentPoints"
        :max="pilot.TalentsController.MaxTalentPoints"
        :complete="complete"
        :complete-text="$t('pm.selectors.talentSelectionComplete')">
        <selector-chip v-for="t in pilot.TalentsController.Talents"
          :key="t.Talent.ID"
          @remove="pilot.TalentsController.RemoveTalent(t.Talent)">
          {{ t.Talent.Name }}&nbsp;<b>{{ 'I'.repeat(t.Rank) }}</b>
        </selector-chip>
      </selector-header>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores'
import { Rules } from '@/classes/utility/Rules'
import { Pilot } from '@/classes/pilot/Pilot'
import { Talent } from '@/classes/pilot/components/talent/Talent'
import MissingItemAlert from './components/_MissingItemAlert.vue'
import SelectorHeader from './components/_SelectorHeader.vue'
import SelectorChip from './components/_SelectorChip.vue'
import SelectorOptionsMenu from './components/_SelectorOptionsMenu.vue'
import { filterByLcpConfig } from './useLcpFilter'

const props = defineProps<{ pilot: Pilot }>()

const options = {
  views: ['list'],
  initialView: 'list',
  groups: ['none', 'lcp'],
  initialGroup: 'none',
  noSource: true,
}

const baseTalents = computed<Talent[]>(() =>
  filterByLcpConfig(
    CompendiumStore().Talents.filter((x: any) => !x.IsHidden),
    props.pilot.LcpConfig
  ).sort((a: any, b: any) => a.Name.localeCompare(b.Name))
)

const activeTalentIds = computed<string[]>(() =>
  props.pilot.TalentsController.Talents.map((x: any) => x.Talent.ID)
)

const complete = computed(
  () =>
    props.pilot.TalentsController.HasFullTalents &&
    (props.pilot.Level === 0 ||
      props.pilot.TalentsController.Talents.length >= Rules.MinimumPilotTalents)
)

function canAdd(id: string) {
  if (props.pilot.Level === 0) {
    return (
      props.pilot.TalentsController.getTalentRank(id) === 0 &&
      !props.pilot.TalentsController.HasFullTalents
    )
  }
  return !props.pilot.TalentsController.HasFullTalents
}
</script>
