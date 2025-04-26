<template>
  <cc-panel :title="`CONFIGURATION // ${itemName}`" icon="cc:weapon">
    <v-row dense justify="space-around">
      <v-col cols="12" lg="">
        <div class="text-cc-overline">WEAPON TYPE</div>
        <v-menu>
          <template #activator="{ props }">
            <cc-button
              block
              size="x-small"
              :prepend-icon="weaponType ? item.Range[0].Icon : 'mdi-help'"
              :color="weaponType ? 'primary' : 'panel'"
              @click="props.onClick($event)">
              {{ weaponType || 'NOT SET' }}
            </cc-button>
          </template>
          <v-list density="compact" slim flat tile border>
            <v-list-item
              v-for="(type, index) in weaponTypes"
              :key="index"
              @click="setWeaponType(type.value)">
              <v-list-item-title>
                <v-icon start size="small">{{ type.icon }}</v-icon>
                {{ type.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" lg="">
        <div class="text-cc-overline">DAMAGE TYPE</div>
        <v-menu>
          <template #activator="{ props }">
            <cc-button
              block
              size="x-small"
              :prepend-icon="damageType ? `cc:${damageType}` : 'mdi-help'"
              :color="damageType ? `damage--${damageType}` : 'panel'"
              @click="props.onClick($event)">
              {{ damageType || 'NOT SET' }}
            </cc-button>
          </template>
          <v-list density="compact" slim flat tile border>
            <v-list-item
              v-for="(type, index) in damageTypes"
              :key="index"
              @click="setDamageType(type.value)">
              <v-list-item-title>
                <v-icon start size="small">cc:{{ type.value }}</v-icon>
                {{ type.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" lg="">
        <div class="text-cc-overline">USES</div>
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <cc-button
              block
              size="x-small"
              :prepend-icon="uses ? 'mdi-dice-d20-outline' : 'mdi-help'"
              :color="uses ? 'primary' : 'panel'"
              @click="props.onClick($event)">
              {{ uses ? uses : 'NOT SET' }}
            </cc-button>
          </template>
          <v-card flat tile border>
            <v-card-text class="pt-1">
              <div class="text-cc-overline mb-2">
                SET USES
                <cc-slashes />
                {{ level < 3 ? `1d6+2` : `2d6` }}
              </div>

              <v-row dense align="center" justify="space-between">
                <v-col cols="auto">
                  <v-btn size="x-small" icon variant="text" @click="rollUses">
                    <v-icon size="x-large">mdi-dice-multiple-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <cc-number-field
                    v-model="uses"
                    :min="0"
                    :max="level < 3 ? 8 : 12"
                    size="x-small" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
      <v-col v-if="level > 1" cols="12" lg="6">
        <div class="text-cc-overline">REVISIONS</div>
        <v-menu :close-on-content-click="false" :max-width="300">
          <template #activator="{ props }">
            <cc-button
              block
              size="x-small"
              :prepend-icon="selectedRevisions[0] ? `cc:talent` : 'mdi-help'"
              :color="selectedRevisions[0] ? `primary` : 'panel'"
              @click="props.onClick($event)">
              <span v-if="!selectedRevisions.length">NOT SET</span>
              <span v-else>
                {{ selectedRevisionTitles }}
              </span>
            </cc-button>
          </template>
          <v-list v-model="selectedRevisions" multiple density="compact" slim flat tile border>
            <v-list-item
              v-for="(rev, idx) in revisions"
              @click="setRevision(rev.value)"
              :active="selectedRevisions.includes(rev.value)"
              active-class="bg-primary"
              :disabled="!selectedRevisions.includes(rev.value) && selectedRevisions.length >= 2">
              <v-list-item-title>
                <v-icon start size="small" icon="cc:talent" />
                {{ rev.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </cc-panel>
  <cc-alert
    v-if="selectedRevisions.includes('stripped_reactor')"
    :title="`Stripped Reactor Shielding`"
    icon="cc:talent"
    color="weapon"
    class="mt-2">
    <div v-html="revisions[2].detail" class="text-cc-overline" />
  </cc-alert>
  <cc-tags v-if="item.CustomTags" :tags="item.CustomTags" color="exotic" extended />
</template>

<script lang="ts">
export default {
  name: 'engineer-weapon-inset',
  props: {
    item: { type: Object, required: true },
    mech: { type: Object, required: true },
    readonly: { type: Boolean },
  },
  data: () => ({
    weaponType: null,
    weaponTypes: [
      { title: 'Rifle', value: 'rifle', icon: 'cc:range' },
      { title: 'Cannon', value: 'cannon', icon: 'cc:range' },
      { title: 'Launcher', value: 'launcher', icon: 'cc:range' },
      { title: 'CQB', value: 'cqb', icon: 'cc:range' },
      { title: 'Nexus', value: 'nexus', icon: 'cc:range' },
      { title: 'Melee', value: 'melee', icon: 'cc:threat' },
    ],
    damageType: null,
    damageTypes: [
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
    ],
    uses: 0,
    revisions: [
      {
        title: 'Tweaked Optics',
        value: 'tweaked_optics',
        icon: 'cc:talent',
        detail: 'Your prototype weapon always gains +1 Accuracy on attacks',
      },
      {
        title: 'Tweaked Computer',
        value: 'tweaked_computer',
        icon: 'cc:talent',
        detail: 'Your prototype weapon is Smart',
      },
      {
        title: 'Stripped Reactor Shielding',
        value: 'stripped_reactor',
        icon: 'cc:talent',
        detail:
          'Each time you attack with your prototype weapon, you may choose – at the cost of 2 Heat – to attack with one of the following options, depending on its weapon type:<ul><li>Ranged weapon: Cone 3, Line 5, or [Blast 1, Range 10].</li><li>Melee weapon: Burst 1.</li>',
      },
    ],
    selectedRevisions: [] as string[],
  }),
  created() {
    this.weaponType = this.item.GetOverride('weapon_type') || null;
    this.damageType = this.item.GetOverride('damage') || null;
    this.uses = this.item.GetOverride('uses') || 0;
    if (this.item.GetOverride('tags').some((t) => t.id === 'tg_accurate')) {
      this.selectedRevisions.push('tweaked_optics');
    }
    if (this.item.GetOverride('tags').some((t) => t.id === 'tg_smart')) {
      this.selectedRevisions.push('tweaked_computer');
    }
    if (this.item.GetOverride('effect')) {
      this.selectedRevisions.push('stripped_reactor');
    }
  },
  watch: {
    uses() {
      this.setUses();
    },
  },
  computed: {
    level() {
      return this.item.ID.split('_')[2] || 1;
    },
    itemName() {
      return ['Prototype', 'Revision', 'Final Draft'][this.level - 1];
    },
    selectedRevisionTitles() {
      return this.selectedRevisions
        .map((rev) => {
          const revision = this.revisions.find((r) => r.value === rev);
          return revision ? revision.title : '';
        })
        .join(', ');
    },
  },
  methods: {
    setWeaponType(type) {
      this.weaponType = type;
      this.item.SetOverride('weapon_type', type);
      const rangeData = {
        type: type === 'melee' ? 'threat' : 'range',
        val: type === 'melee' ? 1 : 10,
      };
      this.item.SetOverride('range', [rangeData]);
      this.mech.SaveController.save();
    },
    setDamageType(type) {
      this.damageType = type;
      this.item.SetOverride('damage', type);
      this.mech.SaveController.save();
    },
    setUses() {
      this.item.SetOverride('uses', this.uses);
      this.mech.SaveController.save();
    },
    rollUses() {
      const max = this.level < 3 ? 8 : 12;
      this.uses = Math.floor(Math.random() * max) + 1;
    },
    setRevision(revision) {
      if (this.selectedRevisions.includes(revision)) {
        this.selectedRevisions = this.selectedRevisions.filter((rev) => rev !== revision);
      } else {
        this.selectedRevisions.push(revision);
      }
      const tags = [] as any[];
      if (this.selectedRevisions.includes('tweaked_optics')) {
        tags.push({ id: 'tg_accurate' });
      }
      if (this.selectedRevisions.includes('tweaked_computer')) {
        tags.push({ id: 'tg_smart' });
      }

      this.item.SetOverride('tags', tags);
      this.item.SetOverride(
        'effect',
        this.selectedRevisions.includes('stripped_reactor') ? this.revisions[2].detail : ''
      );
      this.mech.SaveController.save();
    },
  },
};
</script>
