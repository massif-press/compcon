<template>
  <div class="text-black px-2">
    <v-row dense
      justify="space-around"
      align="center"
      class="print-section">
      <v-col cols="auto">
        <blank-line v-if="blank"
          :width="170"
          :height="24" />
        <div v-else
          class="heading h3">
          {{ pilot.Callsign }}
        </div>
        <div v-if="!blank"
          class="text-caption mt-n2">
          {{ pilot.Name }}
        </div>
      </v-col>

      <v-col cols="auto">
        <div>
          {{ $t('stats.hp') }}:
          <div class="d-inline-block mb-n1"><blank-line :height="24"
              :width="30" /></div>
          <span>/</span>
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MaxHP }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('stats.armor') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Armor }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('stats.edef') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.EDefense }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('stats.evasion') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Evasion }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('stats.speed') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Speed }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('pm.print.grit') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>+{{ pilot.Grit }}</b>
        </div>
      </v-col>
    </v-row>

    <v-divider />

    <div class="text-caption text-primary">{{ $t('pm.titles.skillTriggers') }}</div>

    <v-row dense
      justify="space-between"
      class="mt-n2 print-section">
      <v-col>
        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 6"
            :key="`skill-${n}`"
            cols="4">
            <blank-line :height="24" />
          </v-col>
        </v-row>
        <div v-else
          class="text-left">
          <v-chip v-for="s in pilot.SkillsController.Skills"
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

      <v-col cols="auto"
        class="px-1">
        <div>
          <span class="text-uppercase">{{ $t('pm.link.hull') }}</span>:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Hull }}</b>
        </div>
      </v-col>
      <v-col cols="auto"
        class="px-1">
        <div>
          {{ $t('stats.agi') }}:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Agi }}</b>
        </div>
      </v-col>
      <v-col cols="auto"
        class="px-1">
        <div>
          <span class="text-uppercase">{{ $t('pm.link.sys') }}</span>:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Sys }}</b>
        </div>
      </v-col>
      <v-col cols="auto"
        class="px-1">
        <div>
          <span class="text-uppercase">{{ $t('pm.link.eng') }}</span>:
          <blank-line v-if="blank"
            :width="30"
            :height="24"
            class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Eng }}</b>
        </div>
      </v-col>
    </v-row>

    <v-row dense
      class="mt-n1">
      <v-col :cols="blank ? 8 : 'auto'">
        <div class="text-caption mb-n1 text-primary">{{ $t('common.talents') }}</div>
        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 9"
            :key="`talent-${n}`"
            cols="4">
            <blank-line :height="24" />
          </v-col>
        </v-row>
        <v-chip v-for="t in pilot.TalentsController.Talents"
          v-else
          :key="t.Talent.ID"
          label
          variant="outlined"
          size="small"
          class="caption mx-1">
          <v-icon :icon="`cc:rank_${t.Rank}`"
            color="primary"
            class="ml-n2" />
          {{ t.Talent.Name }}
          {{ 'I'.repeat(t.Rank) }}
        </v-chip>
      </v-col>
      <v-col :cols="blank ? '' : 'auto'">
        <div v-if="pilot.CoreBonusController.CoreBonuses.length"
          class="text-caption mb-n1 text-primary">
          {{ $t('pm.level.coreBonuses') }}
        </div>

        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 3"
            :key="`cb-${n}`"
            cols="12">
            <blank-line :height="24" />
          </v-col>
        </v-row>

        <v-chip v-for="b in pilot.CoreBonusController.CoreBonuses"
          v-else
          :key="b.ID"
          label
          variant="outlined"
          size="small"
          class="caption mx-1">
          {{ b.Name }}
        </v-chip>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.pilotLoadout') }}</div>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption">
      <v-col v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        :key="a.ID"
        style="position: relative"
        class="no-print-break">
        <fieldset v-if="a">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ a.Name }}
              <span class="text-caption flavor-text">//{{ $t('stats.armor') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotArmor') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 75px" />
          <div v-else
            class="pb-2">
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
            <div class="text-right mb-n2">
              <v-chip v-for="t in a.Tags"
                v-show="showTag(t.ID)"
                :key="t.ID"
                size="x-small"
                label
                variant="outlined"
                class="ml-1 bg-white">
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
      <v-col v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        :key="w.ID"
        style="position: relative"
        class="no-print-break">
        <fieldset v-if="w || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ w.Name }}
              <span class="text-caption flavor-text">//{{ $t('common.weapon') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotWeapon') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 75px" />
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
            <print-action :compact="true"
              :actions="w.Actions" />
            <print-deployable :compact="true"
              :deployables="w.Deployables" />
            <div class="text-right"
              style="position: absolute; bottom: 10px; right: 5px">
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
      class="mt-n1 caption pb-1">
      <v-col v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        :key="g.ID"
        style="position: relative"
        class="no-print-break">
        <fieldset v-if="g || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ g.Name }}
              <span class="text-caption flavor-text">{{ $t('pm.print.gear') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotGear') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 75px" />
          <div v-else
            class="pb-1">
            <div v-if="g.Description"
              v-html-safe="g.Description" />
            <print-action :compact="true"
              :actions="g.Actions" />
            <print-deployable :compact="true"
              :deployables="g.Deployables" />
          </div>
          <div class="text-right">
            <v-chip v-for="t in g.Tags"
              v-show="showTag(t.ID)"
              :key="t.ID"
              size="x-small"
              label
              variant="outlined"
              class="ml-1 bg-white">
              {{ t.GetName() }}
            </v-chip>
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="!blank && pilot.ReservesController.Reserves.length">
      <div class="text-caption my-n1 text-primary">{{ $t('common.reserves') }}</div>
      <div class="pb-1">
        <v-chip v-for="r in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
          :key="r.ID"
          label
          variant="outlined"
          size="small"
          class="caption mx-1">
          <v-icon :icon="r.Icon"
            start />
          <div class="text-caption mb-n1 text-primary">{{ r.Name }}</div>
        </v-chip>
      </div>
    </div>

    <div v-if="blank"
      class="pa-2 mt-n5">
      <div class="text-caption mb-n1 mt-1 text-primary">{{ $t('common.reserves') }}</div>
      <v-row dense>
        <v-col v-for="r in hasPilotOption('Extra Reserve Space') ? 8 : 4"
          :key="`reserve-${r}`"
          cols="3">
          <blank-line :height="26" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import blankLine from '../../components/blank/line.vue';
import PrintAction from '../../components/PrintAction.vue';
import PrintDeployable from '../../components/PrintDeployable.vue';
import { usePrintOptions } from '../usePrintOptions';

defineOptions({ name: 'PilotPrint' })

const props = defineProps<{
  pilot: Pilot
  options: object
}>()

const { blank, hasPilotOption, showTag } = usePrintOptions(props)
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
