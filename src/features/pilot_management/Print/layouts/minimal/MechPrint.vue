<template>
  <div class="text-black px-2 mt-4">
    <v-row dense class="pb-1">
      <v-col v-if="blank" class="mb-1 mt-n2">
        <blank-line :height="30" />
      </v-col>
      <v-col v-else cols="auto">
        <div class="text-overline text-primary mb-2" style="line-height: 0">
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
        </div>
        <div class="heading h3">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto mr-2 text-center caption">
        <span class="text-overline text-primary mb-2" style="line-height: 0">OVERCHARGE:</span>
        <span class="px-1">
          [+1
          <v-icon size="small" color="red" icon="mdi-fire" />
          ]
        </span>
        <span class="px-1">
          [+1d3
          <v-icon size="small" color="red" icon="mdi-fire" />
          ]
        </span>
        <span class="px-1">
          [+1d6
          <v-icon size="small" color="red" icon="mdi-fire" />
          ]
        </span>
        <span class="px-1">
          [+1d6+4
          <v-icon size="small" color="red" icon="mdi-fire" />
          ]
        </span>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" align="center" class="mt-n4">
      <v-col cols="auto">
        <b>HULL:</b>
        <blank-line v-if="blank" class="d-inline-block mb-n1" :height="20" :width="30" />
        <b v-else>{{ mech.Hull }}</b>
      </v-col>
      <v-col cols="auto">
        <b>AGI:</b>
        <blank-line v-if="blank" class="d-inline-block mb-n1" :height="20" :width="30" />
        <b v-else>{{ mech.Agi }}</b>
      </v-col>
      <v-col cols="auto">
        <b>SYS:</b>
        <blank-line v-if="blank" class="d-inline-block mb-n1" :height="20" :width="30" />
        <b v-else>{{ mech.Sys }}</b>
      </v-col>
      <v-col cols="auto">
        <b>ENG:</b>
        <blank-line v-if="blank" class="d-inline-block mb-n1" :height="20" :width="30" />
        <b v-else>{{ mech.Eng }}</b>
      </v-col>
      <v-col cols="auto">
        <b>SIZE:</b>
        <blank-line v-if="blank" class="d-inline-block mb-n1" :height="20" :width="30" />
        <b v-else>{{ mech.Size }}</b>
      </v-col>

      <v-spacer />

      <v-col class="text-center" cols="auto">
        <div>
          CORE POWER:
          <v-icon icon="mdi-checkbox-blank-outline" class="mt-n1" />
        </div>
      </v-col>

      <v-col class="text-center" cols="auto">
        <div>
          REPAIRS:
          <blank-line :width="40" :height="20" class="d-inline-block" />
          <span class="d-inline-block mx-1" style="font-size: 24px; line-height: 0">/</span>
          <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block" />
          <span v-else>{{ mech.RepairCapacity }}</span>
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-around">
      <v-col cols="auto" class="text-center">
        <div style="line-height: 0" class="text-overline text-primary mb-2">STRUCTURE</div>
        <div>
          <div class="d-inline-block"><blank-line :height="20" :width="40" /></div>
          <span class="d-inline-block mx-1" style="font-size: 24px; line-height: 0">/</span>

          <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block" />
          <div
            v-else
            class="d-inline-block flavor-text font-weight-bold"
            v-text="`${mech.MaxStructure}`" />
        </div>
      </v-col>

      <v-col cols="auto">
        <v-row dense justify="center">
          <v-col cols="auto" class="text-center">
            <div style="line-height: 0" class="text-overline text-primary mb-2">HP</div>
            <div>
              <div class="d-inline-block"><blank-line :height="20" :width="40" /></div>
              <span class="d-inline-block mx-1" style="font-size: 24px; line-height: 0">/</span>

              <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block" />
              <div
                v-else
                class="d-inline-block flavor-text font-weight-bold"
                v-text="`${mech.MaxHP}`" />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="mech.Armor" cols="auto" class="text-center">
        <div style="line-height: 0" class="text-overline text-primary mb-1">ARMOR</div>

        <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block mt-1" />
        <div v-else class="heading h3 text-primary">
          <v-icon size="18" class="mt-n1 mr-n1" style="opacity: 0.6">mdi-shield-outline</v-icon>
          {{ mech.Armor }}
        </div>
      </v-col>

      <v-col cols="auto" class="text-center">
        <div style="line-height: 0" class="text-overline text-primary mb-2">OVERSHIELD</div>
        <div class="d-inline-block"><blank-line :height="20" :width="40" /></div>
      </v-col>

      <v-col cols="auto" class="text-center">
        <div style="line-height: 0" class="text-overline text-primary mb-2">STRESS</div>
        <div class="d-inline-block"><blank-line :height="20" :width="40" /></div>
        <span class="d-inline-block mx-1" style="font-size: 24px; line-height: 0">/</span>

        <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block" />
        <div
          v-else
          class="d-inline-block flavor-text font-weight-bold"
          v-text="`${mech.MaxStress}`" />
      </v-col>

      <v-col :cols="'auto'" class="text-center">
        <div style="line-height: 0" class="text-overline text-primary mb-2">HEAT</div>
        <div>
          <div class="d-inline-block"><blank-line :height="20" :width="40" /></div>
          <span class="d-inline-block mx-1" style="font-size: 24px; line-height: 0">/</span>

          <blank-line v-if="blank" :width="40" :height="20" class="d-inline-block" />
          <div
            v-else
            class="d-inline-block flavor-text font-weight-bold"
            v-text="`${mech.HeatCapacity}`" />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col :cols="options.mechInclude.includes('mech image') ? (landscape ? 9 : 8) : 12">
        <v-row dense justify="space-between" class="mt-n3">
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">ATK</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ signed(mech.AttackBonus) }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">TECH ATK</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ signed(mech.TechAttack) }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">SAVE</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ mech.SaveTarget }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">SPEED</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ mech.Speed }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">E-DEF</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ mech.EDefense }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">EVASION</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ mech.Evasion }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">SENSORS</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ mech.SensorRange }}</b>
          </v-col>
          <v-col cols="auto">
            <span class="text-primary" style="font-size: 15px">LTD SYS</span>
            <blank-line v-if="blank" :width="30" :height="20" class="d-inline-block mb-n1 ml-1" />
            <b v-else class="pl-1">{{ signed(mech.LimitedBonus) }}</b>
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
        <div dense v-if="blank" class="">
          <blank-line
            :height="landscape ? (options.mechInclude.includes('mech image') ? 92 : 40) : 64" />
        </div>
        <fieldset v-else class="mt-n2" style="height: fit-content">
          <legend class="caption font-weight-bold ml-1 px-2">
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
          <div class="text-overline text-primary mb-2 mt-3" style="line-height: 0">NOTES</div>
          <div v-html-safe="mech.Notes" class="mt-2 caption" />
        </div>
      </v-col>

      <v-col v-if="options.mechInclude.includes('mech image')">
        <div style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 3px">
          <cc-img v-if="!blank" :src="mech.Portrait" />
          <div v-else style="height: 355px" />
        </div>
      </v-col>
    </v-row>

    <div v-if="options.mechInclude.includes('mech notes') && blank" class="pt-3">
      <div class="text-overline text-primary mb-2" style="line-height: 0">NOTES</div>
      <div class=""><notes :rows="5" lined /></div>
    </div>

    <div class="text-overline mb-n3 mt-n1 text-primary">LOADOUT</div>

    <div v-if="blank">
      <fieldset
        v-for="n in options.mechInclude.includes('extra mount panel') ? 5 : 4"
        class="my-1 pb-1">
        <legend class="caption ml-1 px-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <blank-line :width="160" :height="20" />
            </v-col>
            <v-col cols="auto" class="text-primary">MOUNT</v-col>
          </v-row>
        </legend>
        <v-row dense>
          <v-col v-for="n in 2">
            <v-row dense>
              <v-col>
                <div class="caption text-grey">WEAPON</div>
                <blank-line :height="20" />
              </v-col>
              <v-col cols="2">
                <div class="caption text-grey">TYPE</div>
                <blank-line :height="20" />
              </v-col>
              <v-col cols="2">
                <div class="caption text-grey">RANGE</div>
                <blank-line :height="20" />
              </v-col>
              <v-col cols="2">
                <div class="caption text-grey">DAMAGE</div>
                <blank-line :height="20" />
              </v-col>
            </v-row>
            <blank-line :height="landscape ? 40 : 64" class="mt-1" />
          </v-col>
        </v-row>
      </fieldset>
    </div>

    <v-row v-else dense class="mb-1">
      <v-col v-for="m in mounts" style="min-width: 30vw; position: relative" class="pa-0">
        <fieldset>
          <legend class="caption ml-1 px-2">{{ m.Name }}</legend>
          <div v-if="m.IsLocked" class="text-center flavor-text">
            MOUNT LOCKED
            <br />
            <span class="text-overline">// SUPERHEAVY WEAPON BRACING //</span>
          </div>
          <v-row v-else dense>
            <v-col v-for="w in m.Weapons" class="px-1 caption">
              <v-row dense align="center">
                <v-col cols="auto">
                  <b class="caption font-weight-bold" style="line-height: 0">{{ w.Name }}</b>
                </v-col>
                <v-col>
                  <span class="caption" style="line-height: 0">
                    {{ w.Size }} {{ w.WeaponTypes.join('/') }}
                  </span>
                </v-col>
                <v-col v-if="w.Uses" cols="auto">
                  <v-icon
                    v-for="n in w.getTotalUses(mech.Pilot.LimitedBonus)"
                    size="small"
                    color="primary">
                    mdi-hexagon-outline
                  </v-icon>
                </v-col>
              </v-row>

              <div v-if="showCollectedEffect(w)" class="caption">
                {{ w.Profiles[0].Effect }}
              </div>
              <div v-for="p in w.Profiles">
                <div class="caption">
                  <span v-if="w.Profiles.length > 1 && p.Name" class="heading">
                    {{ p.Name }}:&nbsp;
                  </span>
                  <span v-for="r in p.Range">
                    <v-icon size="15" :icon="r.Icon" />
                    {{ r.Value }}
                  </span>
                  <span v-for="d in p.Damage">
                    <v-icon size="20" :icon="d.Icon" :color="d.Color" />
                    {{ d.Value }}
                  </span>
                  <div v-if="p.Effect && !showCollectedEffect(w)" class="caption">
                    {{ p.Effect }}
                  </div>
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
                <div class="text-right" style="position: absolute; bottom: 0; right: 0">
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
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <v-divider v-if="blank" class="my-2" />
    <v-row v-if="blank" dense>
      <v-col
        v-for="n in options.mechInclude.includes('extra system space') ? 8 : 6"
        style="min-width: 20vw">
        <v-card variant="outlined" class="pa-1" style="border-color: rgba(0, 0, 0, 0.3)">
          <v-row dense>
            <v-col>
              <div class="caption text-grey">SYSTEM</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="2">
              <div class="caption text-grey">USES</div>
              <blank-line :height="20" />
            </v-col>
            <v-col cols="2">
              <div class="caption text-grey">SP COST</div>
              <blank-line :height="20" />
            </v-col>
          </v-row>
          <blank-line :height="landscape ? 40 : 64" class="my-2" />
        </v-card>
      </v-col>
    </v-row>

    <v-card
      v-else
      v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems"
      variant="outlined"
      class="px-1"
      :class="s.Tags ? 'pb-1 mb-1' : ''"
      style="position: relative; border-color: rgba(0, 0, 0, 0.2)">
      <v-row dense class="my-n2">
        <v-col cols="auto">
          <b class="text-overline font-weight-bold" style="line-height: 0">{{ s.Name }}</b>
        </v-col>
        <v-col>
          <span class="text-overline" style="line-height: 0">{{ s.Source }} {{ s.Type }}</span>
        </v-col>
        <v-col v-if="s.Uses" cols="auto">
          <v-icon v-for="n in s.getTotalUses(mech.Pilot.LimitedBonus)" size="small" color="primary">
            mdi-hexagon-outline
          </v-icon>
        </v-col>
      </v-row>
      <div v-if="s.Effect" class="caption mb-n1" v-html="s.Effect" />
      <print-action :actions="s.Actions" />
      <print-deployable :deployables="s.Deployables" />
      <div class="text-right" style="position: absolute; bottom: -2px; left: 0; right: 0">
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
