<template>
  <div class="text-black px-2">
    <v-row density="compact">
      <v-col v-if="blank">
        <v-row dense>
          <v-col cols="auto">
            <div class="text-overline mt-n4 mb-n2 text-primary">FRAME</div>
            <blank-line :width="landscape ? 200 : 150" :height="35" />
          </v-col>
          <v-col cols="auto">
            <div class="text-overline mt-n4 mb-n2 text-primary">MECH NAME</div>
            <blank-line :width="landscape ? 550 : 350" :height="35" />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else cols="auto">
        <div class="text-overline my-n2 text-primary">
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
        </div>
        <div class="heading h2 mt-n4 font-weight-bolder">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto mr-2 text-center caption">
        <div class="text-overline text-primary my-n2">OVERCHARGE</div>
        <v-chip size="20" variant="outlined" color="red" class="ml-1">
          &nbsp;+1
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" color="red" class="ml-1">
          &nbsp;+1d3
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" color="red" class="ml-1">
          &nbsp;+1d6
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" color="red" class="ml-1">
          &nbsp;+1d6+4
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
      </v-col>
    </v-row>

    <v-row justify="space-around" align="center" class="mt-n5">
      <v-col cols="auto">
        <div class="font-weight-bold overline text-primary">HULL</div>
        <blank-line v-if="blank" :width="landscape ? 100 : 60" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 10px" v-text="mech.Hull" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline text-primary">
          {{ landscape ? 'AGILITY' : 'AGI' }}
        </div>
        <blank-line v-if="blank" :width="landscape ? 90 : 60" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 10px" v-text="mech.Agi" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline text-primary">
          {{ landscape ? 'SYSTEMS' : 'SYS' }}
        </div>
        <blank-line v-if="blank" :width="landscape ? 90 : 60" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 10px" v-text="mech.Sys" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline text-primary">
          {{ landscape ? 'ENGINEERING' : 'ENG' }}
        </div>
        <blank-line v-if="blank" :width="landscape ? 90 : 60" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 10px" v-text="mech.Eng" />
      </v-col>
      <v-col cols="auto">
        <div v-if="blank">
          <div class="font-weight-bold overline text-primary">SIZE</div>
          <blank-line v-if="blank" :width="landscape ? 90 : 60" :height="35" class="mt-n1" />
        </div>
        <v-icon v-else color="primary" size="40">{{ mech.SizeIcon }}</v-icon>
      </v-col>
      <v-col v-if="blank" cols="auto">
        <div>
          <div class="font-weight-bold overline text-primary">SP</div>
          <blank-line v-if="blank" :width="landscape ? 90 : 60" :height="35" class="mt-n1" />
        </div>
      </v-col>

      <v-col class="text-center">
        <div class="text-overline mt-n4 text-primary">CORE POWER</div>
        <v-icon size="35" color="grey-lighten-1" class="mr-n1 mt-n3">mdi-battery-outline</v-icon>
        <div v-if="!blank" class="d-inline-block flavor-text font-weight-bold mb-n2">/1</div>
      </v-col>
      <v-col class="text-center">
        <div class="text-overline text-primary mt-n4 pb-1">
          {{ landscape ? 'REPAIR CAPACITY' : 'REP CAP' }}
        </div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n4">
          <v-col cols="auto">
            <blank-line :width="landscape ? 80 : 50" :height="35" />
          </v-col>
          <v-col cols="auto" class="px-1">
            <span class="heading h3 text-grey" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto">
            <blank-line :width="landscape ? 80 : 50" :height="35" />
          </v-col>
        </v-row>
        <div v-else>
          <v-icon size="40" color="grey-lighten-1" class="mr-n1 mt-n5">cc:repair</v-icon>
          <div
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-html="`/${mech.RepairCapacity}`" />
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-around">
      <v-col cols="auto" class="text-center">
        <div style="line-height: 10px" class="text-overline text-primary mb-4">STRUCTURE</div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1">
            <span class="heading h3 text-grey" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">cc:structure</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.MaxStructure}`" />
        </div>
      </v-col>

      <v-col :cols="getHpCols">
        <v-row dense justify="center">
          <v-col cols="auto" class="text-center">
            <div
              style="line-height: 10px"
              :class="blank ? '' : 'mr-6'"
              class="text-overline text-primary mb-4">
              HP
            </div>
            <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
              <v-col cols="auto">
                <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
              </v-col>
              <v-col cols="auto" class="px-1">
                <span class="heading h3 text-grey" style="line-height: 0">/</span>
              </v-col>
              <v-col cols="auto">
                <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
              </v-col>
            </v-row>
            <div v-else>
              <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n4">
                mdi-hexagon-outline
              </v-icon>
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-text="`&nbsp;/${mech.MaxHP}`" />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="mech.Armor" cols="auto" :class="blank ? 'ml-4' : ''" class="text-center mb-1">
        <div style="line-height: 10px" class="text-overline text-primary mb-4">ARMOR</div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else class="heading h2 mr-n2 text-primary" :class="'mt-n2'">
          <v-icon size="35" class="mt-n1 mr-n1" style="opacity: 0.6">mdi-shield-outline</v-icon>
          {{ mech.Armor }}
        </div>
      </v-col>

      <v-col cols="auto" class="text-center mb-1">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'pb-2'"
          class="text-overline text-primary">
          OVERSHIELD
        </div>
        <div class="px-6">
          <blank-line :height="blank ? 35 : 40" />
        </div>
      </v-col>

      <v-col cols="auto" class="text-center">
        <div style="line-height: 10px" class="text-overline text-primary mb-4 mr-2">STRESS</div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1">
            <span class="heading h3 text-grey" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>

        <div v-else>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">cc:reactor</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.MaxStress}`" />
        </div>
      </v-col>

      <v-col :cols="'auto'" class="text-center">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'ml-6'"
          class="text-overline text-primary mb-5">
          HEAT
        </div>
        <v-row v-if="blank" no-gutters align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1">
            <span class="heading h3 text-grey" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto">
            <blank-line :width="landscape ? 75 : 58" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">mdi-fire</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.HeatCapacity}`" />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col :cols="options.mechInclude.includes('mech image') ? (landscape ? 9 : 8) : 12">
        <v-row dense :class="blank ? 'mt-n3' : ''">
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 4vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">
                {{ landscape ? 'ATK BONUS' : 'ATK' }}
              </legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">
                {{ signed(mech.AttackBonus) }}
              </div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">TECH ATK</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">
                {{ signed(mech.TechAttack) }}
              </div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">SAVE</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.SaveTarget }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">SPEED</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.Speed }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">
                {{ landscape ? 'E-DEFENSE' : 'E-DEF' }}
              </legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.EDefense }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">EVASION</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.Evasion }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">SENSORS</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.SensorRange }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">
                {{ landscape ? 'LTD BONUS' : 'LTD SYS' }}
              </legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">
                {{ signed(mech.LimitedBonus) }}
              </div>
            </fieldset>
          </v-col>
        </v-row>

        <div class="text-overline mb-n3 text-primary">FRAME TRAITS</div>
        <v-row dense v-if="blank">
          <v-col v-for="n in 4" cols="6">
            <blank-line
              :height="landscape ? (options.mechInclude.includes('mech image') ? 80 : 40) : 64" />
          </v-col>
        </v-row>
        <v-row v-else dense justify="space-between" class="caption mt-n1">
          <v-col v-for="t in mech.Frame.Traits">
            <fieldset>
              <legend class="heading ml-1 px-2">{{ t.Name }}</legend>
              <p v-html-safe="t.Description" />
            </fieldset>
          </v-col>
        </v-row>

        <div class="text-overline mb-n1 text-primary mt-n1">CORE SYSTEM</div>
        <div dense v-if="blank" class="mb-n2">
          <blank-line
            :height="landscape ? (options.mechInclude.includes('mech image') ? 92 : 40) : 64" />
        </div>
        <fieldset v-else class="mt-n2" style="height: fit-content">
          <legend class="heading h4 ml-1 px-2">
            {{ mech.Frame.CoreSystem.Name }}
          </legend>
          <div v-if="mech.Frame.CoreSystem.PassiveEffect">
            <span class="heading ml-4">
              {{
                mech.Frame.CoreSystem.PassiveName
                  ? `${mech.Frame.CoreSystem.PassiveName} (PASSIVE)`
                  : 'CORE PASSIVE'
              }}
            </span>
            <p v-html-safe="mech.Frame.CoreSystem.PassiveEffect" class="caption ml-6 mb-1" />
          </div>
          <div v-if="mech.Frame.CoreSystem.PassiveEffect" class="heading ml-4">
            {{
              mech.Frame.CoreSystem.ActiveName
                ? `${mech.Frame.CoreSystem.ActiveName} (ACTIVE)`
                : 'CORE ACTIVE'
            }}
          </div>
          <p v-html-safe="mech.Frame.CoreSystem.ActiveEffect" class="caption ml-6 mb-1" />
          <div v-if="mech.Frame.CoreSystem.Tag" class="text-right">
            <span v-for="t in mech.Frame.CoreSystem.Tags" class="mx-1">
              {{ t.Name() }}
            </span>
          </div>
        </fieldset>

        <div v-if="options.mechInclude.includes('mech notes') && mech.Notes && !blank" class="pt-2">
          <div class="text-overline text-primary mt-3" style="line-height: 0">NOTES</div>
          <div v-html-safe="mech.Notes" class="mt-2 caption" />
        </div>
      </v-col>

      <v-col v-if="options.pilotInclude.includes('mech image')" cols="4" class="mt-5">
        <v-card height="100%" variant="outlined" color="grey">
          <v-row style="height: 100%" align="center">
            <v-col>
              <cc-img v-if="!blank" :src="mech.Portrait" cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="options.mechInclude.includes('mech notes') && blank" class="pt-3">
      <div class="text-overline text-primary" style="line-height: 0">NOTES</div>
      <div class="mb-4"><notes :rows="5" lined /></div>
    </div>

    <div class="text-overline mb-n3 mt-1 text-primary">LOADOUT</div>

    <div v-if="blank">
      <fieldset
        v-for="n in options.mechInclude.includes('extra mount panel') ? 5 : 4"
        class="my-1 pb-1">
        <legend class="heading h4 ml-1 px-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <blank-line :width="160" :height="20" />
            </v-col>
            <v-col cols="auto" class="text-primary">MOUNT</v-col>
          </v-row>
        </legend>
        <div v-for="n in 2">
          <v-row dense>
            <v-col>
              <div class="caption text-grey">WEAPON</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="2">
              <div class="caption text-grey">TYPE</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">RANGE</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">DAMAGE</div>
              <blank-line :height="20" />
            </v-col>
          </v-row>
          <blank-line :height="landscape ? 40 : 64" class="mt-1" />
        </div>
      </fieldset>
    </div>

    <fieldset v-else v-for="m in mounts" style="position: relative; break-inside: avoid">
      <legend class="heading h4 ml-1 px-2">{{ m.Name }}</legend>
      <div v-if="m.IsLocked" class="text-center flavor-text">
        MOUNT LOCKED
        <br />
        <span class="text-overline">// SUPERHEAVY WEAPON BRACING //</span>
      </div>
      <div v-else v-for="w in m.Weapons" class="px-1 caption">
        <v-row dense>
          <v-col cols="auto">
            <b class="text-overline font-weight-black" style="line-height: 0">{{ w.Name }}</b>
          </v-col>
          <v-col>
            <span class="text-overline" style="line-height: 0">
              {{ w.Source }} {{ w.Size }} {{ w.WeaponTypes.join('/') }}
            </span>
          </v-col>
          <v-col v-if="w.Uses" cols="auto">
            <v-icon v-for="n in w.getTotalUses(mech.LimitedBonus)" size="small" color="primary">
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>

        <div v-if="showCollectedEffect(w)" class="caption mb-1">{{ w.Profiles[0].Effect }}</div>
        <div v-for="p in w.Profiles" class="mb-n2">
          <div class="caption">
            <span v-if="w.Profiles.length > 1 && p.Name" class="heading">{{ p.Name }}:&nbsp;</span>
            <b v-for="r in p.Range" class="px-1">{{ r.Text }}</b>
            <span v-if="p.Damage && p.Damage.length" class="px-1">|</span>
            <b v-for="d in p.Damage" class="px-1">{{ d.Text }}</b>
            <div v-if="p.Effect && !showCollectedEffect(w)" class="caption">{{ p.Effect }}</div>
            <div v-if="p.OnAttack" class="caption">
              <b>ON ATTACK:</b>
              {{ p.OnAttack }}
            </div>
            <div v-if="p.OnHit" class="caption">
              <b>ON HIT:</b>
              {{ p.OnHit }}
            </div>
            <div v-if="p.OnCrit" class="caption">
              <b>ON CRIT:</b>
              {{ p.OnCrit }}
            </div>
            <print-action :actions="p.Actions" />
            <print-deployable :deployables="p.Deployables" />
          </div>
          <div class="text-right" style="position: absolute; bottom: 5px; right: 5px">
            <v-chip
              v-for="t in p.Tags"
              size="x-small"
              label
              variant="outlined"
              class="mx-1 bg-white">
              {{ t.Name }}
            </v-chip>
          </div>
        </div>

        <div v-if="w.Mod" class="px-2">
          <span class="heading">
            {{ w.Mod.Name }}
          </span>
          <span class="text-overline">&nbsp;//APPLIED MOD</span>
          <br />
          <p v-if="w.Mod.Effect" :v-html="w.Mod.Effect" print />
        </div>
      </div>
    </fieldset>

    <div v-if="blank">
      <fieldset>
        <legend class="heading h4 ml-1 px-2 py-1 text-primary">SYSTEMS</legend>
        <div v-for="n in options.mechInclude.includes('extra system space') ? 8 : 6">
          <v-row dense>
            <v-col>
              <div class="caption text-grey">SYSTEM</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">USES</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">SP COST</div>
              <blank-line :height="20" />
            </v-col>
          </v-row>
          <blank-line :height="landscape ? 40 : 64" class="my-2" />
        </div>
      </fieldset>
    </div>

    <fieldset v-else>
      <legend class="heading h4 ml-1 px-2">Systems</legend>
      <v-card
        v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems"
        variant="outlined"
        class="px-1"
        :class="s.Tags ? 'pb-2 mb-1' : ''"
        style="position: relative; border-color: rgba(0, 0, 0, 0.2)">
        <v-row>
          <v-col cols="auto">
            <b class="text-overline font-weight-black" style="line-height: 0">{{ s.Name }}</b>
          </v-col>
          <v-col>
            <span class="text-overline" style="line-height: 0">{{ s.Source }} {{ s.Type }}</span>
          </v-col>
          <v-col v-if="s.Uses" cols="auto">
            <v-icon v-for="n in s.getTotalUses(mech.LimitedBonus)" size="small" color="primary">
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>
        <p v-if="s.Effect" class="caption mb-n1" v-html="s.Effect" />
        <print-action :actions="s.Actions" />
        <print-deployable :deployables="s.Deployables" />
        <div class="text-right" style="position: absolute; bottom: 0; left: 0; right: 0">
          <v-chip
            v-for="t in s.Tags"
            v-show="showTag(t.ID)"
            size="x-small"
            label
            variant="outlined"
            class="mx-1 bg-white">
            {{ t.GetName() }}
          </v-chip>
        </div>
      </v-card>
    </fieldset>

    <fieldset v-if="options.mechInclude.includes('append lined section')" class="mx-1 my-3 px-3">
      <div class="mb-4"><notes :rows="16" lined /></div>
    </fieldset>

    <fieldset v-if="options.mechInclude.includes('append unlined section')" class="mx-1 my-3 px-3">
      <div class="mb-4"><notes :rows="16" /></div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import PrintAction from './components/PrintAction.vue';
import PrintDeployable from './components/PrintDeployable.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';

export default {
  name: 'mech-print',
  components: { PrintAction, PrintDeployable, blankLine, notes },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mounts() {
      return this.mech.MechLoadoutController.ActiveLoadout.AllMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      );
    },
    blank() {
      return this.options.content === 'blank';
    },
    landscape() {
      return this.options.orientation === 'landscape';
    },
    getHpCols() {
      return 'auto';
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`;
    },
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    },
    showCollectedEffect(w) {
      if (!w.Profiles[0].Effect) return false;
      return w.Profiles.every((x) => x.Effect === w.Profiles[0].Effect);
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
