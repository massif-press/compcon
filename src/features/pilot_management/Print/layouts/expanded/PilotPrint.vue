<template>
  <div class="text-black px-2">
    <v-row dense
      class="print-section">
      <v-col>
        <v-row dense
          align="center"
          class="mt-2">
          <v-col :cols="blank ? '' : 'auto'"
            class="pr-6 mt-n1">
            <div class="text-caption text-primary h0 mt-1">{{ $t('common.callsign') }}</div>
            <blank-line v-if="blank"
              :height="38"
              class="mt-2" />
            <div v-else
              class="heading h2 ml-2"
              style="font-size: 52px; line-height: 50px">
              {{ pilot.Callsign }}
            </div>
          </v-col>
          <v-col cols="auto"
            class="ml-auto mt-n2">
            <div class="text-caption text-primary h0 mt-n1">{{ $t('ui.fields.licenseLevel') }}</div>
            <blank-line v-if="blank"
              :height="38"
              class="mb-n3 mt-2" />
            <div v-else
              class="heading h2 text-right">
              {{ pilot.Level }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto"
        class="text-right ml-4">
        <div class="text-caption mr-9 text-primary">{{ $t('active.stats.grit') }}&nbsp;</div>
        <v-icon v-if="blank"
          size="60"
          color="primary"
          style="opacity: 0.5"
          class="mt-n4 mr-0">
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
      class="print-section">
      <v-col>
        <div class="text-caption text-primary h0">{{ $t('pm.new.pilot') }}</div>
        <blank-line v-if="blank"
          :height="38"
          class="my-2" />
        <div v-else
          class="heading h3 ml-2">
          {{ pilot.Name }}
        </div>
        <div class="text-caption text-primary h0 mt-1">{{ $t('pm.print.player') }}</div>
        <blank-line v-if="blank"
          :height="24"
          class="my-2" />
        <div v-else-if="!pilot.PlayerName"
          class="heading h3 ml-2">&emsp;</div>
        <div v-else
          class="heading h3 ml-2">
          {{ pilot.PlayerName }}
        </div>
        <div class="text-caption text-primary h0 mt-1">{{ $t('pm.new.background') }}</div>
        <blank-line v-if="blank || !pilot.Background"
          :height="24"
          class="my-2" />
        <div v-else
          class="heading h3 ml-2">
          {{ pilot.Background }}
        </div>
        <div class="mt-2">
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('pm.new.biography') }}</div>
          <div v-if="blank || !pilot.History"
            class="mb-4">
            <notes :rows="5"
              lined />
          </div>
          <div v-else
            v-html-safe="pilot.History"
            class="mt-2 caption pl-2" />
        </div>
        <div class="mt-2">
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('pm.new.appearance') }}</div>
          <div v-if="blank"
            class="mb-4">
            <notes :rows="5"
              lined />
          </div>
          <div v-else
            v-html-safe="pilot.Notes"
            class="mt-2 caption pl-2" />
        </div>
      </v-col>
      <v-col cols="4">
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

    <fieldset class="py-1">
      <legend class="heading ml-1 px-2">{{ $t('pm.print.pilotNotes') }}</legend>
      <notes v-if="blank || !pilot.Notes"
        :rows="8"
        lined />
      <div v-else
        v-html-safe="pilot.Notes"
        class="caption px-2" />
    </fieldset>

    <fieldset class="pa-1">
      <legend class="heading ml-1 px-2">{{ $t('pm.print.missionLog') }}</legend>
      <v-row no-gutters
        class="mt-1">
        <v-col cols="2">
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('pm.print.session') }}</div>
          <blank-line :height="450"
            class="mt-3" />
        </v-col>
        <v-col cols="auto">&nbsp;</v-col>
        <v-col>
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('common.detail') }}</div>
          <blank-line :height="450"
            class="mt-3" />
        </v-col>
      </v-row>
    </fieldset>

    <fieldset v-if="hasPilotOption('Expanded Mission Log')"
      class="pa-1 no-print-break">
      <legend class="heading ml-1 px-2">
        {{ $t('pm.print.missionLog') }}
        <span class="caption font-weight-regular">{{ $t('pm.print.cont') }}</span>
      </legend>
      <v-row no-gutters
        class="mt-1">
        <v-col cols="2">
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('pm.print.session') }}</div>
          <blank-line :height="1000"
            class="mt-3" />
        </v-col>
        <v-col cols="auto">&nbsp;</v-col>
        <v-col>
          <div class="text-overline text-primary"
            style="line-height: 0">{{ $t('common.detail') }}</div>
          <blank-line :height="1000"
            class="mt-3" />
        </v-col>
      </v-row>
    </fieldset>

    <div class="text-caption text-primary mb-n2 mt-2">{{ $t('pm.print.skillTRIGGERS') }}</div>
    <div class="text-left">
      <v-row v-if="blank"
        dense
        class="mt-n2">
        <v-col v-for="n in 8"
          :key="`skill-${n}`"
          cols="6">
          <v-row dense
            align="center">
            <v-col cols="9"><blank-line :height="32"
                inline /></v-col>
            <v-col cols="auto"
              class="heading h3 mr-n1 mt-n1">+</v-col>
            <v-col cols="2"><blank-line :height="32"
                inline /></v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-card v-for="s in pilot.SkillsController.Skills"
        v-else
        :key="s.Skill.ID"
        variant="outlined"
        class="my-2 py-1 px-2 no-print-break">
        <v-row>
          <v-col cols="auto">
            <span class="heading"
              style="font-size: 33px">+{{ s.Bonus }}</span>
          </v-col>
          <v-col>
            <div class="heading">{{ s.Skill.Trigger }}</div>
            <div class="caption">{{ s.Skill.Detail }}</div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('pm.new.talents') }}</div>
    <v-row v-if="blank"
      dense>
      <v-col v-for="n in 8"
        :key="`talent-${n}`"
        :cols="12">
        <blank-line :height="120"
          inline />
      </v-col>
    </v-row>
    <v-chip v-for="t in pilot.TalentsController.Talents"
      v-else-if="hasPilotOption('Separate Talent Detail')"
      :key="t.Talent.ID"
      label
      variant="outlined"
      size="small"
      class="caption mx-1 mt-1 no-print-break">
      <v-icon :icon="`cc:rank_${t.Rank}`"
        color="primary"
        class="ml-n2" />
      {{ t.Talent.Name }}
      {{ 'I'.repeat(t.Rank) }}
    </v-chip>
    <div v-for="t in pilot.TalentsController.Talents"
      v-else
      :key="t.Talent.ID + '-detail'"
      dense
      justify="space-between"
      class="mt-n1 caption no-print-break"
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
              :actions="t.Talent.Ranks[n - 1].Actions" />
            <print-deployable v-if="t.Talent.Ranks[n - 1].Deployables.length"
              :deployables="t.Talent.Ranks[n - 1].Deployables" />
          </v-col>
        </v-row>
      </fieldset>
    </div>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length || blank"
      class="text-caption mb-n2 mt-2 text-primary">
      {{ $t('pm.print.coreBonuses') }}
    </div>
    <v-row v-if="blank"
      dense>
      <v-col v-for="n in 4"
        :key="`cb-${n}`"
        cols="6">
        <blank-line :height="80"
          inline />
      </v-col>
    </v-row>
    <div v-for="b in pilot.CoreBonusController.CoreBonuses"
      v-else-if="pilot.CoreBonusController.CoreBonuses.length"
      :key="b.ID"
      dense
      justify="space-between"
      class="mt-n1 caption no-print-break">
      <fieldset class="pb-2 my-2">
        <legend class="heading h3 ml-1 px-2">{{ b.Name }}</legend>
        <v-row dense
          align="center">
          <v-col cols="auto">
            <v-icon :icon="`cc:corebonus`"
              color="primary"
              size="large"
              class="mb-1" />
          </v-col>
          <v-col>
            <div v-html-safe="b.Effect" />
          </v-col>
        </v-row>
      </fieldset>
    </div>

    <page-break />

    <div class="text-caption mb-n2 mt-2 text-primary">{{ $t('ui.card.combatProfile') }}</div>
    <v-row align="center">
      <v-col cols="auto">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">{{ $t('pm.print.pilotHP') }}</legend>
          <div style="min-width: 12vw">
            <blank-line :height="60" />
          </div>
          <v-row dense
            align="center"
            class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">{{ $t('pm.print.maxHP') }}</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank"
            class="text-center heading h3"
            v-text="pilot.MaxHP" />
          <blank-line v-else
            :height="26"
            class="mb-1" />
        </fieldset>
      </v-col>

      <v-col>
        <v-row class="text-center"
          justify="space-between">
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n3">{{ $t('stats.armor') }}</div>
            <v-icon v-if="blank"
              size="45"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.Armor" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n3">{{ $t('stats.edefense') }}</div>
            <v-icon v-if="blank"
              size="45"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.EDefense" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n3">{{ $t('stats.evasion') }}</div>
            <v-icon v-if="blank"
              size="45"
              color="primary"
              style="opacity: 0.5"
              class="mt-2">
              mdi-hexagon-outline
            </v-icon>
            <div v-else
              class="heading p-stat"
              v-text="pilot.Evasion" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n3">{{ $t('stats.speed') }}</div>
            <v-icon v-if="blank"
              size="45"
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

        <v-divider class="mb-3" />

        <v-row class="text-center"
          justify="space-between">
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n2">{{ $t('stats.hull') }}</div>
            <blank-line v-if="blank"
              :width="80"
              :height="35"
              class="d-inline-block mt-2" />

            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Hull"
              class="heading p-stat" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n2 text-primary">{{ $t('stats.agility') }}</div>
            <blank-line v-if="blank"
              :width="80"
              :height="35"
              class="d-inline-block mt-2" />

            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Agi"
              class="heading p-stat" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n2">{{ $t('stats.systems') }}</div>
            <blank-line v-if="blank"
              :width="80"
              :height="35"
              class="d-inline-block mt-2" />

            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Sys"
              class="heading p-stat" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary mb-n2">{{ $t('stats.engineering') }}</div>
            <blank-line v-if="blank"
              :width="80"
              :height="35"
              class="d-inline-block mt-2" />

            <div v-else
              v-html-safe="pilot.MechSkillsController.MechSkills.Eng"
              class="heading p-stat" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.pilotLoadout') }}</div>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption">
      <v-col v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        :key="a.ID"
        style="position: relative"
        cols="12"
        class="no-print-break">
        <fieldset v-if="a">
          <legend class="heading h3 ml-1 px-1">
            <span v-if="!blank">
              {{ a.Name }}
              <span class="text-caption flavor-text">//{{ $t('stats.armor') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotArmor') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else>
            <v-row dense
              justify="space-around">
              <v-col cols="auto">
                <span v-text="`+${a.Armor(pilot) || 0} Armor`" />
              </v-col>
              <v-col cols="auto">
                <span v-text="`E-Def: ${a.EDefense(pilot) || 'N/A'} `" />
              </v-col>
              <v-col cols="auto">
                <span v-text="`Evasion: ${a.Evasion(pilot) || 'N/A'}`" />
              </v-col>
              <v-col cols="auto">
                <span v-text="`${a.HPBonus(pilot) ? `HP Bonus: +${a.HPBonus(pilot)}` : ''}`" />
              </v-col>
              <v-col cols="auto">
                <span v-text="`${a.Speed(pilot) ? `Speed: ${a.Speed(pilot)}` : ''}`" />
              </v-col>
            </v-row>
            <print-action :actions="a.Actions" />
            <print-deployable :deployables="a.Deployables" />
            <tag-block :tags="a.Tags"
              :options="options" />
          </div>
        </fieldset>
      </v-col>
      <v-col v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        :key="w.ID"
        style="position: relative"
        class="no-print-break"
        cols="12">
        <fieldset v-if="w || blank">
          <legend class="heading h3 ml-1 px-1">
            <span v-if="!blank">
              {{ w.Name }}
              <span class="text-caption flavor-text">//{{ $t('common.weapon') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotWeapon') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else>
            <b v-for="(r, ri) in w.Range"
              :key="`range-${ri}`"
              class="px-1">
              <v-icon class="mt-n1"
                :icon="r.Icon" />
              {{ r.Text }}
            </b>
            <span v-if="w.Damage && w.Damage.length"
              class="pl-2 pr-1"><cc-slashes /></span>
            <b v-for="(d, di) in w.Damage"
              :key="`damage-${di}`">
              <v-icon class="mt-n1"
                :icon="d.Icon"
                :color="d.Color" />
              {{ d.Text }}
            </b>
            <div v-if="w.Effect"
              v-html-safe="w.Effect" />
            <print-action :actions="w.Actions" />
            <print-deployable :deployables="w.Deployables" />
            <tag-block :tags="w.Tags"
              :options="options" />
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption pb-3">
      <v-col v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        :key="g.ID"
        style="position: relative"
        cols="12"
        class="no-print-break">
        <fieldset v-if="g || blank">
          <legend class="heading h3 ml-1 px-1">
            <span v-if="!blank">
              {{ g.Name }}
              <span class="text-caption flavor-text">{{ $t('pm.print.gear') }}</span>
            </span>
            <span v-else
              class="text-grey">{{ $t('common.pilotGear') }}</span>
          </legend>
          <div v-if="blank"
            style="height: 150px" />
          <div v-else
            class="pb-1">
            <div v-if="g.Description"
              v-html-safe="g.Description" />
            <print-action :actions="g.Actions" />
            <print-deployable :deployables="g.Deployables" />
            <tag-block :tags="g.Tags"
              :options="options" />
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <v-row v-if="hasPilotOption('Extra Equipment Space')"
      dense
      justify="space-between"
      class="mt-n2 caption pb-3">
      <v-col v-for="n in 3"
        :key="`equip-${n}`"
        style="position: relative"
        cols="12">
        <fieldset>
          <legend class="heading ml-1 px-1">
            <blank-line :width="150"
              :height="20" />
          </legend>
          <div style="height: 150px" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <div v-if="!blank && pilot.ReservesController.Reserves.length"
    class="pa-2 no-print-break">
    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.reserves') }}</div>
    <fieldset
      v-for="(r, index) in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
      :key="`reserve-${index}`">
      <legend class="px-1 mb-n2">
        <span class="heading caption text-primary">{{ r.Name }}</span>
        <i class="caption text-grey">&nbsp;({{ r.Type }})</i>
      </legend>
      <div v-if="r.ResourceName || r.Note || r.ResourceCost">
        <b class="caption">{{ r.ResourceName }}</b>
        <div class="caption">{{ r.Note }}</div>
        <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
      </div>
      <blank-line v-else
        :height="80"
        class="my-1"
        style="min-height: 80px; height: 85%" />
    </fieldset>
  </div>

  <div v-if="blank"
    class="pa-2">
    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.reserves') }}</div>
    <fieldset v-for="r in hasPilotOption('Extra Reserve Space') ? 9 : 6"
      :key="`reserve-${r}`"
      class="mt-2"
      style="position: relative">
      <legend class="px-1">
        <blank-line :height="26"
          :width="200" />
      </legend>
      <div style="position: absolute; top: -26px; right: 10px">
        <v-chip label
          size="x-small"
          variant="outlined"
          color="grey"
          class="bg-white px-1 mx-1">
          {{ $t('common.bonus') }}
        </v-chip>
        <v-chip label
          size="x-small"
          variant="outlined"
          color="grey"
          class="bg-white px-1 mx-1">
          {{ $t('pm.print.resource') }}
        </v-chip>
        <v-chip label
          size="x-small"
          variant="outlined"
          color="grey"
          class="bg-white px-1 mx-1">
          {{ $t('pm.sheet.tactical') }}
        </v-chip>
        <v-chip label
          size="x-small"
          variant="outlined"
          color="grey"
          class="bg-white px-1 mx-1">
          {{ $t('pm.print.mech') }}
        </v-chip>
        <v-chip label
          size="x-small"
          variant="outlined"
          color="grey"
          class="bg-white px-1 mx-1">
          {{ $t('pm.print.other') }}
        </v-chip>
      </div>

      <blank-line :height="80"
        class="my-1"
        style="min-height: 80px; height: 85%" />
    </fieldset>
  </div>

  <fieldset v-if="hasPilotOption('Append Lined Section')"
    class="mx-1 my-3 px-3 no-print-break">
    <div class="mb-4">
      <notes :rows="48"
        lined />
    </div>
  </fieldset>

  <fieldset v-if="hasPilotOption('Append Unlined Section')"
    class="mx-1 my-3 px-3 no-print-break">
    <div class="mb-4">
      <notes :rows="48" />
    </div>
  </fieldset>

  <div v-if="hasPilotOption('Separate Talent Detail')">
    <div v-for="t in pilot.TalentsController.Talents"
      :key="t.Talent.ID"
      dense
      justify="space-between"
      class="mt-n1 caption px-2 no-print-break"
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
          </v-col>
        </v-row>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import PrintAction from '../../components/PrintAction.vue';
import PrintDeployable from '../../components/PrintDeployable.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import tagBlock from '../../components/TagBlock.vue';
import PageBreak from '../../components/PageBreak.vue';
import { usePrintOptions } from '../usePrintOptions';

defineOptions({ name: 'PilotPrint' })

const props = defineProps<{
  pilot: Pilot
  options: object
}>()

const { blank, hasPilotOption } = usePrintOptions(props)
</script>

<style scoped>
@import '@/ui/style/print-pilot.css';
</style>
