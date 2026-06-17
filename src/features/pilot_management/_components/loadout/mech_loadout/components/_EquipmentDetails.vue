<template>
  <div v-if="item">
    <div v-if="item.Effect">
      <p v-html-safe="item.Effect"
        class="my-1 px-2" />
    </div>

    <div v-if="item.Actions?.length"
      class="mb-2 mt-1">
      <div class="text-cc-overline text-disabled mb-1">
        <v-icon size="small"
          icon="cc:activate"
          class="mt-n1" />
        {{ $t('ui.card.equipmentActions') }}
      </div>
      <cc-action v-for="(a, index) in item.Actions"
        :key="`action-${index}`"
        :action="a"
        :panel="!mobile"
        class="mb-1" />
    </div>

    <div v-if="item.Deployables?.length"
      class="mb-2">
      <div class="text-cc-overline text-disabled mb-1">
        <v-icon size="small"
          icon="cc:drone"
          class="mt-n1" />
        {{ $t('ui.card.equipmentDeployables') }}
      </div>
      <cc-deployable-info v-for="(d, index) in item.Deployables"
        :key="`deployable-${index}`"
        :deployable="d"
        :panel="!mobile"
        :owner="mech"
        class="mb-1"
        :name-override="item.Name" />
    </div>

    <v-row dense
      align="center">
      <v-col cols="auto">
        <cc-tags v-if="item.Tags"
          :tags="item.Tags"
          :color="color"
          :bonus="mech.LimitedBonus" />
      </v-col>

      <v-col v-for="(p, index) in item.Profiles"
        :key="`profile-${index}`"
        v-show="item.Profiles.length > 1"
        class="mr-4"
        cols="auto">
        <div v-if="p.Tags.length">
          <div class="text-cc-overline"
            v-text="p.Name" />
          <cc-tags v-if="p.Tags"
            :tags="p.Tags"
            :color="color"
            :bonus="mech.LimitedBonus" />
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-tags v-if="item.Mod"
          :tags="item.Mod.AddedTags"
          color="mod"
          :bonus="mech.LimitedBonus" />
      </v-col>

      <v-col cols="auto">
        <cc-bonus :bonuses="item.Bonuses"
          chip />
      </v-col>

      <v-col cols="auto"
        class="ml-auto">
        <cc-bonus :bonuses="externalBonuses" />
      </v-col>
      <v-col cols="auto"
        class="mr-4">

        <cc-synergy-display :item="item"
          :location="synergyLocation"
          :mech="mech"
          large />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { externalItemBonuses } from '@/composables/useExternalItemBonuses'
import { Mech } from '@/classes/mech/Mech';
import type { CompendiumItem } from '@/classes/CompendiumItem';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  mech: {
    type: Mech,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  synergyLocation: {
    type: String,
    required: true,
  },
})

const { smAndDown: mobile } = useDisplay()

const externalBonuses = computed(() =>
  externalItemBonuses(props.mech, props.item as CompendiumItem)
)

</script>
