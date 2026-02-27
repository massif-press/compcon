<template>
  <selector
    title="Pilot Skill Triggers"
    :success="!pilot.SkillsController.IsMissingSkills && enoughSelections"
    :flat="flat"
    :modal="modal"
    :selected="pilot.SkillsController.CurrentSkillPoints"
    :total="pilot.SkillsController.MaxSkillPoints"
  >
    <template #float>
      <v-card
        v-if="!pilot.SkillsController.IsMissingSkills && enoughSelections"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="'Skill Selection Complete'"
      />
      <v-card
        v-if="pilot.SkillsController.MaxSkillPoints > pilot.SkillsController.CurrentSkillPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="
          `${pilot.SkillsController.MaxSkillPoints - pilot.SkillsController.CurrentSkillPoints}
            Skill Points remaining`
        "
      />

      <cc-button
        variant="text"
        size="x-small"
        block
        :disabled="!pilot.SkillsController.Skills.length"
        @click="
          pilot.SkillsController.ClearSkills()
          $emit('reset')
        "
      >
        Reset
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select
          v-model="jump"
          label="jump to"
          color="primary"
          variant="outlined"
          :items="jumpItems"
        />
      </div>
    </template>

    <template #right-column>
      <div
        v-for="h in headers"
        :key="`header_${h.attr}`"
        class="mb-4"
      >
        <div
          v-if="h.attr !== 'Custom'"
          class="text-cc-overline"
        >
          Your Ability To
        </div>
        <div
          v-if="mobile"
          class="text-cc-overline text-accent mb-2"
        >
          {{ h.description }}
        </div>
        <cc-title
          v-else
          class="py-1 mb-2"
        >
          {{ h.description }}
        </cc-title>
        <skill-select-item
          v-for="s in skills[h.attr]"
          :id="`skill_${s.ID}`"
          :key="`skill_${s.ID}`"
          :skill="s"
          :bonus="pilot.SkillsController.GetSkill(s.ID)?.Bonus || 0"
          :can-add="pilot.SkillsController.CanAddSkill(s)"
          :can-remove="pilot.SkillsController.CanRemoveSkill(s)"
          @add="pilot.SkillsController.AddSkill(s)"
          @remove="pilot.SkillsController.RemoveSkill(s)"
        />
      </div>
      <add-custom-skill
        :pilot="pilot"
        @add-custom="pilot.SkillsController.AddCustomSkill($event)"
      />
      <div style="height: 12px" />
    </template>
  </selector>
</template>

<script lang="ts">
  import SkillSelectItem from './components/_SkillSelectItem.vue'
  import AddCustomSkill from './components/_AddCustomSkill.vue'
  import Selector from './components/_SelectorBase.vue'

  import { CompendiumStore } from '@/stores'
  import { Rules, Pilot } from '@/class'
  import { rules } from '@massif/lancer-data'

  import * as _ from 'lodash-es'
  import logger from '@/user/logger'

  export default {
    name: 'SkillSelector',
    components: { Selector, SkillSelectItem, AddCustomSkill },
    props: {
      pilot: { type: Pilot, required: true },
      levelUp: Boolean,
      modal: Boolean,
      flat: Boolean,
    },
    emits: ['reset'],
    data: () => ({
      search: '',
      jump: '',
    }),
    computed: {
      mobile() {
        return this.$vuetify.display.smAndDown
      },
      staticSkills() {
        return _.groupBy(this.baseSkills, 'Family')
      },
      flatSkills() {
        return this.baseSkills
      },
      baseSkills() {
        if (!this.pilot.LcpConfig) return CompendiumStore().Skills
        return CompendiumStore().Skills.filter(
          x =>
            !x.InLcp ||
            this.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew.LcpId) ||
            this.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew.LcpName)
        )
      },
      headers() {
        return rules.skill_headers
      },
      skills() {
        const cs = this.pilot.SkillsController.Skills.filter(x => x.IsCustom)
        if (cs.length) return { ...this.staticSkills, Custom: cs.map(x => x.Skill) }
        return this.staticSkills
      },
      newPilot(): boolean {
        return this.pilot.Level === 0
      },
      selectedMin(): number {
        return Rules.MinimumPilotSkills
      },
      enoughSelections(): boolean {
        return !(this.pilot.SkillsController.Skills.length < this.selectedMin)
      },
      selectionComplete(): boolean {
        return (this.newPilot || this.levelUp) && !this.pilot.SkillsController.IsMissingSkills
      },
      jumpItems() {
        return [
          ...this.pilot.SkillsController.Skills.map(x => ({
            title: x.Skill.Trigger,
            value: x.Skill.ID,
            subtitle: `// Pilot Rank: ${x.Rank} (+${x.Bonus})`,
          })),
          ...this.flatSkills
            .filter(x => !this.pilot.SkillsController.Skills.find(y => y.Skill.ID === x.ID))
            .map(x => ({
              title: x.Trigger,
              value: x.ID,
            })),
        ]
      },
    },
    watch: {
      jump(val) {
        this.scroll(val)
      },
    },
    methods: {
      scroll(id) {
        this.scrollTo(`skill_${id}`)
      },
      scrollTo(e: any): void {
        const el = document.getElementById(e)
        if (!el) {
          logger.warn(`Element with ID ${e} not found`, this)
          return
        }
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
    },
  }
</script>
