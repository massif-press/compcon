<script setup lang="ts">
import { reactive } from 'vue';
import EquipmentCardBase from './_EquipmentCardBase.vue';
import ProfileOnElement from './_components/ProfileOnElement.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  notes: { type: Boolean },
});

const state = reactive({
  item: props.item,
});
</script>

<template>
  <equipment-card-base :item="item" :notes="notes">
    <v-col v-show="item.Profiles.length > 1" cols="12" class="my-n3">
      <div class="text-overline">WEAPON PROFILES</div>
      <v-tabs v-model="state.item.ProfileIndex" grow height="30px">
        <v-tab v-for="p in item.Profiles">
          <b class="text-accent">{{ p.Name }}</b>
        </v-tab>
      </v-tabs>
    </v-col>

    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider
      v-if="item.Range.length && item.Damage.length"
      vertical
      class="mx-4 my-2"
    />
    <v-col cols="auto">
      <cc-damage-element
        :damage="item.Damage"
        :type-override="item.DamageTypeOverride"
      />
    </v-col>

    <v-divider v-if="item.SP" vertical class="mx-4" />
    <v-col v-if="item.SP" cols="auto" class="text-center">
      <div class="panel clipped">
        <v-icon v-for="n in item.SP" x-large>cc:system_point</v-icon>
      </div>
      <span class="overline">
        <b>{{ item.SP }}</b>
        SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}
      </span>
    </v-col>

    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.Size }} {{ item.WeaponType }}</div>
      <span v-if="item.Source" class="flavor-text text-subtle"
        >// {{ item.LicenseString }}</span
      >
      <div v-if="item.InLcp" class="flavor-text text-subtle">
        {{ item.LcpName }}
      </div>
    </v-col>

    <v-col cols="12">
      <profile-on-element
        v-for="action in ['hit', 'crit', 'attack']"
        :item="item"
        :action="action"
      />
      <div v-if="item.ProfileEffect" class="panel clipped pa-2">
        <v-icon icon="cc:weapon" />
        <span class="overline">
          <span class="text-stark">EQUIPMENT EFFECT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p
          v-html-safe="item.ProfileEffect"
          class="text-text body-text mb-1 mx-3"
        />
      </div>
    </v-col>

    <div slot="profile">
      <div v-if="item.ProfileActions.length">
        <div class="text-overline ml-n2 text-subtle">PROFILE ACTIONS</div>
        <v-row no-gutters justify="center">
          <v-col v-for="a in item.ProfileActions" cols="auto">
            <cc-action
              :action="a"
              :panel="$vuetify.display.lgAndUp"
              class="ma-2"
            />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.ProfileDeployables.length">
        <div class="text-overline ml-n2 text-subtle">PROFILE DEPLOYABLES</div>
        <v-row no-gutters justify="center">
          <v-col v-for="(d, i) in item.ProfileDeployables" cols="auto">
            <cc-deployable-info
              :deployable="d"
              :panel="$vuetify.display.lgAndUp"
              :name-override="item.Name"
              class="ma-2"
            />
          </v-col>
        </v-row>
      </div>
      <div
        v-if="
          item.Profiles.length > 1 &&
          item.ProfileTags &&
          item.ProfileTags.length
        "
      >
        <div class="text-overline ml-n2 mb-n1 text-subtle">PROFILE TAGS</div>
        <cc-tags :tags="item.ProfileTags" extended />
      </div>
    </div>
  </equipment-card-base>
</template>
