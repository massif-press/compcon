<template>
  <div class="text-black px-2">
    <v-row align="center">
      <v-col>
        <v-row dense align="center">
          <v-col cols="auto"
            ><div class="text-overline mt-n4 mb-n4 text-primary">MECH</div>
            <blank-line v-if="blank" :height="46" :width="500" class="my-2" />
            <div v-else class="heading h2">
              {{ mech.Name }}
            </div>
            <div v-if="!blank" class="heading h3 my-n2" style="opacity: 0.7">
              <v-icon
                :icon="`cc:${mech.Frame.Source.toLowerCase()}`"
                size="small"
                class="mt-n1"
              />{{ mech.Frame.Source }}
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

    <v-row dense justify="space-around" class="mt-n1">
      <v-col cols="auto" class="text-center">
        <div style="line-height: 10px" class="text-overline text-primary font-weight-bold mb-4">
          STRUCTURE
        </div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1"
            ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
          >
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else-if="pips">
          <v-icon
            v-for="n in mech.MaxStructure"
            size="35"
            color="grey-lighten-1"
            class="mr-n1 mt-n5"
            >cc:structure</v-icon
          >
        </div>
        <div v-else>
          <v-icon size="60" color="grey-lighten-1" class="mr-n1 mt-n5">cc:structure</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`/${mech.MaxStructure}`"
          />
        </div>
      </v-col>

      <v-col :cols="getHpCols">
        <v-row dense justify="center">
          <v-col cols="auto" class="text-center">
            <div
              style="line-height: 10px"
              :class="blank ? '' : 'mr-6'"
              class="text-overline text-primary font-weight-bold mb-4"
            >
              HP
            </div>
            <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
              <v-col cols="auto">
                <blank-line :width="80" :height="35" class="d-inline-block" />
              </v-col>
              <v-col cols="auto" class="px-1"
                ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
              >
              <v-col cols="auto">
                <blank-line :width="80" :height="35" class="d-inline-block" />
              </v-col>
            </v-row>
            <v-row v-else-if="pips" no-gutters class="mt-n4 pb-3" justify="center">
              <v-col v-for="n in mech.MaxHP" cols="auto" class="mx-n1 mb-n1">
                <v-icon v-if="mech.MaxHP < 10" :size="40" color="grey-lighten-1"
                  >mdi-hexagon-outline</v-icon
                >
                <v-icon v-else-if="mech.MaxHP <= 26" :size="35" color="grey-lighten-1"
                  >mdi-hexagon-outline</v-icon
                >
                <v-icon v-else:size="25" color="grey-lighten-1">mdi-hexagon-outline</v-icon>
              </v-col>
            </v-row>
            <div v-else>
              <v-icon size="55" color="grey-lighten-1" class="mr-n1 mt-n4">
                mdi-hexagon-outline
              </v-icon>
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-text="`/${mech.MaxHP}`"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="mech.Armor" cols="auto" class="text-center">
        <div style="line-height: 10px" class="text-overline text-primary font-weight-bold mb-4">
          ARMOR
        </div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else class="heading h2 mr-n2 text-primary" :class="pips ? 'mt-n4' : 'mt-n3'">
          <v-icon size="40" class="mt-n1 mr-n1" style="opacity: 0.6">mdi-shield-outline</v-icon>
          {{ mech.Armor }}
        </div>
      </v-col>

      <v-col cols="auto" class="text-center mb-1">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'pb-2'"
          class="text-overline text-primary font-weight-bold"
        >
          OVERSHIELD
        </div>
        <div class="px-6 mt-n1">
          <blank-line :height="pips || blank ? 35 : 38" />
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-around">
      <v-col cols="auto" class="text-center" :class="pips ? 'mt-n2' : ''">
        <div
          style="line-height: 10px"
          class="text-overline text-primary font-weight-bold mb-3 mr-2"
        >
          STRESS
        </div>
        <v-row v-if="blank" dense align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block mt-1" />
          </v-col>
          <v-col cols="auto" class="px-1"
            ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
          >
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else-if="pips" class="mt-4">
          <v-icon v-for="n in mech.MaxStress" size="35" color="grey-lighten-1" class="mr-n1 mt-n7"
            >cc:reactor</v-icon
          >
        </div>
        <div v-else>
          <v-icon size="65" color="grey-lighten-1" class="mr-n4 mt-n5">cc:reactor</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.MaxStress}`"
          />
        </div>
      </v-col>

      <v-col :cols="pips ? '' : 'auto'" class="text-center" :class="pips ? 'mt-n3' : ''">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'ml-6'"
          class="text-overline text-primary font-weight-bold mb-5"
        >
          HEAT
        </div>
        <v-row v-if="blank" no-gutters align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1"
            ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
          >
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else-if="pips" class="text-center">
          <v-icon
            v-for="n in Math.floor(mech.HeatCapacity / 2)"
            size="35"
            color="grey-lighten-1"
            class="mr-n1 mt-n7"
            >mdi-fire</v-icon
          >
          <v-icon
            v-for="n in Math.ceil(mech.HeatCapacity / 2)"
            size="35"
            color="grey-lighten-1"
            class="mr-n1 mt-n7"
            >mdi-fire-circle</v-icon
          >
        </div>
        <div v-else>
          <v-icon size="60" color="grey-lighten-1" class="mr-n5 mt-n5">mdi-fire</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.HeatCapacity}`"
          />
        </div>
      </v-col>

      <v-col :cols="pips ? '' : 'auto'" class="text-center" :class="pips ? 'mt-n3' : ''">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'ml-6'"
          class="text-overline text-primary font-weight-bold mb-5"
        >
          REPAIR CAPACITY
        </div>
        <v-row v-if="blank" no-gutters align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
          <v-col cols="auto" class="px-1"
            ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
          >
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else-if="pips" class="text-center">
          <v-icon
            v-for="n in mech.RepairCapacity"
            size="35"
            color="grey-lighten-1"
            class="mr-n1 mt-n7"
            >cc:repair</v-icon
          >
        </div>
        <div v-else>
          <v-icon size="65" color="grey-lighten-1" class="mr-n4 mt-n6">cc:repair</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-text="`&nbsp;/${mech.RepairCapacity}`"
          />
        </div>
      </v-col>

      <v-col :cols="pips ? '' : 'auto'" class="text-center" :class="pips ? 'mt-n3' : ''">
        <div
          style="line-height: 10px"
          :class="blank ? '' : 'ml-6'"
          class="text-overline text-primary font-weight-bold mb-5"
        >
          CORE POWER
        </div>
        <v-row v-if="blank" no-gutters align="center" justify="center" class="mt-n5">
          <v-col cols="auto">
            <blank-line :width="80" :height="35" class="d-inline-block" />
          </v-col>
        </v-row>
        <div v-else-if="pips" class="text-center">
          <v-icon v-for="n in 1" size="35" color="grey-lighten-1" class="mr-n1 mt-n7"
            >mdi-battery-outline</v-icon
          >
        </div>
        <div v-else>
          <v-icon size="65" color="grey-lighten-1" class="mr-n3 mt-n6">mdi-battery-outline</v-icon>
          <b class="d-inline-block flavor-text font-weight-bold mb-n2" v-text="`/1`" />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
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
            style="min-width: 8vw"
          >
            <fieldset>
              <legend class="caption font-weight-bold text-primary px-1">SYSTEM POINTS</legend>
            </fieldset>
          </v-col>
        </v-row>

        <div class="text-overline mb-n3 text-primary">FRAME TRAITS</div>
        <v-row dense v-if="blank">
          <v-col v-for="n in 4" cols="6">
            <blank-line :height="80" />
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
        <div dense v-if="blank" class="mt-n2">
          <blank-line :height="112" />
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
          <div v-if="mech.Frame.CoreSystem.Tags" class="text-right">
            <tag-block :tags="mech.Frame.CoreSystem.Tags" :options="options" mech />
          </div>
        </fieldset>

        <div v-if="mech.Notes && !blank" class="pt-2">
          <div class="text-overline text-primary mt-3" style="line-height: 0">NOTES</div>
          <div v-html-safe="mech.Notes" class="mt-2 caption" />
        </div>
      </v-col>

      <v-col cols="4" style="margin-top: 6px">
        <v-card height="100%" variant="outlined" color="grey">
          <v-row style="height: 100%" align="center">
            <v-col>
              <v-img v-if="!blank" :src="mech.Portrait" cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="blank" class="pt-2">
      <div class="text-overline text-primary mt-3" style="line-height: 0">NOTES</div>
      <notes :rows="5" lined />
    </div>

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
          <div v-for="p in w.Profiles">
            <div class="flavor-text text-black mt-n1" style="font-size: 16px">
              <b v-for="r in p.Range" class="px-1"
                ><v-icon class="mt-n1" :icon="r.Icon" />{{ r.Text }}</b
              >
              <span v-if="p.Damage && p.Damage.length" class="pl-2 pr-1"><cc-slashes /></span>
              <b v-for="d in p.Damage">
                <v-icon class="mt-n1 mr-n2" :icon="d.Icon" :color="d.Color" />
                {{ d.Text }}</b
              >
              <p v-if="p.Effect" :v-html-safe="p.Effect" print />
              <p v-if="p.OnAttack" :v-html-safe="`<b>ON ATTACK:</b> ${p.OnAttack}`" print />
              <p v-if="p.OnHit" :v-html-safe="`<b>ON HIT:</b> ${p.OnHit}`" print />
              <p v-if="p.OnCrit" :v-html-safe="`<b>ON CRIT:</b> ${p.OnCrit}`" print />
              <print-action :actions="p.Actions" />
              <print-deployable :deployables="p.Deployables" />
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
          <print-action :actions="s.Actions" />
          <print-deployable :deployables="s.Deployables" />
          <tag-block :tags="s.Tags" :options="options" mech />
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
    pips() {
      return this.options.tracking === 'pips';
    },
    getHpCols() {
      if (this.pips) {
        return this.landscape ? 8 : 7;
      }

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
