<template>
  <div class="text-black pa-2">
    <v-row dense
      align="start"
      class="print-section">
      <v-col class="mr-4"
        cols="auto">
        <div class="text-caption text-primary mb-n3">{{ $t('pm.new.callsign') }}</div>
        <div v-if="blank"
          style="min-width: 250px">
          <blank-line :height="40" />
        </div>
        <div v-else
          class="heading h2">
          {{ pilot.Callsign }}
        </div>
        <div v-if="!blank"
          class="my-n2">
          <div class="text-caption">
            {{ pilot.Name }}{{ $t('pm.common.commaLl') }}
            <b>{{ pilot.Level }}</b>
          </div>
        </div>
      </v-col>
      <v-col v-if="blank && landscape"
        cols="auto">
        <div class="text-caption text-primary mb-n1">{{ $t('pm.print.name') }}</div>
        <blank-line :width="260"
          :height="40" />
      </v-col>
      <v-col cols="auto ml-auto">
        <v-row justify="space-between"
          class="text-center">
          <v-col v-if="blank"
            cols="auto">
            <div class="text-caption mb-n2">{{ $t('stats.hp') }}</div>
            <div>
              <v-icon size="50"
                color="primary"
                style="opacity: 0.5">mdi-hexagon-outline</v-icon>
              <b v-if="!blank"
                class="flavor-text pt-3 text-black"
                v-text="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">{{ $t('stats.armor') }}</div>
            <v-icon v-if="blank"
              size="50"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.Armor" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">{{ $t('stats.edef') }}</div>
            <v-icon v-if="blank"
              size="50"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.EDefense" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">{{ $t('stats.evasion') }}</div>
            <v-icon v-if="blank"
              size="50"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.Evasion" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">{{ $t('stats.speed') }}</div>
            <v-icon v-if="blank"
              size="50"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.Speed" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto"
        class="text-right ml-4">
        <div class="text-caption mr-9">{{ $t('pm.print.grit') }}</div>
        <v-icon v-if="blank"
          size="50"
          color="primary"
          style="opacity: 0.5"
          class="mt-n2 mr-4">
          mdi-hexagon-outline
        </v-icon>
        <div v-else
          class="heading mt-n5"
          style="font-size: 65px; line-height: 60px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
    </v-row>

    <v-row dense
      justify="space-between"
      class="mt-n3 print-section">
      <v-col>
        <div class="text-caption text-primary">{{ $t('pm.print.skillTRIGGERS') }}</div>
        <div class="text-left">
          <v-row v-if="blank"
            dense
            class="mt-n2">
            <v-col v-for="n in 6"
              :key="`skill-${n}`"
              cols="6">
              <v-row dense
                align="center">
                <v-col cols="9"><blank-line :height="24"
                    inline /></v-col>
                <v-col cols="auto"
                  class="heading h3 mr-n1 mt-n1">+</v-col>
                <v-col cols="2"><blank-line :height="24"
                    inline /></v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-chip v-for="s in pilot.SkillsController.Skills"
            v-else
            :key="s.Skill.ID"
            label
            variant="outlined"
            size="small"
            class="mx-1">
            <span class="stat-text ml-n1 mr-1">+{{ s.Bonus }}</span>
            <span>{{ s.Skill.Trigger }}</span>
          </v-chip>
        </div>
      </v-col>
      <v-col cols="4">
        <v-row class="mt-0 text-right mt-n2 pr-2">
          <v-col>
            <div class="font-weight-bold caption">{{ $t('stats.hull') }}</div>
            <v-icon v-if="blank"
              size="30"
              color="primary"
              style="opacity: 0.5"
              class="mt-n1">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Hull"
              class="heading h2 mt-n2" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">{{ $t('stats.agi') }}</div>
            <v-icon v-if="blank"
              size="30"
              color="primary"
              style="opacity: 0.5"
              class="mr-n1 mt-n1">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Agi"
              class="heading h2 mt-n2" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">{{ $t('stats.sys') }}</div>
            <v-icon v-if="blank"
              size="30"
              color="primary"
              style="opacity: 0.5"
              class="mr-n1 mt-n1">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Sys"
              class="heading h2 mt-n2" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">{{ $t('stats.eng') }}</div>
            <v-icon v-if="blank"
              size="30"
              color="primary"
              style="opacity: 0.5"
              class="mr-n1 mt-n1">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Eng"
              class="heading h2 mt-n2" />
          </v-col>
        </v-row>
        <v-row v-if="blank"
          dense
          class="mt-n2">
          <v-col v-for="n in 2"
            :key="`extra-skill-${n}`"
            cols="12">
            <v-row dense
              align="center">
              <v-col cols="9"><blank-line :height="24"
                  inline /></v-col>
              <v-col cols="auto"
                class="heading h3 mr-n1 mt-n1">+</v-col>
              <v-col cols="2"><blank-line :height="24"
                  inline /></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row dense
      class="mt-n2">
      <v-col>
        <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('pm.new.talents') }}</div>
        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 12"
            :key="`talent-${n}`"
            :cols="landscape
              ? hasPilotOption('Pilot Portrait')
                ? 6
                : 3
              : 6
              ">
            <blank-line :height="24"
              inline />
          </v-col>
        </v-row>
        <v-chip v-for="t in pilot.TalentsController.Talents"
          v-else-if="hasPilotOption('Separate Talent Detail')"
          :key="t.Talent.ID"
          label
          variant="outlined"
          size="small"
          class="caption mx-1 mt-1">
          <v-icon :icon="`cc:rank_${t.Rank}`"
            color="primary"
            class="ml-n2" />
          {{ t.Talent.Name }}
          {{ 'I'.repeat(t.Rank) }}
        </v-chip>
        <v-row v-for="t in pilot.TalentsController.Talents"
          v-else
          :key="t.Talent.ID + '-detail'"
          dense
          justify="space-between"
          class="mt-n1 caption"
          style="position: relative">
          <v-col>
            <fieldset>
              <legend class="heading ml-1 px-2">{{ t.Talent.Name }}</legend>
              <v-row v-for="n in t.Rank"
                :key="`rank-${n}`"
                align="center"
                dense
                class="my-n1">
                <v-col cols="auto"
                  class="mr-2">
                  <v-icon :icon="`cc:rank_${n}`"
                    color="grey-darken-2"
                    class="mb-1" />
                </v-col>
                <v-col>
                  <div v-html-safe="t.Talent.Ranks[n - 1].Description" />
                  <print-action v-if="t.Talent.Ranks[n - 1].Actions.length"
                    :compact="true"
                    :actions="t.Talent.Ranks[n - 1].Actions" />
                  <print-deployable v-if="t.Talent.Ranks[n - 1].Deployables.length"
                    :compact="true"
                    :deployables="t.Talent.Ranks[n - 1].Deployables" />
                </v-col>
              </v-row>
            </fieldset>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="hasPilotOption('Pilot Portrait')"
        cols="4"
        class="mt-5">
        <v-card height="100%"
          variant="outlined"
          color="grey">
          <v-row style="height: 100%"
            align="center">
            <v-col>
              <print-img v-if="!blank && pilot.HasPortrait"
                :src="pilot.Portrait"
                cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length || blank"
      class="text-caption mb-n2 text-primary">
      {{ $t('pm.print.coreBONUSES2') }}
    </div>
    <v-row v-if="blank"
      dense>
      <v-col v-for="n in 4"
        :key="`cb-${n}`"
        :cols="landscape ? (hasPilotOption('Pilot Portrait') ? 6 : 3) : 6
          ">
        <blank-line :height="24"
          inline />
      </v-col>
    </v-row>

    <v-row v-for="b in pilot.CoreBonusController.CoreBonuses"
      v-else-if="pilot.CoreBonusController.CoreBonuses.length"
      :key="b.ID"
      dense
      justify="space-between"
      class="mt-n1 caption">
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Name }}</legend>
          <div v-html-safe="b.Effect" />
        </fieldset>
      </v-col>
    </v-row>

    <div class="text-caption mb-n3 text-primary">{{ $t('pm.print.pilotLOADOUT') }}</div>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption">
      <v-col v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        :key="a.ID"
        style="position: relative; break-inside: avoid">
        <fieldset v-if="a">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ a.Name }}
              <span class="text-caption flavor-text">{{ $t('pm.print.armor2') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('pm.print.pilotArmor') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else>
            <v-row dense
              justify="space-around">
              <v-col cols="auto">
                <v-icon icon="mdi-shield-outline" />
                <span v-text="`+${a.Armor(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="cc:edef" />
                <span v-text="`${a.EDefense(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="cc:evasion" />
                <span v-text="`${a.Evasion(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="mdi-heart-outline" />
                <span v-text="`${a.HPBonus(pilot) ? `+${a.HPBonus(pilot)}` : ''}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
                <span v-text="`${a.Speed(pilot) ? `${a.Speed(pilot)}` : ''}`" />
              </v-col>
            </v-row>
            <print-action :compact="true"
              :actions="a.Actions" />
            <print-deployable :compact="true"
              :deployables="a.Deployables" />
            <div class="text-right">
              <v-chip v-for="t in a.Tags"
                v-show="showTag(t.ID)"
                :key="t.ID"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bg-white">
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
      <v-col v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        :key="w.ID"
        style="position: relative">
        <fieldset v-if="w || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ w.Name }}
              <span class="text-caption flavor-text">{{ $t('pm.print.weapon2') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('pm.print.pilotWeapon') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else>
            <span v-for="(r, ri) in w.Range"
              :key="`range-${ri}`">
              <v-icon size="15"
                :icon="r.Icon" />
              {{ r.Value }}
            </span>
            <span v-for="(d, di) in w.Damage"
              :key="`damage-${di}`">
              <v-icon size="20"
                :icon="d.Icon"
                :color="d.Color" />
              {{ d.Value }}
            </span>
            <div v-if="w.Effect"
              v-html-safe="w.Effect" />
            <print-action :compact="true"
              :actions="w.Actions" />
            <print-deployable :compact="true"
              :deployables="w.Deployables" />
            <div class="text-right">
              <v-chip v-for="t in w.Tags"
                v-show="showTag(t.ID)"
                :key="t.ID"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bh-white">
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption pb-3">
      <v-col v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        :key="g.ID"
        style="position: relative">
        <fieldset v-if="g || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ g.Name }}
              <span class="text-caption flavor-text">{{ $t('pm.print.gear') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('compendium.categories.pilotGear') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else
            class="pb-1">
            <div v-if="g.Description"
              v-html-safe="g.Description" />
            <print-action :compact="true"
              :actions="g.Actions" />
            <print-deployable :compact="true"
              :deployables="g.Deployables" />
            <div class="text-right">
              <v-chip v-for="t in g.Tags"
                v-show="showTag(t.ID)"
                :key="t.ID"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bg-white">
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <v-row dense
      justify="space-between"
      class="mt-n4 caption pb-3">
      <v-col v-for="n in 3"
        v-if="hasPilotOption('Extra Equipment Space')"
        :key="`equip-${n}`"
        style="position: relative">
        <fieldset>
          <legend class="heading ml-1 px-1">
            <blank-line :width="150"
              :height="20" />
          </legend>
          <div style="height: 150px" />
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="!blank && pilot.ReservesController.Reserves.length">
      <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('pm.print.reserves') }}</div>
      <v-row dense>
        <v-col
          v-for="(r, index) in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
          :key="`reserve-${index}`"
          style="min-width: 18vw">
          <fieldset>
            <legend class="heading caption mb-n1 text-primary px-1">{{ r.Name }}</legend>
            <div v-if="r.ResourceName || r.Note || r.ResourceCost">
              <b class="caption">{{ r.ResourceName }}</b>
              <div class="caption">{{ r.Note }}</div>
              <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
            </div>
            <blank-line v-else
              :height="50"
              class="my-1"
              style="min-height: 50px; height: 85%" />
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div v-if="blank"
      class="pa-2 mt-n5">
      <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('pm.print.reserves') }}</div>
      <v-row dense>
        <v-col v-for="r in hasPilotOption('Extra Reserve Space') ? 9 : 6"
          :key="`reserve-${r}`"
          cols="4">
          <fieldset class="mt-2"
            style="position: relative">
            <legend class="px-1">
              <blank-line :height="26"
                :width="200" />
            </legend>

            <blank-line :height="10"
              class="my-1"
              style="min-height: 26px; height: 80%" />
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div v-if="hasPilotOption('Appearance Notes')">
      <div class="text-overline text-primary"
        style="line-height: 0">{{ $t('pm.new.appearance') }}</div>
      <div v-if="blank"
        class="mb-4">
        <notes :rows="5"
          lined />
      </div>
      <div v-else
        v-html-safe="pilot.TextAppearance"
        class="mt-2 caption" />
    </div>
    <div v-if="hasPilotOption('Pilot Biography')">
      <div class="text-overline text-primary"
        style="line-height: 0">{{ $t('pm.new.biography') }}</div>
      <div v-if="blank"
        class="mb-4">
        <notes :rows="5"
          lined />
      </div>
      <div v-else
        v-html-safe="pilot.History"
        class="mt-2 caption" />
    </div>
    <div v-if="hasPilotOption('Pilot Notes')">
      <div class="text-overline text-primary"
        style="line-height: 0">{{ $t('pm.print.notes') }}</div>
      <div v-if="blank"
        class="mb-4">
        <notes :rows="5"
          lined />
      </div>
      <div v-else
        v-html-safe="pilot.Notes"
        class="mt-2 caption" />
    </div>
  </div>

  <fieldset v-if="hasPilotOption('Append Lined Section')"
    class="mx-1 my-3 px-3">
    <div class="mb-4">
      <notes :rows="16"
        lined />
    </div>
  </fieldset>

  <fieldset v-if="hasPilotOption('Append Unlined Section')"
    class="mx-1 my-3 px-3">
    <div class="mb-4">
      <notes :rows="16" />
    </div>
  </fieldset>

  <div v-for="t in pilot.TalentsController.Talents"
    v-if="hasPilotOption('Separate Talent Detail')"
    :key="t.Talent.ID"
    no-gutters
    justify="space-between"
    class="mt-n1 caption px-2"
    style="position: relative">
    <fieldset class="pb-2 my-2">
      <legend class="heading h3 ml-1 px-2">{{ t.Talent.Name }}</legend>
      <v-row v-for="n in t.Rank"
        :key="`rank-${n}`"
        align="center"
        dense
        class="my-n1">
        <v-col cols="auto"
          class="mr-2">
          <v-icon :icon="`cc:rank_${n}`"
            color="primary"
            size="large"
            class="mb-1" />
        </v-col>
        <v-col>
          <div v-html-safe="t.Talent.Ranks[n - 1].Description" />
          <print-action v-if="t.Talent.Ranks[n - 1].Actions.length"
            :compact="true"
            :actions="t.Talent.Ranks[n - 1].Actions" />
          <print-deployable v-if="t.Talent.Ranks[n - 1].Deployables.length"
            :compact="true"
            :deployables="t.Talent.Ranks[n - 1].Deployables" />
        </v-col>
      </v-row>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import PrintAction from '../../components/PrintAction.vue';
import PrintDeployable from '../../components/PrintDeployable.vue';
import { usePrintOptions } from '../usePrintOptions';

defineOptions({ name: 'PilotPrint' })

const props = defineProps<{
  pilot: Pilot
  options: object
}>()

const { blank, landscape, hasPilotOption, showTag } = usePrintOptions(props)
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
