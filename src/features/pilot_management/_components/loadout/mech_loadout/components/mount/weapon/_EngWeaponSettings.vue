<template>
  <cc-panel :title="`CONFIGURATION // ${itemName}`"
    icon="cc:weapon">
    <v-row dense
      justify="space-around">
      <v-col cols="auto"
        style="min-width: 55px;">
        <div class="text-cc-overline text-disabled">{{ $t('pm.loadout.weaponTYPE') }}</div>
        <v-menu>
          <template #activator="{ props }">
            <cc-button block
              size="x-small"
              :prepend-icon="weaponType ? item.Range[0].Icon : 'mdi-help'"
              :color="weaponType ? 'primary' : 'panel'"
              @click="props.onClick($event)">
              {{ weaponType || $t('pm.loadout.notSET') }}
            </cc-button>
          </template>
          <v-list density="compact"
            slim
            flat
            tile
            border>
            <v-list-item v-for="(type, index) in weaponTypes"
              :key="index"
              @click="setWeaponType(type.value)">
              <v-list-item-title>
                <v-icon start
                  size="small">{{ type.icon }}</v-icon>
                {{ type.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">{{ $t('pm.loadout.damageTYPE') }}</div>
        <v-menu>
          <template #activator="{ props }">
            <cc-button block
              size="x-small"
              :prepend-icon="damageType ? `cc:${damageType}` : 'mdi-help'"
              :color="damageType ? `damage--${damageType}` : 'panel'"
              @click="props.onClick($event)">
              {{ damageType || $t('pm.loadout.notSET') }}
            </cc-button>
          </template>
          <v-list density="compact"
            slim
            flat
            tile
            border>
            <v-list-item v-for="(type, index) in damageTypes"
              :key="index"
              @click="setDamageType(type.value)">
              <v-list-item-title>
                <v-icon start
                  size="small">cc:{{ type.value }}</v-icon>
                {{ type.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col style="min-width: 55px;">
        <div class="text-cc-overline text-disabled">{{ $t('pm.print.uses') }}</div>
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <cc-button block
              size="x-small"
              :prepend-icon="uses ? 'mdi-dice-d20-outline' : 'mdi-help'"
              :color="uses ? 'primary' : 'panel'"
              @click="props.onClick($event)">
              {{ uses ? uses : $t('pm.loadout.notSET') }}
            </cc-button>
          </template>
          <v-card flat
            tile
            border>
            <v-card-text class="pt-1">
              <div class="text-cc-overline text-disabled mb-2">
                {{ $t('pm.loadout.setUSES') }}
                <cc-slashes />
                {{ level < 3
                  ?
                  `1d6+${2
                  +
                  limitedBonus}`
                  :
                  limitedBonus > 0 ? `2d6+${limitedBonus}` : `2d6`
                }}
              </div>

              <v-row dense
                align="center"
                justify="space-between">
                <v-col cols="auto">
                  <v-btn size="x-small"
                    icon
                    variant="text"
                    @click="rollUses">
                    <v-icon size="x-large">mdi-dice-multiple-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <cc-number-field v-model="uses"
                    :min="0"
                    :max="(level < 3 ? 8 : 12) + limitedBonus"
                    size="x-small" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
      <v-col v-if="level > 1"
        cols="12"
        lg="6">
        <div class="text-cc-overline text-disabled">{{ $t('pm.loadout.revisions') }}</div>
        <v-menu :close-on-content-click="false"
          :max-width="300">
          <template #activator="{ props }">
            <cc-button block
              size="x-small"
              :prepend-icon="selectedRevisions[0] ? `cc:talent` : 'mdi-help'"
              :color="selectedRevisions[0] ? `primary` : 'panel'"
              @click="props.onClick($event)">
              <span v-if="!selectedRevisions.length">{{ $t('pm.loadout.notSET') }}</span>
              <span v-else>
                {{ selectedRevisionTitles }}
              </span>
            </cc-button>
          </template>
          <v-list v-model="selectedRevisions"
            multiple
            density="compact"
            slim
            flat
            tile
            border>
            <v-list-item v-for="(rev, idx) in revisions"
              :key="`rev-${idx}`"
              :active="selectedRevisions.includes(rev.value)"
              active-class="bg-primary"
              :disabled="!selectedRevisions.includes(rev.value) && selectedRevisions.length >= 2"
              @click="setRevision(rev.value)">
              <v-list-item-title>
                <v-icon start
                  size="small"
                  icon="cc:talent" />
                {{ rev.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </cc-panel>
  <cc-alert v-if="selectedRevisions.includes('stripped_reactor')"
    :title="`Stripped Reactor Shielding`"
    icon="cc:talent"
    color="weapon"
    class="mt-2">
    <div v-html-safe="revisions[2].detail"
      class="text-cc-overline text-disabled" />
  </cc-alert>
  <cc-tags v-if="item.CustomTags"
    :tags="item.CustomTags"
    color="exotic"
    extended />
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'EngineerWeaponInset' })

const props = defineProps<{
  item: object
  mech: Mech
  readonly?: boolean
}>()

const weaponType = ref(null)
const weaponTypes = ref([
      { title: 'Rifle', value: 'rifle', icon: 'cc:range' },
      { title: 'Cannon', value: 'cannon', icon: 'cc:range' },
      { title: 'Launcher', value: 'launcher', icon: 'cc:range' },
      { title: 'CQB', value: 'cqb', icon: 'cc:range' },
      { title: 'Nexus', value: 'nexus', icon: 'cc:range' },
      { title: 'Melee', value: 'melee', icon: 'cc:threat' },
    ])
const damageType = ref(null)
const damageTypes = ref([
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
    ])
const uses = ref(0)
const revisions = ref([
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
    ])
const selectedRevisions = ref([] as string[])

weaponType.value = props.item.GetOverride('weapon_type') || null;
    damageType.value = props.item.GetOverride('damage') || null;
    uses.value = props.item.GetOverride('uses') || 0;
    if (props.item.GetOverride('tags').some((t) => t.id === 'tg_accurate')) {
      selectedRevisions.value.push('tweaked_optics');
    }
    if (props.item.GetOverride('tags').some((t) => t.id === 'tg_smart')) {
      selectedRevisions.value.push('tweaked_computer');
    }
    if (props.item.GetOverride('effect')) {
      selectedRevisions.value.push('stripped_reactor');
    }

weaponType.value = props.item.GetOverride('weapon_type') || null;
    damageType.value = props.item.GetOverride('damage') || null;
    uses.value = props.item.GetOverride('uses') || 0;
    if (props.item.GetOverride('tags').some((t) => t.id === 'tg_accurate')) {
      selectedRevisions.value.push('tweaked_optics');
    }
    if (props.item.GetOverride('tags').some((t) => t.id === 'tg_smart')) {
      selectedRevisions.value.push('tweaked_computer');
    }
    if (props.item.GetOverride('effect')) {
      selectedRevisions.value.push('stripped_reactor');
    }

const level = computed(() => {
      return props.item.ID.split('_')[2] || 1;
    })
const itemName = computed(() => {
      return ['Prototype', 'Revision', 'Final Draft'][level.value - 1];
    })
const limitedBonus = computed(() => {
      return props.mech.LimitedBonus || 0
    })
const selectedRevisionTitles = computed(() => {
      return selectedRevisions.value
        .map((rev) => {
          const revision = revisions.value.find((r) => r.value === rev);
          return revision ? revision.title : '';
        })
        .join(', ');
    })

function setWeaponType(type) {
      weaponType.value = type;
      props.item.SetOverride('weapon_type', type);
      const rangeData = {
        type: type === 'melee' ? 'threat' : 'range',
        val: type === 'melee' ? 1 : 10,
      };
      props.item.SetOverride('range', [rangeData]);
      props.mech.SaveController.save();
    }
function setDamageType(type) {
      damageType.value = type;
      props.item.SetOverride('damage', type);
      props.mech.SaveController.save();
    }
function setUses() {
      props.item.SetOverride('uses', uses.value);
      props.mech.SaveController.save();
    }
function rollUses() {
      const max = (level.value < 3 ? 8 : 12) + limitedBonus.value;
      uses.value = Math.floor(Math.random() * max) + 1;
    }
function setRevision(revision) {
      if (selectedRevisions.value.includes(revision)) {
        selectedRevisions.value = selectedRevisions.value.filter((rev) => rev !== revision);
      } else {
        selectedRevisions.value.push(revision);
      }
      const tags = [] as any[];
      if (selectedRevisions.value.includes('tweaked_optics')) {
        tags.push({ id: 'tg_accurate' });
      }
      if (selectedRevisions.value.includes('tweaked_computer')) {
        tags.push({ id: 'tg_smart' });
      }

      props.item.SetOverride('tags', tags);
      props.item.SetOverride(
        'effect',
        selectedRevisions.value.includes('stripped_reactor') ? revisions.value[2].detail : ''
      );
      props.mech.SaveController.save();
    }
</script>
