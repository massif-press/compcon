<template>
  <div class="text-black px-2">
    <v-row dense
      class="print-section">
      <v-col>
        <v-row dense
          align="center"
          class="mt-2">
          <v-col :cols="blank ? '' : 'auto'">
            <div class="text-caption text-primary h0">{{ $t('common.callsign') }}</div>
            <blank-line v-if="blank"
              :height="32"
              class="my-2" />
            <div v-else
              class="heading h2">
              {{ pilot.Callsign }}
            </div>
          </v-col>
          <v-col cols="auto"><cc-slashes /></v-col>
          <v-col :cols="blank ? '' : 'auto'">
            <div class="text-caption text-primary h0">{{ $t('pm.new.pilot') }}</div>
            <blank-line v-if="blank"
              :height="32"
              class="my-2" />
            <div v-else
              class="heading h2">
              {{ pilot.Name }}
              <div v-if="pilot.Background"
                class="text-cc-overline"
                style="line-height: 0">
                {{ pilot.Background }}
              </div>
            </div>
          </v-col>

          <v-col cols="auto"
            class="ml-auto">
            <div class="text-caption text-primary h0">{{ $t('ui.fields.licenseLevel') }}</div>
            <blank-line v-if="blank"
              :height="32"
              class="my-2" />
            <div v-else
              class="heading h2 text-right">
              {{ pilot.Level }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto"
        class="text-right ml-4">
        <div class="text-caption mr-9 text-primary">{{ $t('pm.print.grit') }}</div>
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

    <v-row class="mt-n3 print-section">
      <v-col>
        <v-row class="text-center"
          justify="space-between">
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">{{ $t('pm.print.pilotHP') }}</div>
            <v-row v-if="blank"
              dense
              align="center"
              justify="center"
              class="mt-2">
              <v-col cols="auto">
                <blank-line :width="80"
                  :height="35"
                  class="d-inline-block" />
              </v-col>
              <v-col cols="auto"
                class="px-1">
                <span class="heading h3 text-grey"
                  style="line-height: 0">/</span>
              </v-col>
              <v-col cols="auto">
                <blank-line :width="80"
                  :height="35"
                  class="d-inline-block" />
              </v-col>
            </v-row>
            <div v-else
              class="mt-3">
              <blank-line :height="26"
                :width="50"
                class="d-inline-block ml-5" />
              <b v-if="!blank"
                class="flavor-text text-black"
                v-text="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
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
          <v-col cols="auto">
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
          <v-col cols="auto">
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
          <v-col cols="auto">
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

        <v-row dense
          class="mt-n4 print-section">
          <v-col>
            <v-row class="text-center">
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2"><span class="text-uppercase">{{ $t('pm.link.hull') }}</span></div>
                <blank-line v-if="blank"
                  :width="80"
                  :height="35"
                  class="d-inline-block mt-2" />

                <div v-else
                  v-html-safe="pilot.MechSkillsController.MechSkills.Hull"
                  class="heading h2" />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2 text-primary">{{ $t('stats.agility') }}</div>
                <blank-line v-if="blank"
                  :width="80"
                  :height="35"
                  class="d-inline-block mt-2" />

                <div v-else
                  v-html-safe="pilot.MechSkillsController.MechSkills.Agi"
                  class="heading h2" />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2">{{ $t('stats.systems') }}</div>
                <blank-line v-if="blank"
                  :width="80"
                  :height="35"
                  class="d-inline-block mt-2" />

                <div v-else
                  v-html-safe="pilot.MechSkillsController.MechSkills.Sys"
                  class="heading h2" />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2">{{ $t('stats.engineering') }}</div>
                <blank-line v-if="blank"
                  :width="80"
                  :height="35"
                  class="d-inline-block mt-2" />

                <div v-else
                  v-html-safe="pilot.MechSkillsController.MechSkills.Eng"
                  class="heading h2" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense
          justify="space-between"
          class="mt-n3">
          <v-col>
            <div class="text-caption text-primary">{{ $t('pm.titles.skillTriggers') }}</div>
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
              <v-chip v-for="s in pilot.SkillsController.Skills"
                v-else
                :key="s.Skill.ID"
                label
                variant="outlined"
                size="small"
                class="mx-2 mb-2">
                <span class="stat-text ml-n1 mr-1">+{{ s.Bonus }}</span>
                <span>{{ s.Skill.Trigger }}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <div>
          <div v-if="hasPilotOption('Appearance Notes')"
            class="mt-1">
            <div class="text-cc-overline text-primary">{{ $t('pm.new.appearance') }}</div>
            <div v-if="blank"
              class="mb-4">
              <notes :rows="5"
                lined />
            </div>
            <div v-else
              v-html-safe="pilot.Notes"
              class="caption" />
          </div>
          <div v-if="blank || pilot.History.length > 0"
            class="mt-1">
            <div class="text-cc-overline text-primary">{{ $t('pm.new.biography') }}</div>
            <div v-if="blank"
              class="mb-4">
              <notes :rows="5"
                lined />
            </div>
            <div v-else
              v-html-safe="pilot.History"
              class="caption" />
          </div>
          <div class="mt-1">
            <div class="text-cc-overline text-primary">{{ $t('common.notes') }}</div>
            <div v-if="blank || !pilot.Notes.length"
              class="mb-4">
              <notes :rows="5"
                lined />
            </div>
            <div v-else
              v-html-safe="pilot.Notes"
              class="caption" />
          </div>
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

    <v-row dense
      class="mt-n6">
      <v-col>
        <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.talents') }}</div>
        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 12"
            :key="`talent-${n}`"
            :cols="6">
            <blank-line :height="48"
              inline />
          </v-col>
        </v-row>
        <template v-else-if="hasPilotOption('Separate Talent Detail')">
          <v-chip v-for="t in pilot.TalentsController.Talents"
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
        </template>
        <template v-else>
          <v-row v-for="t in pilot.TalentsController.Talents"
            :key="t.Talent.ID"
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
                    <print-action v-if="t.Talent.Actions.length"
                      :actions="t.Talent.Actions" />
                    <print-deployable v-if="t.Talent.Deployables.length"
                      :deployables="t.Talent.Deployables" />
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length || blank"
      class="text-caption mb-n2 mt-2 text-primary">
      {{ $t('pm.level.coreBonuses') }}
    </div>
    <v-row v-if="blank"
      dense>
      <v-col v-for="n in 4"
        :key="`cb-${n}`"
        :cols="landscape ? (hasPilotOption('Pilot Portrait') ? 6 : 3) : 6
          ">
        <blank-line :height="48"
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

    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.pilotLoadout') }}</div>
    <v-row dense
      justify="space-between"
      class="mt-n1 caption">
      <v-col v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        :key="a.ID"
        style="position: relative"
        cols="12">
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
        cols="12">
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
            style="height: 150px" />
          <div v-else>
            <b v-for="(r, ri) in w.Range"
              :key="`range-${ri}`">{{ r.Text }}</b>
            |
            <b v-for="(d, di) in w.Damage"
              :key="`damage-${di}`">{{ d.Text }}</b>
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
        cols="12">
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
      class="mt-n2 caption">
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
    class="pa-2">
    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.reserves') }}</div>
    <v-row dense>
      <v-col
        v-for="(r, index) in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
        :key="`reserve-${index}`"
        style="min-width: 30vw"
        class="my-n1">
        <fieldset>
          <legend class="px-1 mb-n2">
            <span class="heading caption text-primary">{{ r.Name }}</span>
            <i class="caption text-grey">&nbsp;({{ $enum('reserveType', r.Type) }})</i>
          </legend>
          <div v-if="r.ResourceName || r.Note || r.ResourceCost">
            <b class="caption">{{ r.ResourceName }}</b>
            <div class="caption">{{ r.Note }}</div>
            <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
          </div>
          <blank-line v-else
            :height="50"
            class="my-1"
            style="min-height: 64px; height: 85%" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <div v-if="blank"
    class="pa-2">
    <div class="text-caption mb-n2 mt-1 text-primary">{{ $t('common.reserves') }}</div>
    <v-row>
      <v-col v-for="r in hasPilotOption('Extra Reserve Space') ? 9 : 6"
        :key="`reserve-${r}`"
        cols="6">
        <fieldset class="mt-2"
          style="position: relative">
          <legend class="px-1">
            <blank-line :height="26"
              :width="200" />
          </legend>
          <div v-if="landscape"
            style="position: absolute; top: -26px; right: 10px">
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
              {{ $t('common.mech') }}
            </v-chip>
            <v-chip label
              size="x-small"
              variant="outlined"
              color="grey"
              class="bg-white px-1 mx-1">
              {{ $t('ui.widget.other') }}
            </v-chip>
          </div>

          <blank-line :height="80"
            class="my-1"
            style="min-height: 70px; height: 90%" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <fieldset v-if="hasPilotOption('Append Lined Section')"
    class="mx-1 my-3 px-3">
    <div class="mb-4">
      <notes :rows="24"
        lined />
    </div>
  </fieldset>

  <fieldset v-if="hasPilotOption('Append Unlined Section')"
    class="mx-1 my-3 px-3">
    <div class="mb-4">
      <notes :rows="24" />
    </div>
  </fieldset>

  <div v-if="hasPilotOption('Separate Talent Detail')">
    <div v-for="t in pilot.TalentsController.Talents"
      :key="t.Talent.ID"
      dense
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
              :actions="t.Talent.Ranks[n - 1].Actions" />
            <print-deployable v-if="t.Talent.Ranks[n - 1].Deployables.length"
              :deployables="t.Talent.Ranks[n - 1].Deployables" />
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
import { usePrintOptions } from '../usePrintOptions';

defineOptions({ name: 'PilotPrint' })

const props = defineProps<{
  pilot: Pilot
  options: object
}>()

const { blank, landscape, hasPilotOption, } = usePrintOptions(props)
</script>

<style scoped>
@import '@/ui/style/print-pilot.css';
</style>
