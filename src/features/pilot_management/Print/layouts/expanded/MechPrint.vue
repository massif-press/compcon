<template>
  <div class="text-black px-2">
    <v-row align="center">
      <v-col>
        <v-row dense align="center">
          <v-col cols="auto">
            <div class="text-overline mt-n4 mb-n4 text-primary">MECH</div>
            <blank-line v-if="blank" :height="46" :width="500" class="my-2" />
            <div v-else class="heading h2">
              {{ mech.Name }}
            </div>
            <div v-if="!blank" class="heading h3 my-n2" style="opacity: 0.7">
              <v-icon :icon="`cc:${mech.Frame.Source.toLowerCase()}`" size="small" class="mt-n1" />
              {{ mech.Frame.Source }}
              {{ mech.Frame.Name }}
            </div>
          </v-col>
        </v-row>
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

    <v-row justify="space-around" align="center" class="mt-n4 mb-1">
      <v-col cols="auto" class="text-center">
        <div class="font-weight-bold overline text-primary">HULL</div>
        <blank-line v-if="blank" :width="120" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 14px" v-text="mech.Hull" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <div class="font-weight-bold overline text-primary">AGILITY</div>
        <blank-line v-if="blank" :width="120" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 14px" v-text="mech.Agi" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <div class="font-weight-bold overline text-primary">SYSTEMS</div>
        <blank-line v-if="blank" :width="120" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 14px" v-text="mech.Sys" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <div class="font-weight-bold overline text-primary">ENGINEERING</div>
        <blank-line v-if="blank" :width="120" :height="35" class="mt-n1" />
        <div v-else class="heading h2" style="line-height: 14px" v-text="mech.Eng" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <div v-if="blank">
          <div class="font-weight-bold overline text-primary">SIZE</div>
          <blank-line v-if="blank" :width="120" :height="35" class="mt-n1" />
        </div>
        <v-icon v-else color="primary" size="40">{{ mech.SizeIcon }}</v-icon>
      </v-col>
    </v-row>

    <v-row dense class="mt-n1">
      <v-col cols="4">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">HP</legend>
          <div style="min-width: 12vw">
            <blank-line :height="60" />
          </div>
          <v-row dense align="center" class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">MAX HP</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank" class="text-center heading h3" v-text="mech.MaxHP" />
          <blank-line v-else :height="26" class="mb-1" />
        </fieldset>
      </v-col>

      <v-col cols="3">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">STRUCTURE</legend>
          <blank-line :height="60" />
          <v-row dense align="center" class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">MAX STRUCTURE</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank" class="text-center heading h3" v-text="mech.MaxStructure" />
          <blank-line v-else :height="26" class="mb-1" />
        </fieldset>
      </v-col>

      <v-col cols="3">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">OVERSHIELD</legend>
          <blank-line :height="102" />
        </fieldset>
      </v-col>

      <v-col v-if="mech.Armor" class="text-center">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">ARMOR</legend>

          <blank-line v-if="blank" :height="102" />

          <v-row v-else style="height: 100%" class="mt-0" align="center">
            <v-col class="text-primary">
              <v-icon
                v-for="n in mech.Armor"
                size="40"
                style="opacity: 0.6"
                icon="mdi-shield-outline" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="4">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">HEAT</legend>
          <blank-line :height="60" />
          <v-row dense align="center" class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">HEAT CAPACITY</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank" class="text-center heading h3" v-text="mech.HeatCapacity" />
          <blank-line v-else :height="26" class="mb-1" />
        </fieldset>
      </v-col>

      <v-col cols="3">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">STRESS</legend>
          <blank-line :height="60" />
          <v-row dense align="center" class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">MAX STRESS</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank" class="text-center heading h3" v-text="mech.MaxStress" />
          <blank-line v-else :height="26" class="mb-1" />
        </fieldset>
      </v-col>

      <v-col cols="3">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">REPAIRS</legend>
          <blank-line :height="60" />
          <v-row dense align="center" class="mb-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto"><span class="text-primary caption">REPAIR CAPACITY</span></v-col>
            <v-col><v-divider /></v-col>
          </v-row>
          <div v-if="!blank" class="text-center heading h3" v-text="mech.RepairCapacity" />
          <blank-line v-else :height="26" class="mb-1" />
        </fieldset>
      </v-col>

      <v-col class="text-center">
        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">CORE POWER</legend>

          <blank-line v-if="blank" :height="102" />

          <v-row v-else style="height: 100%" class="mt-0" align="center">
            <v-col class="text-primary">
              <v-icon size="40" style="opacity: 0.6" icon="mdi-battery-outline" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <v-row dense class="mt-2">
      <v-col cols="8">
        <v-row dense :class="blank ? 'mt-n3' : ''">
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 4vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">ATTACK BONUS</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">
                {{ signed(mech.AttackBonus) }}
              </div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">TECH ATTACK</legend>
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
              <legend class="caption font-weight-bold text-primary px-1">E-DEFENSE</legend>
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
              <legend class="caption font-weight-bold text-primary px-1">SENSOR RANGE</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">{{ mech.SensorRange }}</div>
            </fieldset>
          </v-col>
          <v-col :style="`min-height: ${blank ? '60' : '50'}px`" style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">LIMITED BONUS</legend>
              <div v-if="!blank" class="heading h2 text-center mt-n2">
                {{ signed(mech.LimitedBonus) }}
              </div>
            </fieldset>
          </v-col>
          <v-col
            v-if="blank"
            :style="`min-height: ${blank ? '60' : '50'}px`"
            style="min-width: 8vw">
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">SYSTEM POINTS</legend>
            </fieldset>
          </v-col>
        </v-row>

        <div class="text-overline mb-n3 text-primary">FRAME TRAITS</div>
        <v-row dense v-if="blank">
          <v-col v-for="n in 4" cols="12">
            <blank-line :height="100" />
          </v-col>
        </v-row>
        <v-row v-else dense justify="space-between" class="caption mt-n1">
          <v-col
            :cols="t.Actions.length + t.Deployables.length > 0 ? '12' : ''"
            v-for="t in mech.Frame.Traits">
            <fieldset>
              <legend class="heading ml-1 px-2">{{ t.Name }}</legend>
              <p v-html-safe="t.Description" />
              <print-action :actions="t.Actions" />
              <print-deployable :deployables="t.Deployables" />
            </fieldset>
          </v-col>
        </v-row>

        <div v-if="!blank">
          <div class="text-overline mb-n1 text-primary mt-n1">CORE SYSTEM</div>
          <fieldset class="mt-n2" style="height: fit-content">
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
              <print-action :actions="mech.Frame.CoreSystem.PassiveActions" />
            </div>
            <div v-if="mech.Frame.CoreSystem.PassiveEffect" class="heading ml-4">
              {{
                mech.Frame.CoreSystem.ActiveName
                  ? `${mech.Frame.CoreSystem.ActiveName} (ACTIVE)`
                  : 'CORE ACTIVE'
              }}
            </div>
            <p v-html-safe="mech.Frame.CoreSystem.ActiveEffect" class="caption ml-6 mb-1" />
            <print-action :actions="mech.Frame.CoreSystem.ActiveActions" />
            <print-deployable :deployables="mech.Frame.CoreSystem.Deployables" />
            <div v-if="mech.Frame.CoreSystem.Tags" class="text-right">
              <tag-block :tags="mech.Frame.CoreSystem.Tags" :options="options" mech />
            </div>
          </fieldset>
        </div>
      </v-col>

      <v-col cols="4" style="margin-top: -2px">
        <v-card height="100%" variant="outlined" color="grey">
          <v-row style="height: 100%" align="center">
            <v-col>
              <cc-img v-if="!blank" :src="mech.Portrait" cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="blank">
      <div class="text-cc-overline text-primary">CORE SYSTEM</div>
      <blank-line :height="124" />
    </div>

    <fieldset class="py-1">
      <legend class="heading ml-1 px-2">Operator Notes</legend>
      <notes v-if="blank || !mech.notes" :rows="8" lined />
      <div v-else v-html-safe="mech.Notes" class="caption px-2" />
    </fieldset>

    <div class="text-overline mb-n3 mt-1 text-primary">LOADOUT</div>

    <div v-if="blank">
      <fieldset
        v-for="n in options.mechInclude.includes('extra mount panel') ? 5 : 4"
        class="my-1 pb-1">
        <legend class="heading h4 ml-1 px-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <blank-line :width="160" :height="28" />
            </v-col>
            <v-col cols="auto" class="text-primary">MOUNT</v-col>
          </v-row>
        </legend>
        <div v-for="n in 2">
          <v-row dense>
            <v-col>
              <div class="caption text-grey">WEAPON</div>
              <blank-line :height="28" />
            </v-col>
            <v-col cols="2">
              <div class="caption text-grey">TYPE</div>
              <blank-line :height="28" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">RANGE</div>
              <blank-line :height="28" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">DAMAGE</div>
              <blank-line :height="28" />
            </v-col>
          </v-row>
          <blank-line :height="80" class="mt-1" />
        </div>
      </fieldset>
    </div>

    <fieldset v-else v-for="m in mounts" style="position: relative">
      <legend class="heading h3 ml-1 px-2">{{ m.Name }}</legend>
      <div v-if="m.IsLocked" class="text-center flavor-text">
        MOUNT LOCKED
        <br />
        <span class="text-overline">// SUPERHEAVY WEAPON BRACING //</span>
      </div>
      <div v-else v-for="w in m.Weapons" class="px-1">
        <v-row dense align="center">
          <v-col cols="auto"><v-icon icon="cc:weapon" /></v-col>
          <v-col cols="auto">
            <b class="heading h4" style="line-height: 0">{{ w.Name }}</b>
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
        <div class="pl-7">
          <div v-if="showCollectedEffect(w)" class="caption mb-2">{{ w.Profiles[0].Effect }}</div>
          <div v-for="p in w.Profiles" class="mb-n4">
            <div class="flavor-text text-black mt-n1" style="font-size: 16px">
              <span v-if="w.Profiles.length > 1 && p.Name" class="heading">
                {{ p.Name }}:&nbsp;
              </span>
              <b v-for="r in p.Range" class="px-1">
                <v-icon class="mt-n1" :icon="r.Icon" />
                {{ r.Text }}
              </b>
              <span v-if="p.Damage && p.Damage.length" class="pl-2 pr-1"><cc-slashes /></span>
              <b v-for="d in p.Damage">
                <v-icon class="mt-n1 mr-n2" :icon="d.Icon" :color="d.Color" />
                {{ d.Text }}
              </b>
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
            <tag-block :tags="p.Tags" :options="options" mech />
          </div>

          <v-card v-if="w.Mod" variant="outlined" color="mod" class="px-2 pb-1 mb-1">
            <div class="text-black">
              <span class="heading">
                {{ w.Mod.Name }}
              </span>
              <span class="text-cc-overline">&nbsp;//APPLIED MOD</span>
              <p v-if="w.Mod.Effect" v-html="w.Mod.Effect" class="caption mt-n1" print />
            </div>
          </v-card>
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
              <blank-line :height="28" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">USES</div>
              <blank-line :height="28" />
            </v-col>
            <v-col cols="1">
              <div class="caption text-grey">SP COST</div>
              <blank-line :height="28" />
            </v-col>
          </v-row>
          <blank-line :height="80" class="my-2" />
        </div>
      </fieldset>
    </div>

    <fieldset v-else>
      <legend class="heading h3 ml-1 px-2">Systems</legend>
      <v-card
        v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems"
        variant="outlined"
        class="pa-1 my-1"
        style="position: relative; border-color: rgba(0, 0, 0, 0.2)">
        <v-row>
          <v-col cols="auto">
            <v-icon icon="cc:system" class="mt-n1" start />
            <b class="heading h4" style="line-height: 0">{{ s.Name }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-overline" style="line-height: 0">{{ s.Source }} {{ s.Type }}</span>
          </v-col>
          <v-col v-if="s.Uses" cols="auto" class="ml-auto">
            <v-icon v-for="n in s.getTotalUses(mech.LimitedBonus)" size="small" color="primary">
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>
        <div class="pl-7">
          <p v-if="s.Effect" class="caption mb-n1" v-html="s.Effect" />
          <print-action :actions="s.Actions" />
          <print-deployable :deployables="s.Deployables" />
          <tag-block :tags="s.Tags" :options="options" mech />
        </div>
      </v-card>
    </fieldset>

    <fieldset v-if="options.mechInclude.includes('append lined section')" class="mx-1 my-3 px-3">
      <div class="mb-4"><notes :rows="48" lined /></div>
    </fieldset>

    <fieldset v-if="options.mechInclude.includes('append unlined section')" class="mx-1 my-3 px-3">
      <div class="mb-4"><notes :rows="48" /></div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import PrintAction from '../standard/components/PrintAction.vue';
import PrintDeployable from '../standard/components/PrintDeployable.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import tagBlock from './components/TagBlock.vue';

export default {
  name: 'mech-print',
  components: { PrintAction, PrintDeployable, blankLine, notes, tagBlock },
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
