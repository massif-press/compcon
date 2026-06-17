<template>
  <cc-dialog icon="mdi-export-variant"
    :title="`${actor.Name} Current Stats`"
    :close-on-click="false"
    min-width="900"
    max-width="900">
    <template #activator="{ open }">
      <v-btn size="x-small"
        flat
        tile
        @click="open">
        <v-icon icon="mdi-export-variant"
          start />
        {{ $t('active.statblockExport.title') }}
      </v-btn>
    </template>
    <template #default>
      <div class="text-cc-overline text-disabled mt-2">// {{ $t('common.options') }}</div>
      <statblock-justify-options v-model:enable-justify="enableJustify"
        v-model:line-width="lineWidth" />
      <div class="text-cc-overline text-disabled">{{ $t('active.statblockExport.include') }}</div>
      <v-row dense
        justify="space-around">
        <v-col cols="auto">
          <cc-switch v-model="showUntracked"
            :label="$t('common.statsLabel')" />
        </v-col>
        <v-col cols="auto">
          <cc-switch v-model="showActions"
            :label="$t('common.actions')" />
        </v-col>
        <v-col cols="auto">
          <cc-switch v-model="showLoadout"
            :label="$t('common.loadout')" />
        </v-col> <v-col cols="auto">
          <cc-switch v-model="showReserves"
            :label="$t('common.reserves')" />
        </v-col>
      </v-row>
      <cc-panel color="background"
        class="my-2"
        density="compact"
        style="position: relative;">
        <div style="font-family: 'Consolas'; font-size: 14px; white-space: pre; overflow: auto;">
          {{ statblockPreview }}
        </div>
        <v-btn icon="mdi-content-copy"
          size="x-small"
          flat
          tile
          class="fade-select"
          style="position: absolute; bottom: 0; right: 0;"
          @click.stop="copyContent()" />
      </cc-panel>


      <div>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <cc-button size="small"
              block
              color="primary"
              prepend-icon="mdi-export"
              :tooltip="$t('active.tooltips.exportsAPlainTextVersion2')"
              @click.stop="exportBlock()">
              {{ $t('active.statblockExport.exportText') }}
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import StatblockJustifyOptions from './_StatblockJustifyOptions.vue';

defineOptions({ name: 'ActorLogs' })

const display = useDisplay()

const props = defineProps<{
  actor: ICombatant
  encounterInstance: EncounterInstance
}>()

const showUntracked = ref(true)
const showActions = ref(false)
const showLoadout = ref(true)
const showReserves = ref(false)
const enableJustify = ref(true)
const lineWidth = ref(110)

const rootActor = computed(() => (props.actor as any).CombatController.RootActor)
const isPilot = computed(() => rootActor.value.ItemType === 'Pilot')
const mech = computed(() => rootActor.value.ActiveMech)
const controller = computed(() => {
  if (isPilot.value && (props.actor as any).CombatController.Mounted)
    return (props.actor as any).ActiveMech.CombatController;
  return (props.actor as any).CombatController;
})
const cover = computed(() => {
  if (controller.value.Cover === 'none') return 'Not in cover';
  if (controller.value.Cover === 'soft') return 'In soft cover';
  if (controller.value.Cover === 'hard') return 'In hard cover';
})
const corepower = computed(() => {
  if (!controller.value.CorePower) return '';
  return `Core Power: ${controller.value.CoreActive ? 'CORE ACTIVE' : !!controller.value.CorePower}`;
})
const combatSpecials = computed(() => {
  const out = [] as string[];
  if (controller.value.AIControl) out.push('⟦ AI CONTROLLED ⟧');
  if (controller.value.IsInSelfDestruct) out.push(`⟦ SELF-DESTRUCT INITIATED // T-${(props.encounterInstance as any).Round - controller.value.SelfDestructRound} ⟧`);
  return out.length ? ' ' + out.join('  ') : '';
})
const availableActions = computed(() => {
  if (!showActions.value) return '';
  const actions = [] as string[];
  if (controller.value.CanActivate('protocol')) actions.push('⦗ PROTOCOL ⦘');
  if (controller.value.CanActivate('full')) actions.push('⦗ FULL ⦘');
  else if (controller.value.CanActivate('full')) actions.push('⦗ QUICK ⦘');
  if (controller.value.CanActivate('overcharge')) actions.push('⦗ OVERCHARGE ⦘');
  if (controller.value.CanActivate('reaction')) actions.push('⦗ REACTION ⦘');
  return actions.join(' ') + '\n';
})
const statuses = computed(() => {
  let out = '';
  out += `${controller.value.Statuses.map((s: any) => `// ${s.status.Name.toUpperCase()} //`).join('  ')}`;
  if (controller.value.CustomStatuses.length > 0) {
    out += `${controller.value.CustomStatuses.map((s: any) => ` // ${s.status.Attribute.toUpperCase()} //`).join(' ')}`;
  }
  if (controller.value.Resistances.length) {
    out += `\n${controller.value.Resistances.map((r: any) => `${r.type} ${r.condition}`.toUpperCase()).join(', ')}`;
  }
  if (out.length === 0) return '';
  return `\n${out}\n`;
})
const counters = computed(() => {
  const cc = controller.value.CounterController
  if (cc.CounterData.length === 0) return '';
  const assembledCounters = cc.CounterData.map((c: any) => {
    const saveData = cc.CounterSaveData.find((sd: any) => sd.id === c.id);
    if (!saveData) return;
    return { name: c.name, val: saveData.val, max: c.max };
  });
  if (assembledCounters.length === 0) return '';
  return '\n' + assembledCounters.map((c: any) => `${c.name}: ${c.val}/${c.max}`).join('  ');
})
const untrackedStats = computed(() => {
  if (!showUntracked.value) return '';
  let out = '';
  let firstLine = [] as string[];
  if (isPilot.value) firstLine.push(`GRIT: ${controller.value.Grit}`);
  firstLine = firstLine.concat([
    getMaxStat('hull', 'H'),
    getMaxStat('agi', 'A'),
    getMaxStat('sys', 'S'),
    getMaxStat('eng', 'E'),
  ]);
  out += justify(firstLine) + '\n';
  const secondLine = [
    getMaxStat('evasion', 'Evasion'),
    getMaxStat('edef', 'E-Def'),
    getMaxStat('sensorRange', 'Sensors'),
    getMaxStat('saveTarget', 'Save'),
  ];
  if (isPilot.value) secondLine.push(getMaxStat('techAttack', 'Tech Atk.'));
  out += justify(secondLine) + '\n';
  return out;
})
const trackedStats = computed(() => {
  let out = ''
  const firstLine = [
    getStat('hp', 'HP'),
    getStat('structure', 'Structure'),
    getCurrentStat('armor', 'Armor'),
    getCurrentStat('overshield', 'Overshield', 0),
  ];
  out += justify(firstLine) + '\n';
  const secondLine = [
    getStat('heatcap', 'Heat'),
    getStat('stress', 'Stress'),
    '',
    getCurrentStat('overcharge', 'Overcharge', 0),
  ];
  out += justify(secondLine) + '\n';
  const thirdLine = [
    getStat('speed', 'Movement'),
    getStat('repairCapacity', 'Repairs'),
    '',
    corepower.value,
  ];
  out += justify(thirdLine);
  return out;
})
const pilotLoadout = computed(() => {
  let out = '';
  if (controller.value.Mounted) {
    const weapons = mech.value.MechLoadoutController.ActiveLoadout.Weapons;
    const systems = mech.value.MechLoadoutController.ActiveLoadout.Systems;
    weapons.forEach((w: any) => {
      if (w.Destroyed) out += `${justify([w.Name, '', '', '', '✖ DESTROYED'])}\n`;
      else {
        const arr = [w.Name, w.Range.map((r: any) => r.Text).join(', '), w.Damage.map((d: any) => d.Text).join(', ')];
        if (w.MaxUses) arr.push(`${w.Uses} / ${w.MaxUses} Uses`);
        else arr.push('');
        arr.push(w.Used ? w.IsLoading ? '[ reload ]' : '[   used ]' : '[  READY ]');
        out += justify(arr) + '\n';
      }
    });
    systems.forEach((s: any) => {
      if (s.Destroyed) out += `${s.Name} // DESTROYED // \n`;
      else {
        const arr = [s.Name, '', ''];
        if (s.MaxUses) arr.push(`${s.Uses} / ${s.MaxUses} Uses`);
        else arr.push('');
        arr.push(s.Used ? s.IsLoading ? '[ reload ]' : '[   used ]' : '[  READY ]');
        out += justify(arr) + '\n';
      }
    });
  }
  return out;
})
const npcLoadout = computed(() => {
  if (!showLoadout.value) return '';
  let out = '';
  const features = (props.actor as any).NpcFeatureController?.Features || [];
  features.forEach((feature: any) => {
    const arr = [feature.Name];
    if (feature.RangeData) {
      const mods = (props.actor as any).NpcFeatureController?.GetModifiers(feature) || [];
      arr.push(feature.Range(controller.value.Tier, mods).map((r: any) => r.Text).join(', '));
    } else {
      arr.push('');
    }
    if (feature.DamageData) {
      const mods = (props.actor as any).NpcFeatureController?.GetModifiers(feature) || [];
      arr.push(feature.Damage(controller.value.Tier, mods).map((r: any) => r.Text).join(', '));
    } else {
      arr.push('');
    }
    arr.push(feature.Used ? feature.Recharge ? `[recharge ${feature.Recharge}+]` : '[   used ]' : '[  READY ]');
    out += justify(arr) + '\n';
  });
  return out;
})
const features = computed(() => {
  if (!showLoadout.value) return '';
  const out = '\n// LOADOUT\n';
  if (isPilot.value) return out + pilotLoadout.value;
  else return out + npcLoadout.value;
})
const reserves = computed(() => {
  if (!showReserves.value) return '';
  let out = '// RESERVES\n';
  const rc = (props.actor as any).CombatController.ReserveController;
  if (!rc || !rc.Reserves.length) { out += 'None\n'; return out; }
  rc.Reserves.filter((x: any) => x.Type !== 'Organization' && x.Type !== 'Project')
    .forEach((r: any) => { out += `${r.Name}: ${r.Description}\n`; });
  return out;
})
const statblockPreview = computed(() => {
  const enc = props.encounterInstance as any;
  return `${enc.Name} - Round ${enc.Round} (${new Date().toLocaleString()})
${'-'.repeat(75)}
${rootActor.value.ItemType} ${rootActor.value.CombatController.CombatName} ${rootActor.value.Level ? `- LL ${rootActor.value.Level} ` : controller.value.Tier ? ` - Tier ${controller.value.Tier}` : ''}${showActions.value ? ` |  ${getStat('activations', 'Activations')}` : ''}
${mech.value ? `${mech.value.Name} - ${mech.value.Frame.Source} ${mech.value.Frame.Name}` : ''} ${!isPilot.value ? '' : controller.value.Mounted ? `[ MOUNTED ]` : '[ UNMOUNTED ]'}
${controller.value.Braced ? `[ BRACED ] ` : ''}${controller.value.Overwatch ? `[ OVERWATCH ] ` : ''}${controller.value.Prepared ? `[ PREPARED ] ` : ''}⟦ ${cover.value} ⟧  ${combatSpecials.value}
${untrackedStats.value}${availableActions.value}${statuses.value}
${trackedStats.value}
${counters.value}
${features.value}
${reserves.value}`;
})

onMounted(() => {
  if (display.smAndDown.value) enableJustify.value = false;
})

function justify(arr: string[]) {
  if (!enableJustify.value) return arr.filter(x => x.length).join('   ');
  if (!arr.length) return '';
  const cols = arr.length;
  const step = lineWidth.value / cols;
  const starts = [] as number[];
  for (let i = 0; i < cols; i++) starts.push(Math.floor(i * step));
  const line = Array(lineWidth.value).fill(' ');
  for (let i = 0; i < cols; i++) {
    const start = starts[i];
    const text = arr[i];
    for (let j = 0; j < text.length && start + j < lineWidth.value; j++) {
      line[start + j] = text[j];
    }
  }
  return line.join('');
}
function getMaxStat(stat: string, shortHand: string, separator = '') {
  const c = isPilot.value && controller.value.Mounted ? mech.value.CombatController : controller.value;
  const max = c.StatController.MaxStats[stat];
  return `${shortHand}: ${max}${separator}`;
}
function getCurrentStat(stat: string, shortHand: string, fallback?: number) {
  const c = isPilot.value && controller.value.Mounted ? mech.value.CombatController : controller.value;
  let current = c.StatController.CurrentStats[stat];
  if (!current && fallback !== undefined) current = fallback;
  return `${shortHand}: ${current}`;
}
function getStat(stat: string, shortHand: string) {
  const c = isPilot.value && controller.value.Mounted ? mech.value.CombatController : controller.value;
  const current = c.StatController.CurrentStats[stat];
  const max = c.StatController.MaxStats[stat];
  return `${shortHand}: ${current}/${max}`;
}
function copyContent() {
  navigator.clipboard.writeText(statblockPreview.value);
}
function exportBlock() {
  const out = statblockPreview.value;
  const blob = new Blob([out], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(props.actor as any).Name} ${(props.encounterInstance as any).Name} round ${(props.encounterInstance as any).Round}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
