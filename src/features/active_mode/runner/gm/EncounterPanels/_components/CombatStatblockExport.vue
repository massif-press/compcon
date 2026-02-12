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
        Combat Statblock
      </v-btn>
    </template>
    <template #default>
      <div class="text-cc-overline text-disabled mt-2">// Options</div>
      <v-row dense
        class="mb-2">
        <v-col>
          <cc-switch v-model="enableJustify"
            label="Justify" />
        </v-col>
        <v-col cols="auto">
          <v-slide-x-reverse-transition>
            <div v-if="enableJustify"
              style="width: 300px;">
              <cc-number-field v-model.number="lineWidth"
                label="Line Width"
                color="primary"
                density="compact"
                size="small"
                type="number"
                variant="outlined"
                max="99999"
                dense
                hide-details />
            </div>
          </v-slide-x-reverse-transition>
        </v-col>
      </v-row>
      <div class="text-cc-overline text-disabled">// Include</div>
      <v-row dense
        justify="space-around">
        <v-col cols="auto">
          <cc-switch v-model="showUntracked"
            label="Stats" />
        </v-col>
        <v-col cols="auto">
          <cc-switch v-model="showActions"
            label="Actions" />
        </v-col>
        <v-col cols="auto">
          <cc-switch v-model="showLoadout"
            label="Loadout" />
        </v-col> <v-col cols="auto">
          <cc-switch v-model="showReserves"
            label="Reserves" />
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
              tooltip="Exports a plain text version of the combatant's current stats."
              @click.stop="exportBlock()">
              Export Text Statblock
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </template>
  </cc-dialog>
</template>

<script lang="ts">

export default {
  name: 'ActorLogs',
  props: {
    actor: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showUntracked: true,
    showActions: false,
    showLoadout: true,
    showReserves: false,
    enableJustify: true,
    lineWidth: 110,
  }),
  computed: {
    rootActor() {
      return this.actor.CombatController.RootActor
    },
    controller() {
      if (this.isPilot && this.actor.CombatController.Mounted)
        return this.actor.ActiveMech.CombatController;
      return this.actor.CombatController;
    },
    isPilot() {
      return this.rootActor.ItemType === 'Pilot';
    },
    mech() {
      return this.rootActor.ActiveMech;
    },
    cover() {
      if (this.controller.Cover === 'none') return 'Not in cover';
      if (this.controller.Cover === 'soft') return 'In soft cover';
      if (this.controller.Cover === 'hard') return 'In hard cover';
    },
    corepower() {
      if (!this.controller.CorePower) return '';
      return `Core Power: ${this.controller.CoreActive ? 'CORE ACTIVE' : !!this.controller.CorePower}`;
    },
    combatSpecials() {
      const out = [] as string[];
      if (this.controller.AIControl) out.push('⟦ AI CONTROLLED ⟧');
      if (this.controller.IsInSelfDestruct) out.push(`⟦ SELF-DESTRUCT INITIATED // T-${this.encounter.Round - this.controller.SelfDestructRound} ⟧`);
      return out.length ? ' ' + out.join('  ') : '';
    },
    availableActions() {
      if (!this.showActions) return '';
      const actions = [] as string[];
      if (this.controller.CanActivate('protocol')) actions.push('⦗ PROTOCOL ⦘');
      if (this.controller.CanActivate('full')) actions.push('⦗ FULL ⦘');
      else if (this.controller.CanActivate('full')) actions.push('⦗ QUICK ⦘');
      if (this.controller.CanActivate('overcharge')) actions.push('⦗ OVERCHARGE ⦘');
      if (this.controller.CanActivate('reaction')) actions.push('⦗ REACTION ⦘');
      return actions.join(' ') + '\n';
    },
    statuses() {
      let out = '';
      out += `${this.controller.Statuses.map((s: any) => `// ${s.status.Name.toUpperCase()} //`).join('  ')}`;
      if (this.controller.CustomStatuses.length > 0) {
        out += `${this.controller.CustomStatuses.map((s: any) => ` // ${s.status.Attribute.toUpperCase()} //`).join(' ')}`;
      }
      if (this.controller.Resistances.length) {
        out += `\n${this.controller.Resistances.map((r: any) => `${r.type} ${r.condition}`.toUpperCase()).join(', ')}`;
      }
      if (out.length === 0) return '';
      return `\n${out}\n`;
    },
    counters() {
      const cc = this.controller.CounterController
      if (cc.CounterData.length === 0) return '';
      const assembledCounters = cc.CounterData.map((c: any) => {
        const saveData = cc.CounterSaveData.find((sd: any) => sd.id === c.id);
        if (!saveData) return;
        return { name: c.name, val: saveData.val, max: c.max };
      });
      if (assembledCounters.length === 0) return '';
      return '\n' + assembledCounters.map((c: any) => `${c.name}: ${c.val}/${c.max}`).join('  ');
    },
    untrackedStats() {
      if (!this.showUntracked) return '';
      let out = '';
      let firstLine = [] as string[];
      if (this.isPilot) firstLine.push(`GRIT: ${this.controller.Grit}`);
      firstLine = firstLine.concat([
        this.getMaxStat('hull', 'H'),
        this.getMaxStat('agi', 'A'),
        this.getMaxStat('sys', 'S'),
        this.getMaxStat('eng', 'E'),
      ]);
      out += this.justify(firstLine) + '\n';

      let secondLine = [
        this.getMaxStat('evasion', 'Evasion'),
        this.getMaxStat('edef', 'E-Def'),
        this.getMaxStat('sensorRange', 'Sensors'),
        this.getMaxStat('saveTarget', 'Save'),
      ];
      if (this.isPilot) secondLine.push(this.getMaxStat('techattack', 'Tech Atk.'));
      out += this.justify(secondLine) + '\n';
      return out;
    },
    trackedStats() {
      let out = ''
      let firstLine = [
        this.getStat('hp', 'HP'),
        this.getStat('structure', 'Structure'),
        this.getCurrentStat('armor', 'Armor'),
        this.getCurrentStat('overshield', 'Overshield', 0),
      ];
      out += this.justify(firstLine) + '\n';

      let secondLine = [
        this.getStat('heatcap', 'Heat'),
        this.getStat('stress', 'Stress'),
        '',
        this.getCurrentStat('overcharge', 'Overcharge', 0),
      ];
      out += this.justify(secondLine) + '\n';

      let thirdLine = [
        this.getStat('speed', 'Movement'),
        this.getStat('repairCapacity', 'Repairs'),
        '',
        this.corepower,
      ];
      out += this.justify(thirdLine);

      return out;

    },
    features() {
      if (!this.showLoadout) return '';
      let out = '\n// LOADOUT\n';
      if (this.isPilot) return out + this.pilotLoadout;
      else return out + this.npcLoadout;
    },
    pilotLoadout() {
      let out = '';
      if (this.controller.Mounted) {
        const weapons = this.mech.MechLoadoutController.ActiveLoadout.Weapons;
        const systems = this.mech.MechLoadoutController.ActiveLoadout.Systems;
        weapons.forEach(w => {
          if (w.Destroyed) out += `${this.justify([w.Name, '', '', '', '✖ DESTROYED'])}\n`;
          else {
            let arr = [w.Name, w.Range.map(r => r.Text).join(', '), w.Damage.map(d => d.Text).join(', ')];
            if (w.MaxUses) arr.push(`${w.Uses} / ${w.MaxUses} Uses`);
            else arr.push('');
            arr.push(w.Used ? w.IsLoading ? '[ reload ]' : '[   used ]' : '[  READY ]');
            out += this.justify(arr) + '\n';
          }
        });
        systems.forEach(s => {
          if (s.Destroyed) out += `${s.Name} // DESTROYED // \n`;
          else {
            let arr = [s.Name, '', ''];
            if (s.MaxUses) arr.push(`${s.Uses} / ${s.MaxUses} Uses`);
            else arr.push('');
            arr.push(s.Used ? s.IsLoading ? '[ reload ]' : '[   used ]' : '[  READY ]');
            out += this.justify(arr) + '\n';
          }
        });
      } else {
        //pilot loadout
      }
      return out;
    },
    npcLoadout() {
      if (!this.showLoadout) return '';
      let out = '';
      const features = this.actor.NpcFeatureController.Features;
      features.forEach((feature: any) => {
        let arr = [feature.Name];
        if (feature.RangeData) {
          const mods = this.actor.NpcFeatureController.GetModifiers(feature);
          arr.push(feature.Range(this.controller.Tier, mods).map((r: any) => r.Text).join(', '));
        } else {
          arr.push('');
        }
        if (feature.DamageData) {
          const mods = this.actor.NpcFeatureController.GetModifiers(feature);
          arr.push(feature.Damage(this.controller.Tier, mods).map((r: any) => r.Text).join(', '));
        } else {
          arr.push('');
        }

        arr.push(feature.Used ? feature.Recharge ? `[recharge ${feature.Recharge}+]` : '[   used ]' : '[  READY ]');
        out += this.justify(arr) + '\n';
      });
      return out;
    },
    reserves() {
      if (!this.showReserves) return '';
      let out = '// RESERVES\n';
      if (!this.actor.CombatController.ReserveController || !this.actor.CombatController.ReserveController.Reserves.length) {
        out += 'None\n';
        return out;
      }
      const reserves = this.actor.CombatController.ReserveController.Reserves.filter(
        (x) => x.Type !== 'Organization' && x.Type !== 'Project'
      );
      reserves.forEach((r: any) => {
        out += `${r.Name}: ${r.Description}\n`;
      });
      return out;
    },
    statblockPreview() {
      return `${this.encounter.Name} - Round ${this.encounter.Round} (${new Date().toLocaleString()})
${'-'.repeat(75)}
${this.rootActor.ItemType} ${this.rootActor.CombatController.CombatName} ${this.rootActor.Level ? `- LL ${this.rootActor.Level} ` : this.controller.Tier ? ` - Tier ${this.controller.Tier}` : ''}${this.showActions ? ` |  ${this.getStat('activations', 'Activations')}` : ''}
${this.mech ? `${this.mech.Name} - ${this.mech.Frame.Source} ${this.mech.Frame.Name}` : ''} ${!this.isPilot ? '' : this.controller.Mounted ? `[ MOUNTED ]` : '[ UNMOUNTED ]'}
${this.controller.Braced ? `[ BRACED ] ` : ''}${this.controller.Overwatch ? `[ OVERWATCH ] ` : ''}${this.controller.Prepared ? `[ PREPARED ] ` : ''}⟦ ${this.cover} ⟧  ${this.combatSpecials}
${this.untrackedStats}${this.availableActions}${this.statuses}
${this.trackedStats}
${this.counters}
${this.features}
${this.reserves}`;
    },
  },
  methods: {
    justify(arr) {
      if (!this.enableJustify) return arr.filter(x => x.length).join('   ');
      if (!arr.length) return "";

      const cols = arr.length;

      const step = this.lineWidth / cols;
      const starts = [] as number[];

      for (let i = 0; i < cols; i++) {
        starts.push(Math.floor(i * step));
      }

      let line = Array(this.lineWidth).fill(" ");

      for (let i = 0; i < cols; i++) {
        const start = starts[i];
        const text = arr[i];

        for (let j = 0; j < text.length && start + j < this.lineWidth; j++) {
          line[start + j] = text[j];
        }
      }

      return line.join("");
    },
    getMaxStat(stat: string, shortHand: string, separator: string = '') {
      const c = this.isPilot && this.controller.Mounted ? this.mech.CombatController : this.controller;
      let max = c.StatController.MaxStats[stat];
      return `${shortHand}: ${max}${separator}`;
    },
    getCurrentStat(stat: string, shortHand: string, fallback?: number) {
      const c = this.isPilot && this.controller.Mounted ? this.mech.CombatController : this.controller;
      let current = c.StatController.CurrentStats[stat];
      if (!current && fallback !== undefined) current = fallback;
      return `${shortHand}: ${current}`;
    },
    getStat(stat: string, shortHand: string) {
      const c = this.isPilot && this.controller.Mounted ? this.mech.CombatController : this.controller;
      let current = c.StatController.CurrentStats[stat];
      let max = c.StatController.MaxStats[stat];
      return `${shortHand}: ${current}/${max}`;
    },
    copyContent() {
      navigator.clipboard.writeText(this.statblockPreview);
    },
    exportBlock() {
      let out;
      out = this.statblockPreview;


      const blob = new Blob([out], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.actor.Name} ${this.encounter.Name} round ${this.encounter.Round}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },

  },
};
</script>
