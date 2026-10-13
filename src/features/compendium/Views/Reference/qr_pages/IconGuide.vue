<template>
  <v-container class="pb-12">
    <h1 class="heading">{{ $t('compendium.reference.iconGuide') }}</h1>

    <div
      v-for="category in content"
      :key="category.id"
      class="mt-2 mb-6"
    >
      <h2
        :id="category.id"
        class="heading h3 text-accent"
      >
        {{ category.title }}
      </h2>
      <v-divider class="mt-1 mb-4" />
      <v-row dense>
        <v-col
          v-for="(item, i) in category.items"
          :key="i"
          cols="12"
          sm="6"
          xl="4"
        >
          <div class="d-flex align-center">
            <v-avatar
              size="55"
              color="background"
            >
              <div
                v-if="item.Svg"
                v-html-safe="cleanSvg(item.Svg)"
                class="d-inline-block"
                :style="{
                  width: '40px',
                  height: '40px',
                  filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
                }"
              />
              <v-icon
                v-else
                size="40"
                :icon="item.icon"
                :color="item.color || ''"
              />
            </v-avatar>
            <div class="ml-4">
              <div class="heading">{{ item.name }}</div>
              <div
                v-if="item.text"
                v-html-safe="item.text"
                class="text-disabled text-caption"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>

  <v-footer
    v-if="!isModal"
    border
    app
    class="py-0 bg-primary"
  >
    <v-tabs
      density="compact"
      center-active
      grow
    >
      <v-tab
        v-for="category in content"
        :key="'footer_' + category.id"
        @click="scrollTo(category.id)"
        v-text="category.title"
      />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0].id)"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Status } from '@/classes/Status'
  import { CompendiumStore } from '@/stores'
  import _scrollTo from '@/util/scrollTo'
  import DOMPurify from 'dompurify'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const props = defineProps<{
    isModal?: boolean
  }>()
  function cleanSvg(svg: string) {
    return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } })
  }
  const content = computed((): any[] => [
    {
      id: 'iconguide_damage_types',
      title: t('compendium.iconGuide.damageTypes'),
      items: [
        {
          name: t('compendium.iconGuide.kineticDamage'),
          icon: 'cc:kinetic',
          color: 'damage--kinetic',
        },
        {
          name: t('compendium.iconGuide.energyDamage'),
          icon: 'cc:energy',
          color: 'damage--energy',
        },
        {
          name: t('compendium.iconGuide.explosiveDamage'),
          icon: 'cc:explosive',
          color: 'damage--explosive',
        },
        {
          name: t('enums.damageType.heat'),
          icon: 'cc:heat',
          color: 'damage--heat',
        },
        {
          name: t('enums.damageType.burn'),
          icon: 'cc:burn',
          color: 'damage--burn',
        },
        {
          name: t('compendium.iconGuide.variableOrOther'),
          icon: 'cc:variable',
          color: 'damage--variable',
          text: t('compendium.iconGuide.variableDamageTypeHint'),
        },
      ],
    },
    {
      id: 'iconguide_range_attack_types',
      title: t('compendium.iconGuide.rangeAttackTypes'),
      items: [
        {
          name: t('compendium.iconGuide.meleeAttack'),
          icon: 'cc:melee',
        },
        {
          name: t('compendium.iconGuide.rangedAttack'),
          icon: 'cc:range',
        },
        {
          name: t('enums.rangeType.thrown'),
          icon: 'cc:thrown',
        },
        {
          name: t('enums.rangeType.threat'),
          icon: 'cc:threat',
          text: t('compendium.iconGuide.weaponThreatRange'),
        },
        {
          name: t('enums.rangeType.burst'),
          icon: 'cc:burst',
          text: t('compendium.iconGuide.burstAreaOfEffect'),
        },
        {
          name: t('enums.rangeType.blast'),
          icon: 'cc:blast',
          text: t('compendium.iconGuide.blastAreaOfEffect'),
        },
        {
          name: t('enums.rangeType.line'),
          icon: 'cc:line',
          text: t('compendium.iconGuide.lineAreaOfEffect'),
        },
        {
          name: t('enums.rangeType.cone'),
          icon: 'cc:cone',
          text: t('compendium.iconGuide.coneAreaOfEffect'),
        },
      ],
    },
    {
      id: 'iconguide_tracked_stats',
      title: t('compendium.iconGuide.trackedStats'),
      items: [
        {
          name: t('stats.hp'),
          icon: 'mdi-heart',
          color: 'hp',
          text: t('active.stats.hitPoints'),
        },
        {
          name: t('stats.armor'),
          icon: 'mdi-shield',
          color: 'armor',
        },
        {
          name: t('stats.structure'),
          icon: 'cc:structure',
          color: 'structure',
        },
        {
          name: t('common.overshield'),
          icon: 'mdi-hexagon-multiple-outline',
          color: 'overshield',
        },
        {
          name: t('enums.damageType.heat'),
          icon: 'cc:heat',
          color: 'damage--heat',
        },
        {
          name: t('compendium.iconGuide.reactorStress'),
          icon: 'cc:reactor',
          color: 'stress',
        },
        {
          name: t('common.repairCapacity'),
          icon: 'cc:repair',
          color: 'system',
        },
        {
          name: t('stats.speed'),
          icon: 'mdi-arrow-right-bold-hexagon-outline',
          color: 'action--move',
        },
      ],
    },
    {
      id: 'iconguide_stats',
      title: t('common.statsLabel'),
      items: [
        {
          name: t('stats.evasion'),
          icon: 'cc:evasion',
        },
        {
          name: t('stats.techAttack'),
          icon: 'cc:quick_tech',
        },
        {
          name: t('stats.edefense'),
          icon: 'cc:edef',
        },
        {
          name: t('common.sensorRange'),
          icon: 'cc:sensor',
        },
        {
          name: t('compendium.iconGuide.saveRoll'),
          icon: 'cc:save',
        },
        {
          name: t('compendium.iconGuide.systemPoint'),
          icon: 'cc:system_point',
        },
      ],
    },
    {
      id: 'iconguide_actions',
      title: t('common.actions'),
      items: [
        {
          name: t('enums.activationType.protocol'),
          icon: 'cc:protocol',
          color: 'action--protocol',
        },
        {
          name: t('compendium.reference.fullAction'),
          icon: 'mdi-hexagon-slice-6',
          color: 'action--full',
        },
        {
          name: t('enums.activationType.full_tech'),
          icon: 'cc:full_tech',
          color: 'action--full',
        },
        {
          name: t('compendium.iconGuide.quickAction'),
          icon: 'mdi-hexagon-slice-3',
          color: 'action--quick',
        },
        {
          name: t('enums.activationType.quick_tech'),
          icon: 'cc:quick_tech',
          color: 'action--quick',
        },
        {
          name: t('enums.activationType.overcharge'),
          icon: 'cc:overcharge',
          color: 'action--overcharge',
        },
        {
          name: t('enums.activationType.move'),
          icon: 'mdi-arrow-right-bold-hexagon-outline',
          color: 'action--move',
        },
        {
          name: t('enums.activationType.reaction'),
          icon: 'cc:reaction',
          color: 'action--reaction',
        },
        {
          name: t('compendium.iconGuide.freeAction'),
          icon: 'cc:free_action',
          color: 'action--free',
        },
      ],
    },
    {
      id: 'iconguide_item_types',
      title: t('compendium.iconGuide.itemTypes'),
      items: [
        {
          name: t('common.weapon'),
          icon: 'cc:weapon',
        },
        {
          name: t('enums.systemType.system'),
          icon: 'cc:system',
        },
        {
          name: t('compendium.iconGuide.weaponMod'),
          icon: 'cc:weaponmod',
        },
        {
          name: t('compendium.iconGuide.trait'),
          icon: 'cc:trait',
        },
        {
          name: t('compendium.iconGuide.coreBonus'),
          icon: 'cc:corebonus',
        },
        {
          name: t('compendium.iconGuide.talent'),
          icon: 'cc:talent',
        },
        {
          name: t('compendium.iconGuide.skillTrigger'),
          icon: 'cc:skill',
        },
        {
          name: t('compendium.iconGuide.reserveTactical'),
          icon: 'cc:reserve_tactical',
        },
        {
          name: t('compendium.iconGuide.reserveMech'),
          icon: 'cc:reserve_mech',
        },
        {
          name: t('compendium.iconGuide.reserveResource'),
          icon: 'cc:reserve_resource',
        },
        {
          name: t('common.pilot'),
          icon: 'cc:pilot',
        },
        {
          name: t('common.mech'),
          icon: 'cc:frame',
        },
        {
          name: t('compendium.iconGuide.vehicle'),
          icon: 'cc:vehicle',
        },
        {
          name: t('compendium.iconGuide.ship'),
          icon: 'cc:ship',
        },
        {
          name: t('compendium.iconGuide.biological'),
          icon: 'mdi-heart-multiple-outline',
        },
        {
          name: t('compendium.iconGuide.squad'),
          icon: 'cc:squad',
        },
        {
          name: t('enums.systemType.deployable'),
          icon: 'cc:drone',
        },
        {
          name: t('enums.systemType.mine'),
          icon: 'cc:mine',
        },
      ],
    },
    {
      id: 'iconguide_npc_classes',
      title: t('compendium.categories.npcClasses'),
      items: [
        {
          name: t('enums.mechType.artillery'),
          icon: 'cc:role_artillery',
        },
        {
          name: t('compendium.iconGuide.biological'),
          icon: 'mdi-heart-outline',
        },
        {
          name: t('enums.mechType.controller'),
          icon: 'cc:role_controller',
        },
        {
          name: t('enums.mechType.defender'),
          icon: 'cc:role_defender',
        },
        {
          name: t('enums.mechType.striker'),
          icon: 'cc:role_striker',
        },
        {
          name: t('enums.mechType.support'),
          icon: 'cc:role_support',
        },
      ],
    },
    {
      id: 'iconguide_statuses',
      title: t('compendium.categories.statusesConditions'),
      items: CompendiumStore().Statuses.map((s: Status) => ({
        name: s.Name,
        Svg: s.Svg,
        icon: s.Icon,
        text: s.Terse,
      })),
    },
    {
      id: 'iconguide_other',
      title: t('compendium.iconGuide.other'),
      items: [
        {
          name: t('common.accuracy'),
          icon: 'cc:accuracy',
        },
        {
          name: t('common.difficulty'),
          icon: 'cc:difficulty',
        },
        {
          name: t('common.contentPack'),
          icon: 'cc:compendium',
          text: t('compendium.iconGuide.lcpContentHint'),
        },
      ],
    },
  ])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) _scrollTo(el, props.isModal)
  }
</script>
