<template>
  <div class="text-black px-2">
    <print-mech-name-block :mech="mech"
      :blank="blank" />

    <print-mech-hp-rows :mech="mech"
      :blank="blank" />

    <v-row dense
      class="mt-2">
      <v-col cols="8">
        <v-row dense
          :class="blank ? 'mt-n3' : ''">
          <print-stat-box label="ATTACK BONUS" :value="signed(mech.AttackBonus)" :blank="blank" min-width="4vw" />
          <print-stat-box label="TECH ATTACK" :value="signed(mech.TechAttack)" :blank="blank" />
          <print-stat-box label="SAVE" :value="mech.SaveTarget" :blank="blank" />
          <print-stat-box label="SPEED" :value="mech.Speed" :blank="blank" />
          <print-stat-box label="E-DEFENSE" :value="mech.EDefense" :blank="blank" />
          <print-stat-box label="EVASION" :value="mech.Evasion" :blank="blank" />
          <print-stat-box label="SENSOR RANGE" :value="mech.SensorRange" :blank="blank" />
          <print-stat-box label="LIMITED BONUS" :value="signed(mech.LimitedBonus)" :blank="blank" />
          <print-stat-box v-if="blank" label="SYSTEM POINTS" :blank="blank" />
        </v-row>

        <div class="text-overline mb-n3 text-primary">FRAME TRAITS</div>
        <v-row v-if="blank"
          dense>
          <v-col v-for="n in 4"
            :key="`trait-${n}`"
            cols="12">
            <blank-line :height="100" />
          </v-col>
        </v-row>
        <v-row v-else
          dense
          justify="space-between"
          class="caption mt-n1">
          <v-col v-for="t in mech.Frame.Traits"
            :key="t.Name"
            :cols="t.Actions.length + t.Deployables.length > 0 ? '12' : ''">
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
          <fieldset class="mt-n2"
            style="height: fit-content">
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
              <p v-html-safe="mech.Frame.CoreSystem.PassiveEffect"
                class="caption ml-6 mb-1" />
              <print-action :actions="mech.Frame.CoreSystem.PassiveActions" />
            </div>
            <template v-if="mech.Frame.CoreSystem.ActiveEffect">
              <div class="heading ml-4">
                {{
                  mech.Frame.CoreSystem.ActiveName
                    ? `${mech.Frame.CoreSystem.ActiveName} (ACTIVE)`
                    : 'CORE ACTIVE'
                }}
              </div>
              <p v-html-safe="mech.Frame.CoreSystem.ActiveEffect"
                class="caption ml-6 mb-1" />
              <print-action :actions="mech.Frame.CoreSystem.ActiveActions" />
              <print-deployable :deployables="mech.Frame.CoreSystem.Deployables" />
            </template>
            <div v-if="mech.Frame.CoreSystem.Tags"
              class="text-right">
              <tag-block :tags="mech.Frame.CoreSystem.Tags"
                :options="options"
                mech />
            </div>
          </fieldset>
        </div>
      </v-col>

      <v-col cols="4"
        style="margin-top: -2px">
        <v-card height="100%"
          variant="outlined"
          color="grey">
          <v-row style="height: 100%"
            align="center">
            <v-col>
              <print-img v-if="!blank"
                :src="mech.Portrait"
                cover />
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
      <notes v-if="blank || !mech.notes"
        :rows="9"
        lined />
      <div v-else
        v-html-safe="mech.Notes"
        class="caption px-2" />
    </fieldset>

    <page-break />

    <div class="text-overline mb-n3 mt-1 text-primary">LOADOUT</div>

    <print-blank-loadout v-if="blank"
      :extra-mounts="hasMechOption('Extra Mount Panel')" />

    <fieldset v-for="m in mounts"
      v-else
      :key="m.ID"
      style="position: relative"
      class="no-print-break">
      <legend class="heading h3 ml-1 px-2">{{ m.Name }}</legend>
      <div v-if="m.IsLocked"
        class="text-center flavor-text">
        MOUNT LOCKED
        <br />
        <span class="text-overline">// SUPERHEAVY WEAPON BRACING //</span>
      </div>
      <div v-for="w in m.Weapons.filter(Boolean)"
        v-else
        :key="w.ID"
        class="px-1 pb-3">
        <v-row dense
          align="center">
          <v-col cols="auto"><v-icon icon="cc:weapon" /></v-col>
          <v-col cols="auto">
            <b class="heading h4"
              style="line-height: 0">{{ w.Name }}</b>
          </v-col>
          <v-col>
            <span class="text-overline"
              style="line-height: 0">
              {{ w.Source }} {{ w.Size }} {{ w.WeaponTypes.join('/') }}
            </span>
          </v-col>
          <v-col v-if="w.Uses"
            cols="auto">
            <v-icon v-for="n in w.getTotalUses(mech.LimitedBonus)"
              :key="`use-${n}`"
              size="small"
              color="primary">
              mdi-hexagon-outline
            </v-icon>
          </v-col>
        </v-row>
        <div class="pl-7">
          <div v-if="showCollectedEffect(w)"
            class="caption mb-2">{{ w.Profiles[0].Effect }}</div>
          <div v-for="(p, index) in w.Profiles"
            :key="`profile-${index}`"
            class="mb-n2">
            <div class="flavor-text text-black mt-n1"
              style="font-size: 15px">
              <span v-if="w.Profiles.length > 1 && p.Name"
                class="heading">
                {{ p.Name }}:&nbsp;
              </span>
              <b v-for="(r, ri) in p.Range"
                :key="`range-${ri}`"
                class="px-1">
                <v-icon class="mt-n1"
                  :icon="r.Icon" />
                {{ r.Text }}
              </b>
              <span v-if="p.Damage && p.Damage.length"
                class="pl-2 pr-1"><cc-slashes /></span>
              <b v-for="(d, di) in p.Damage"
                :key="`damage-${di}`">
                <v-icon class="mt-n1 mr-n2"
                  :icon="d.Icon"
                  :color="d.Color" />
                {{ d.Text }}
              </b>
              <div v-if="p.Effect && !showCollectedEffect(w)"
                class="caption">{{ p.Effect }}</div>
              <div v-if="p.OnMiss"
                class="caption">
                <b>ON MISS:</b>
                {{ p.OnMiss.Detail }}
              </div>
              <div v-if="p.OnAttack"
                class="caption">
                <b>ON ATTACK:</b>
                {{ p.OnAttack.Detail }}
              </div>
              <div v-if="p.OnHit"
                class="caption">
                <b>ON HIT:</b>
                {{ p.OnHit.Detail }}
              </div>
              <div v-if="p.OnCrit"
                class="caption">
                <b>ON CRIT:</b>
                {{ p.OnCrit.Detail }}
              </div>
              <print-action :actions="p.Actions" />
              <print-deployable :deployables="p.Deployables" />
            </div>
            <tag-block :tags="p.Tags"
              :options="options"
              mech />
          </div>

          <v-card v-if="w.Mod"
            variant="outlined"
            color="mod"
            class="px-2 pb-1 mb-1">
            <div class="text-black">
              <span class="heading">
                {{ w.Mod.Name }}
              </span>
              <span class="text-cc-overline">&nbsp;//APPLIED MOD</span>
              <p v-if="w.Mod.Effect"
                v-html-safe="w.Mod.Effect"
                class="caption mt-n1"
                print />
            </div>
          </v-card>
        </div>
      </div>
    </fieldset>

    <print-blank-systems v-if="blank"
      :extra-system-space="hasMechOption('Extra System Space')" />
    <print-systems-list v-else
      :mech="mech"
      :options="options" />

    <fieldset v-if="hasMechOption('Append Lined Section')"
      class="mx-1 my-3 px-3 no-print-break">
      <div class="mb-4">
        <notes :rows="48"
          lined />
      </div>
    </fieldset>

    <fieldset v-if="hasMechOption('Append Unlined Section')"
      class="mx-1 my-3 px-3 no-print-break">
      <div class="mb-4">
        <notes :rows="48" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrintAction from '../../components/PrintAction.vue';
import PrintDeployable from '../../components/PrintDeployable.vue';
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';
import tagBlock from '../../components/TagBlock.vue';
import PageBreak from '../../components/PageBreak.vue';
import PrintMechNameBlock from '../../components/PrintMechNameBlock.vue';
import PrintHpBlock from '../../components/PrintHpBlock.vue';
import PrintStatBox from '../../components/PrintStatBox.vue';
import PrintBlankLoadout from '../../components/PrintBlankLoadout.vue';
import PrintBlankSystems from '../../components/PrintBlankSystems.vue';
import PrintSystemsList from '../../components/PrintSystemsList.vue';
import { usePrintOptions } from '../usePrintOptions';
import PrintMechHpRows from '../../components/_PrintMechHpRows.vue';

const props = defineProps<{
  mech: object
  options: object
}>()

const { blank, landscape, hasPilotOption, hasMechOption, signed, showTag, showCollectedEffect } = usePrintOptions(props)

const mounts = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.AllMounts(
        props.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        props.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        props.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      );
    })
const getHpCols = computed(() => {
      return 'auto';
    })
</script>

<style scoped>
@import '@/ui/style/print-mech.css';
</style>
