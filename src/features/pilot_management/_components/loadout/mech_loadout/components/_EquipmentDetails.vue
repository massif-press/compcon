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
        EQUIPMENT ACTIONS
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
        EQUIPMENT DEPLOYABLES
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
        <cc-bonus v-for="(b, index) in item.Bonuses"
          :key="`bonus-${index}`"
          :bonus="b"
          chip />
      </v-col>

      <v-col cols="auto"
        class="ml-auto">
        <cc-bonus v-for="(b, index) in externalItemBonuses"
          :key="`ext-bonus-${index}`"
          :bonus="b" />
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
import { useMobile } from '@/composables/useMobile'
import { externalItemBonuses } from '@/composables/useExternalItemBonuses'

const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
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

const { mobile, portrait } = useMobile()

</script>
