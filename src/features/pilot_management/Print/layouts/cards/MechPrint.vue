<template>
  <div class="text-black pa-3">
    <v-row justify="space-around">
      <card>
        <v-row dense align="center" class="mb-1">
          <v-col><v-divider /></v-col>
          <v-col cols="auto" class="text-center heading h3" style="line-height: 10px">
            {{ mech.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <div
          :style="`background-image: url('${mech.Portrait}');  background-position: top ${mech.Frame.YPosition}% left 0`"
          style="height: 80px; width: 100%; background-size: cover; position: relative"
          class="mt-n1"
        >
          <v-icon
            color="primary"
            size="x-large"
            :icon="mech.Frame.SizeIcon"
            style="position: absolute; bottom: 0; right: -4px"
          />
        </div>

        <v-divider class="my-1" />
        <div dense class="caption font-weight-bold" style="font-size: 15px">
          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">ATTACK BONUS</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ signed(mech.AttackBonus) }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">TECH ATTACK</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ signed(mech.TechAttack) }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">SAVE</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.SaveTarget }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">SPEED</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.Speed }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">E-DEFENSE</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.EDefense }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">EVASION</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.Evasion }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">SENSOR RANGE</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.SensorRange }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">LIMITED BONUS</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ signed(mech.LimitedBonus) }}
            </v-col>
          </v-row>

          <v-row dense align="center" class="my-n1"
            ><v-col cols="auto">SYSTEM POINTS</v-col><v-col><v-divider /></v-col
            ><v-col cols="auto" class="text-primary">
              {{ mech.MaxSP }}
            </v-col>
          </v-row>
        </div>

        <v-divider class="mt-2 mb-1" />

        <v-row justify="space-around" align="center">
          <v-col cols="auto" class="text-center">
            <span class="font-weight-bold overline text-primary">H</span><cc-slashes />
            <span class="heading" v-text="mech.Hull" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <span class="font-weight-bold overline text-primary">A</span><cc-slashes />
            <span class="heading" v-text="mech.Agi" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <span class="font-weight-bold overline text-primary">S</span><cc-slashes />
            <span class="heading" v-text="mech.Sys" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <span class="font-weight-bold overline text-primary">E</span><cc-slashes />
            <span class="heading" v-text="mech.Eng" />
          </v-col>
        </v-row>
      </card>

      <card>
        <v-row dense align="center" class="mb-1">
          <v-col><v-divider /></v-col>
          <v-col cols="auto" class="text-center heading h3" style="line-height: 10px">
            {{ mech.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>

        <div
          class="caption text-center text-primary mt-n1"
          style="letter-spacing: 5px; font-size: 10px"
        >
          FRAME TRAITS
        </div>
        <v-divider />
        <div v-for="t in mech.Frame.Traits" class="caption">
          <div class="heading">{{ t.Name }}</div>
          <div v-html-safe="t.Description" />
        </div>

        <div style="position: absolute; bottom: 4px; left: 4px; right: 4px">
          <div
            class="caption text-center text-primary mt-2"
            style="letter-spacing: 5px; font-size: 10px"
          >
            CORE SYSTEM
          </div>

          <v-card class="caption pa-1" variant="tonal">
            <div class="font-weight-bold text-center">
              {{ mech.Frame.CoreSystem.Name }}
            </div>
            <v-divider class="my-1" />
            <div v-if="mech.Frame.CoreSystem.PassiveEffect">
              <span class="font-weight-bold">
                {{
                  mech.Frame.CoreSystem.PassiveName
                    ? `${mech.Frame.CoreSystem.PassiveName} (PASSIVE)`
                    : 'CORE PASSIVE'
                }}
              </span>
              <div v-html-safe="mech.Frame.CoreSystem.PassiveEffect" class="caption" />
            </div>
            <div v-if="mech.Frame.CoreSystem.PassiveEffect" class="font-weight-bold">
              {{
                mech.Frame.CoreSystem.ActiveName
                  ? `${mech.Frame.CoreSystem.ActiveName} (ACTIVE)`
                  : 'CORE ACTIVE'
              }}
            </div>
            <div v-html-safe="mech.Frame.CoreSystem.ActiveEffect" class="caption" />
          </v-card>
        </div>
      </card>

      <card>
        <v-row dense align="center" class="mb-1">
          <v-col><v-divider /></v-col>
          <v-col cols="auto" class="text-center heading h3" style="line-height: 10px">
            {{ mech.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>

        <fieldset class="pb-1">
          <legend class="font-weight-bold caption text-primary px-2 text-center">
            HP
            <span class="text-black caption"> ({{ mech.MaxHP }} MAX) </span>
            <cc-slashes />
            <span class="text-primary caption pl-1"> {{ mech.Armor }} ARMOR </span>
          </legend>
          <div>
            <blank-line :height="40" />
          </div>
          <v-row dense align="center" class="my-n2">
            <v-col cols="auto">
              <span class="text-primary caption"> STRUCTURE </span>
            </v-col>
            <v-col><v-divider /></v-col>
            <v-col cols="auto">
              <v-icon
                v-for="n in mech.MaxStructure"
                icon="mdi-hexagon-outline"
                size="x-small"
                color="primary"
              />
            </v-col>
          </v-row>
        </fieldset>

        <fieldset class="pb-1">
          <legend class="font-weight-bold caption text-red px-2 text-center">
            HEAT
            <span class="text-black caption"> ({{ mech.HeatCapacity }} CAPACITY) </span>
          </legend>
          <div>
            <blank-line :height="40" />
          </div>
          <v-row dense align="center" class="my-n2">
            <v-col cols="auto">
              <span class="text-red caption"> STRESS </span>
            </v-col>
            <v-col><v-divider /></v-col>
            <v-col cols="auto">
              <v-icon
                v-for="n in mech.MaxStress"
                icon="mdi-hexagon-outline"
                size="x-small"
                color="heat"
              />
            </v-col>
          </v-row>
        </fieldset>

        <fieldset class="pb-1">
          <legend class="font-weight-bold caption px-2 text-center">
            REPAIRS
            <span class="caption"> ({{ mech.RepairCapacity }} CAPACITY) </span>
          </legend>
          <div class="pb-1">
            <blank-line :height="40" />
          </div>
        </fieldset>

        <v-row dense>
          <v-col cols="8">
            <fieldset>
              <legend class="font-weight-bold text-primary caption px-2 text-center">
                OVERSHIELD
              </legend>
              <div class="pb-1">
                <blank-line :height="40" />
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="font-weight-bold text-primary caption px-2 text-center">CORE</legend>
              <div class="pb-1">
                <blank-line :height="40" />
              </div>
            </fieldset>
          </v-col>
        </v-row>

        <v-divider class="mt-2 mb-1" />

        <div class="text-center caption">
          <v-icon icon="cc:overcharge" size="20" color="overcharge" />
          <v-chip size="20" variant="outlined" color="red" class="ml-1">
            &nbsp;+1
            <v-icon size="x-small" icon="mdi-fire" />
          </v-chip>
          <v-chip size="20" variant="outlined" color="red" class="ml-1">
            &nbsp;+1d3
            <v-icon size="x-small" icon="mdi-fire" />
          </v-chip>
          <v-chip size="20" variant="outlined" color="red" class="ml-1">
            &nbsp;+1d6
            <v-icon size="x-small" icon="mdi-fire" />
          </v-chip>
          <v-chip size="20" variant="outlined" color="red" class="ml-1">
            &nbsp;+1d6+4
            <v-icon size="x-small" icon="mdi-fire" />
          </v-chip>
        </div>
      </card>
    </v-row>

    <div class="text-overline mb-n3 mt-1 text-primary">LOADOUT</div>

    <div v-if="blank">
      <fieldset
        v-for="n in options.mechInclude.includes('extra mount panel') ? 5 : 4"
        class="my-1 pb-1"
      >
        <legend class="heading h4 ml-1 px-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <blank-line :width="160" :height="28" />
            </v-col>
            <v-col cols="auto" class="text-primary"> MOUNT </v-col>
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

    <fieldset v-else v-for="m in mounts" style="position: relative; page-break-inside: avoid">
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
              {{ w.Source }} {{ w.Size }} {{ w.WeaponType }}
            </span>
          </v-col>
          <v-col v-if="w.Uses" cols="auto">
            <v-icon
              v-for="n in w.getTotalUses(mech.Pilot.LimitedBonus)"
              size="small"
              color="primary"
            >
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>
        <div class="pl-7">
          <div v-if="showCollectedEffect(w)" class="caption mb-2">{{ w.Profiles[0].Effect }}</div>
          <div v-for="p in w.Profiles" class="mb-n4">
            <div class="flavor-text text-black mt-n1" style="font-size: 16px">
              <span v-if="w.Profiles.length > 1 && p.Name" class="heading">
                {{ p.Name }}:&nbsp;</span
              >
              <b v-for="r in p.Range" class="px-1"
                ><v-icon class="mt-n1" :icon="r.Icon" />{{ r.Text }}</b
              >
              <span v-if="p.Damage && p.Damage.length" class="pl-2 pr-1"><cc-slashes /></span>
              <b v-for="d in p.Damage">
                <v-icon class="mt-n1 mr-n2" :icon="d.Icon" :color="d.Color" />
                {{ d.Text }}</b
              >
              <div v-if="p.Effect && !showCollectedEffect(w)" class="caption">{{ p.Effect }}</div>
              <div v-if="p.OnAttack" class="caption"><b>ON ATTACK:</b> {{ p.OnAttack }}</div>
              <div v-if="p.OnHit" class="caption"><b>ON HIT:</b> {{ p.OnHit }}</div>
              <div v-if="p.OnCrit" class="caption"><b>ON CRIT:</b> {{ p.OnCrit }}</div>
              <!-- <print-action :actions="p.Actions" />
              <print-deployable :deployables="p.Deployables" /> -->
            </div>
            <tag-block :tags="p.Tags" :options="options" mech />
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
        style="position: relative; page-break-inside: avoid; border-color: rgba(0, 0, 0, 0.2)"
      >
        <v-row>
          <v-col cols="auto">
            <v-icon icon="cc:system" class="mt-n1" start /><b
              class="heading h4"
              style="line-height: 0"
              >{{ s.Name }}</b
            >
          </v-col>
          <v-col cols="auto">
            <span class="text-overline" style="line-height: 0"> {{ s.Source }} {{ s.Type }} </span>
          </v-col>
          <v-col v-if="s.Uses" cols="auto" class="ml-auto">
            <v-icon
              v-for="n in s.getTotalUses(mech.Pilot.LimitedBonus)"
              size="small"
              color="primary"
            >
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>
        <div class="pl-7">
          <p v-if="s.Effect" class="caption mb-n1" v-html="s.Effect" />
          <!-- <print-action :actions="s.Actions" />
          <print-deployable :deployables="s.Deployables" /> -->
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
import card from './components/PrintCard.vue';
import PrintAction from './components/ActionCard.vue';
import PrintDeployable from './components/DeployableCard.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import tagBlock from './components/TagBlock.vue';

export default {
  name: 'mech-print',
  components: { card, PrintAction, PrintDeployable, blankLine, notes, tagBlock },
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
  font-size: 11px;
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
