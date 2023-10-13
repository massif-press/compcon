<template>
  <div class="text-black px-2">
    <v-row density="compact">
      <v-col cols="auto">
        <div class="text-overline my-n2 text-grey">
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
        </div>
        <div class="heading h2 mt-n4 font-weight-bolder">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center caption">
        <div class="text-overline my-n2">OVERCHARGE</div>
        <v-chip size="20" variant="outlined" class="ml-1">
          &nbsp;+1
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" class="ml-1">
          &nbsp;+1d3
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" class="ml-1">
          &nbsp;+1d6
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
        <v-chip size="20" variant="outlined" class="ml-1">
          &nbsp;+1d6+4
          <v-icon size="small" icon="mdi-fire" />
        </v-chip>
      </v-col>
    </v-row>

    <v-row justify="space-around" class="mt-n5">
      <v-col cols="auto">
        <div class="font-weight-bold overline">HULL</div>
        <div class="heading h2" style="line-height: 10px" v-text="mech.Hull" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline">AGI</div>
        <div class="heading h2" style="line-height: 10px" v-text="mech.Agi" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline">SYS</div>
        <div class="heading h2" style="line-height: 10px" v-text="mech.Sys" />
      </v-col>
      <v-col cols="auto">
        <div class="font-weight-bold overline">ENG</div>
        <div class="heading h2" style="line-height: 10px" v-text="mech.Eng" />
      </v-col>
      <v-col cols="auto">
        <v-icon size="40">{{ mech.SizeIcon }}</v-icon>
      </v-col>

      <v-col class="text-center">
        <div class="text-overline mt-n4">CORE POWER</div>
        <v-icon size="35" color="grey-lighten-1" class="mr-n1 mt-n3">mdi-battery-outline</v-icon>
        <div class="d-inline-block flavor-text font-weight-bold mb-n2">/1</div>
      </v-col>
      <v-col class="text-center">
        <div class="text-overline mt-n4">REPAIR CAPACITY</div>
        <v-icon size="40" color="grey-lighten-1" class="mr-n1 mt-n5">cc:repair</v-icon>
        <div
          class="d-inline-block flavor-text font-weight-bold mb-n2"
          v-html="`/${mech.RepairCapacity}`"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center">
        <div style="line-height: 10px" class="text-overline mb-4">STRUCTURE</div>
        <div>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">cc:structure</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.MaxStructure}`"
          />
        </div>
      </v-col>
      <v-col cols="auto">
        <v-row density="compact" no-gutters justify="center">
          <v-col cols="auto" class="text-center">
            <div style="line-height: 10px" class="text-overline mb-4 mr-6">HP</div>
            <div>
              <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n4">
                mdi-hexagon-outline
              </v-icon>
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-text="`&nbsp;/${mech.MaxHP}`"
              />
            </div>
          </v-col>
          <v-col v-if="mech.Armor" cols="auto" class="text-center mb-1" align-self="end">
            <div style="line-height: 10px" class="text-overline mb-4 ml-2">ARMOR</div>
            <div class="heading h2 mt-n4 mr-n2">
              <v-icon class="mt-n1 mr-n1">mdi-shield</v-icon>
              {{ mech.Armor }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer />
      <v-col class="text-center">
        <div style="line-height: 10px" class="text-overline mb-4 mr-2">STRESS</div>
        <div>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">cc:reactor</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.MaxStress}`"
          />
        </div>
      </v-col>
      <v-col class="text-center">
        <div style="line-height: 10px" class="text-overline mb-4 mr-6">HEAT</div>
        <div>
          <v-icon size="60" color="grey-lighten-1" class="mr-n3 mt-n5">mdi-fire</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.HeatCapacity}`"
          />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">ATK</legend>
          <div class="heading h2 text-center mt-n2">
            {{ signed(mech.AttackBonus) }}
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">TECH ATK</legend>
          <div class="heading h2 text-center mt-n2">
            {{ signed(mech.TechAttack) }}
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SAVE</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.SaveTarget }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SPEED</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.Speed }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">E-DEF</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.EDefense }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">EVASION</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.Evasion }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SENSORS</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.SensorRange }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">LTD SYS</legend>
          <div class="heading h2 text-center mt-n2">
            {{ signed(mech.LimitedBonus) }}
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <div class="text-overline mb-n3 text-grey">FRAME TRAITS</div>
    <v-row dense justify="space-between" class="caption mt-n1">
      <v-col v-for="(t, i) in mech.Frame.Traits">
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.Name }}</legend>
          <p v-html-safe="t.Description" />
        </fieldset>
      </v-col>
    </v-row>

    <div class="text-overline mb-n3 text-grey">CORE SYSTEM</div>
    <fieldset class="mt-n2">
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
        <br />
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
        <span v-for="(t, i) in mech.Frame.CoreSystem.Tags" class="mx-1">
          {{ t.Name() }}
        </span>
      </div>
    </fieldset>

    <div class="text-overline mb-n3 text-grey">LOADOUT</div>

    <fieldset v-for="m in mounts" style="position: relative; page-break-inside: avoid">
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
              {{ w.Source }} {{ w.Size }} {{ w.WeaponType }}
            </span>
          </v-col>
          <v-col v-if="w.Uses" cols="auto">
            <v-icon v-for="n in w.getTotalUses(mech.Pilot.LimitedBonus)" size="small">
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>

        <div v-for="p in w.Profiles">
          <div class="caption">
            <b v-for="r in p.Range" class="px-1">{{ r.Text }}</b>
            <span v-if="p.Damage && p.Damage.length" class="px-1">|</span>
            <b v-for="d in p.Damage" class="px-1">{{ d.Text }}</b>
            <p v-if="p.Effect" :v-html-safe="p.Effect" print />
            <p v-if="p.OnAttack" :v-html-safe="`<b>ON ATTACK:</b> ${p.OnAttack}`" print />
            <p v-if="p.OnHit" :v-html-safe="`<b>ON HIT:</b> ${p.OnHit}`" print />
            <p v-if="p.OnCrit" :v-html-safe="`<b>ON CRIT:</b> ${p.OnCrit}`" print />
            <print-action :actions="p.Actions" />
            <print-deployable :deployables="p.Deployables" />
          </div>
          <div class="text-right" style="position: absolute; bottom: 5px; right: 5px">
            <v-chip
              v-for="t in p.Tags"
              size="x-small"
              label
              variant="outlined"
              class="mx-1 bg-white"
            >
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

    <fieldset>
      <legend class="heading h4 ml-1 px-2">Systems</legend>
      <v-card
        v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems"
        variant="outlined"
        class="px-1"
        :class="s.Tags ? 'pb-2 mb-1' : ''"
        style="position: relative; page-break-inside: avoid; border-color: rgba(0, 0, 0, 0.2)"
      >
        <v-row>
          <v-col cols="auto">
            <b class="text-overline font-weight-black" style="line-height: 0">{{ s.Name }}</b>
          </v-col>
          <v-col>
            <span class="text-overline" style="line-height: 0"> {{ s.Source }} {{ s.Type }} </span>
          </v-col>
          <v-col v-if="s.Uses" cols="auto">
            <v-icon v-for="n in s.getTotalUses(mech.Pilot.LimitedBonus)" size="small">
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
            class="mx-1 bg-white"
          >
            {{ t.GetName() }}
          </v-chip>
        </div>
      </v-card>
    </fieldset>
  </div>
</template>

<script lang="ts">
import PrintAction from './components/PrintAction.vue';
import PrintDeployable from './components/PrintDeployable.vue';

export default {
  name: 'mech-print',
  components: { PrintAction, PrintDeployable },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mounts() {
      return this.mech.MechLoadoutController.ActiveLoadout.AllMounts(
        this.mech.Pilot.has('corebonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      );
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
