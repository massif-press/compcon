<template>
  <missing-item-alert v-if="pilot.TalentsController.MissingTalents.length"
    type="talents"
    :items="pilot.TalentsController.MissingTalents"
    @remove="pilot.TalentsController.RemoveTalent($event)" />

  <selector :title="$t('common.pilotTalents')"
    :success="pilot.TalentsController.HasFullTalents && enoughSelections"
    :flat="flat"
    :modal="modal"
    :selected="pilot.TalentsController.CurrentTalentPoints"
    :total="pilot.TalentsController.MaxTalentPoints">
    <template #float>
      <v-card v-if="pilot.TalentsController.HasFullTalents && enoughSelections"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="$t('pm.selectors.talentSelectionComplete')" />
      <v-card
        v-if="pilot.TalentsController.MaxTalentPoints > pilot.TalentsController.CurrentTalentPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="`${pilot.TalentsController.MaxTalentPoints - pilot.TalentsController.CurrentTalentPoints}
            Talent Selections remaining`
          " />

      <cc-button variant="text"
        size="x-small"
        block
        :disabled="!pilot.TalentsController.Talents.length"
        @click="pilot.TalentsController.ClearTalents()">
        {{ $t('common.reset') }}
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select v-model="jump"
          :label="$t('pm.fields.jumpTo')"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <cc-talent v-for="t in talents"
        :id="`talent_${t.ID}`"
        :key="`talent_${t.ID}`"
        :talent="t"
        :rank="pilot.TalentsController.getTalentRank(t.ID)"
        :can-add="canAdd(t.ID)"
        hide-change
        selectable
        @add="pilot.TalentsController.AddTalent(t)"
        @remove="pilot.TalentsController.RemoveTalent(t)" />
    </template>
  </selector>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { Rules } from '@/classes/utility/Rules'
import { Pilot } from '@/classes/pilot/Pilot'
import { Talent } from '@/classes/pilot/components/talent/Talent'
import { accentInclude } from '@/classes/utility/accent_fold'
import logger from '@/user/logger'
import Selector from './components/_SelectorBase.vue'
import MissingItemAlert from './components/_MissingItemAlert.vue'

const props = withDefaults(defineProps<{
  pilot: Pilot
  levelUp?: boolean
  modal?: boolean
  flat?: boolean
}>(), { levelUp: false, modal: false, flat: false })

const { smAndDown: mobile } = useDisplay()

const search = ref('')
const jump = ref('')

const newPilot = computed(() => props.pilot.Level === 0)
const selectedMin = computed(() => Rules.MinimumPilotTalents)

const enoughSelections = computed(() =>
  props.pilot.Level === 0 ||
  !(props.pilot.TalentsController.Talents.length < selectedMin.value)
)

const selectionComplete = computed(() =>
  (newPilot.value || props.levelUp) && props.pilot.TalentsController.HasFullTalents
)

const allTalents = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().Talents
  return CompendiumStore().Talents.filter(
    (x: any) =>
      !x.InLcp ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packID === x.Brew?.LcpId) ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packName === x.Brew?.LcpName)
  )
})

const talents = computed<Talent[]>(() => {
  const ts = allTalents.value.filter((x: any) => !x.IsHidden)
  if (search.value) return ts.filter((x: any) => accentInclude(x.Name, search.value))
  return ts
})

const jumpItems = computed(() => [
  ...props.pilot.TalentsController.Talents.map((x: any) => ({
    title: x.Talent.Name,
    value: x.Talent.ID,
    subtitle: `// Pilot Rank ${x.Rank}`,
  })),
  ...talents.value
    .filter((x: any) => !props.pilot.TalentsController.Talents.some((y: any) => y.Talent.ID === x.ID))
    .map((x: any) => ({ title: x.Name, value: x.ID })),
])

watch(jump, (val) => scroll(val))

function scrollTo(e: string): void {
  const el = document.getElementById(e)
  if (!el) {
    logger.warn(`Element with ID ${e} not found`, null)
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scroll(id: string) {
  scrollTo(`talent_${id}`)
}

function canAdd(id: string) {
  if (newPilot.value) {
    return (
      props.pilot.TalentsController.getTalentRank(id) === 0 &&
      !props.pilot.TalentsController.HasFullTalents
    )
  }
  return !props.pilot.TalentsController.HasFullTalents
}
</script>
