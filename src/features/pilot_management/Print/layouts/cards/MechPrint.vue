<template>
  <card>
    <v-row dense align="center" class="mb-1">
      <v-col><v-divider /></v-col>
      <v-col cols="auto" class="text-center heading" style="line-height: 10px">
        {{ mech.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <div
      :style="`background-image: url('${mech.Portrait}');  background-position: top ${mech.Frame.YPosition}% left 0`"
      style="height: 80px; width: 100%; background-size: cover; position: relative"
      class="mt-n1">
      <v-icon
        color="primary"
        size="x-large"
        :icon="mech.Frame.SizeIcon"
        style="position: absolute; bottom: 0; right: -4px" />
    </div>

    <v-divider class="my-1" />
    <div dense class="caption font-weight-bold" style="font-size: 15px">
      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">ATTACK BONUS</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ signed(mech.AttackBonus) }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">TECH ATTACK</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ signed(mech.TechAttack) }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">SAVE</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.SaveTarget }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">SPEED</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.Speed }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">E-DEFENSE</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.EDefense }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">EVASION</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.Evasion }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">SENSOR RANGE</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.SensorRange }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">LIMITED BONUS</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ signed(mech.LimitedBonus) }}
        </v-col>
      </v-row>

      <v-row dense align="center" class="my-n1">
        <v-col cols="auto">SYSTEM POINTS</v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto" class="text-primary">
          {{ mech.MaxSP }}
        </v-col>
      </v-row>
    </div>

    <v-divider class="mt-2 mb-1" />

    <v-row justify="space-around" align="center">
      <v-col cols="auto" class="text-center">
        <span class="font-weight-bold overline text-primary">H</span>
        <cc-slashes />
        <span class="heading" v-text="mech.Hull" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <span class="font-weight-bold overline text-primary">A</span>
        <cc-slashes />
        <span class="heading" v-text="mech.Agi" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <span class="font-weight-bold overline text-primary">S</span>
        <cc-slashes />
        <span class="heading" v-text="mech.Sys" />
      </v-col>
      <v-col cols="auto" class="text-center">
        <span class="font-weight-bold overline text-primary">E</span>
        <cc-slashes />
        <span class="heading" v-text="mech.Eng" />
      </v-col>
    </v-row>
  </card>

  <card>
    <v-row dense align="center" class="mb-1">
      <v-col><v-divider /></v-col>
      <v-col cols="auto" class="text-center heading" style="line-height: 10px">
        {{ mech.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>

    <div
      class="caption text-center text-primary mt-n1"
      style="letter-spacing: 5px; font-size: 10px">
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
        style="letter-spacing: 5px; font-size: 10px">
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
      <v-col cols="auto" class="text-center heading" style="line-height: 10px">
        {{ mech.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>

    <fieldset class="pb-1">
      <legend class="font-weight-bold caption text-primary px-2 text-center">
        HP
        <span class="text-black caption">({{ mech.MaxHP }} MAX)</span>
        <cc-slashes />
        <span class="text-primary caption pl-1">{{ mech.Armor }} ARMOR</span>
      </legend>
      <div>
        <blank-line :height="40" />
      </div>
      <v-row dense align="center" class="my-n2">
        <v-col cols="auto">
          <span class="text-primary caption">STRUCTURE</span>
        </v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto">
          <v-icon
            v-for="n in mech.MaxStructure"
            icon="mdi-hexagon-outline"
            size="x-small"
            color="primary" />
        </v-col>
      </v-row>
    </fieldset>

    <fieldset class="pb-1">
      <legend class="font-weight-bold caption text-red px-2 text-center">
        HEAT
        <span class="text-black caption">({{ mech.HeatCapacity }} CAPACITY)</span>
      </legend>
      <div>
        <blank-line :height="40" />
      </div>
      <v-row dense align="center" class="my-n2">
        <v-col cols="auto">
          <span class="text-red caption">STRESS</span>
        </v-col>
        <v-col><v-divider /></v-col>
        <v-col cols="auto">
          <v-icon
            v-for="n in mech.MaxStress"
            icon="mdi-hexagon-outline"
            size="x-small"
            color="heat" />
        </v-col>
      </v-row>
    </fieldset>

    <fieldset class="pb-1">
      <legend class="font-weight-bold caption px-2 text-center">
        REPAIRS
        <span class="caption">({{ mech.RepairCapacity }} CAPACITY)</span>
      </legend>
      <div class="pb-1">
        <blank-line :height="40" />
      </div>
    </fieldset>

    <v-row dense>
      <v-col cols="8">
        <fieldset>
          <legend class="font-weight-bold text-primary caption px-2 text-center">OVERSHIELD</legend>
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

  <card v-for="m in mounts.filter((x) => !x.IsLocked)">
    <div class="caption text-center mt-n1" style="letter-spacing: 6px; font-size: 10px">
      MECH WEAPON MOUNT
    </div>
    <v-row dense align="center" class="my-n2">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <span class="text-center heading caption" v-text="m.Name" />
      </v-col>
    </v-row>
    <v-card
      v-for="w in m.Weapons"
      class="px-1 mb-2"
      variant="outlined"
      style="border-color: dimgrey">
      <v-row dense align="center">
        <v-col cols="auto"><v-icon icon="cc:weapon" size="x-small" /></v-col>
        <v-col cols="auto">
          <b class="heading caption" style="line-height: 0">{{ w.Name }}</b>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <span class="caption" style="line-height: 0">
            {{ w.Size }} {{ w.WeaponTypes.join('/') }}
          </span>
        </v-col>
      </v-row>
      <v-row v-if="w.Uses" justify="space-around">
        <v-col v-for="n in w.getTotalUses(mech.LimitedBonus)" cols="auto">
          <v-icon size="small" color="primary">mdi-hexagon-outline</v-icon>
        </v-col>
      </v-row>
      <v-divider />
      <div>
        <div v-if="showCollectedEffect(w)" class="caption mb-2">{{ w.Profiles[0].Effect }}</div>
        <div v-for="p in w.Profiles">
          <div class="flavor-text text-black" style="font-size: 12px">
            <span v-if="w.Profiles.length > 1 && p.Name" class="heading">{{ p.Name }}:&nbsp;</span>
            <b v-for="r in p.Range" class="px-1">
              <v-icon class="mt-n1" :icon="r.Icon" />
              {{ r.Value }}
            </b>
            <span v-if="p.Damage && p.Damage.length" class="pl-2 pr-1"><cc-slashes /></span>
            <b v-for="d in p.Damage">
              <v-icon class="mr-n2" :icon="d.Icon" :color="d.Color" />
              {{ d.Value }}
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
          </div>
          <tag-block :tags="p.Tags" :options="options" block />
        </div>

        <v-card v-if="w.Mod" variant="tonal" color="mod" class="pa-1 ma-1">
          <div class="text-black">
            <div class="heading caption">
              <v-icon icon="cc:weaponmod" size="large" class="mt-n1" />
              {{ w.Mod.Name }}
            </div>
            <div v-text="w.Mod.Effect" class="caption" />
          </div>
        </v-card>
      </div>
    </v-card>
  </card>

  <card v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems">
    <div class="caption text-center mt-n1" style="letter-spacing: 11px; font-size: 10px">
      MECH SYSTEM
    </div>
    <v-row dense align="center">
      <v-col cols="auto"><v-icon icon="cc:system" size="x-small" /></v-col>
      <v-col cols="auto">
        <b class="heading caption">{{ s.Name }}</b>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <span class="caption">{{ s.Size }} {{ s.WeaponTypes?.join('/') || '' }}</span>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>

    <v-row dense align="center" class="mt-n4">
      <v-col cols="auto">
        <i class="caption">{{ s.Type }}</i>
      </v-col>
      <v-col v-if="s.Uses" cols="auto" class="ml-auto">
        <v-icon v-for="n in s.getTotalUses(mech.LimitedBonus)" size="15" color="primary">
          mdi-hexagon-outline
        </v-icon>
      </v-col>
    </v-row>

    <div class="caption" v-html="s.Effect" />

    <v-card v-for="action in s.Actions" variant="text" class="my-1 px-1 text-caption">
      Gain
      <v-chip label tile size="small">
        <v-icon :icon="action.Icon" :color="action.Color" start />
        <b>{{ action.Name }}</b>
      </v-chip>
    </v-card>

    <v-card v-for="deployable in s.Deployables" variant="text" class="my-1 px-1 text-caption">
      Gain
      <v-chip label tile size="small">
        <v-icon icon="cc:drone" color="primary" start />
        <b>{{ deployable.Name }}</b>
      </v-chip>
    </v-card>
    <tag-block :tags="s.Tags" :options="options" mech />
  </card>

  <action-card v-for="a in allActions" :action="a" header="MECH" />
  <deployable-card v-for="d in allDeployables" :deployable="d" header="MECH" />
</template>

<script lang="ts">
import card from './components/PrintCard.vue';
import ActionCard from './components/ActionCard.vue';
import DeployableCard from './components/DeployableCard.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import tagBlock from './components/TagBlock.vue';

export default {
  name: 'mech-print',
  components: { card, ActionCard, DeployableCard, blankLine, notes, tagBlock },
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
    allActions() {
      return this.mech.FeatureController.Actions;
    },
    allDeployables() {
      return this.mech.FeatureController.Deployables;
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`;
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
</style>
