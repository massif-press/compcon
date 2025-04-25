<template>
  <v-row dense class="text-overline pt-2">
    <v-col>
      <div>FEATURES</div>
    </v-col>
    <v-col v-if="passiveCount" cols="auto">
      <cc-switch
        v-model="showPassives"
        color="error"
        on-icon="cc:npc_feature"
        off-icon="mdi-eye-off"
        :tooltip="
          showPassives
            ? `Showing ${passiveCount} passive, build-related, and system modifying features`
            : `Hiding ${passiveCount} passive, build-related, and system modifying features`
        " />
    </v-col>
  </v-row>
  <div v-if="npc.NpcClassController?.HasClass">
    <npc-feature-alerts
      v-if="!readonly"
      :template-controller="npc.NpcTemplateController"
      expanded />

    <masonry-wall
      :items="shownFeatures"
      :column-width="400"
      :gap="14"
      :min-columns="1"
      :max-columns="2">
      <template #default="{ item }">
        <cc-dense-card :item="item" :tier="npc.NpcClassController.Tier">
          <template #pre>
            <npc-mod-inset
              v-for="mod in npc.NpcFeatureController.GetModifiers(item)"
              :key="mod.Id"
              :mod="mod" />
          </template>
        </cc-dense-card>
      </template>
    </masonry-wall>

    <npc-feature-selector v-if="!readonly" :npc="npc" />
  </div>
  <v-card v-else variant="outlined" class="pa-1" style="border-color: rgb(var(--v-theme-panel))">
    <div v-if="!readonly" class="text-center text-disabled text-caption pa-2">
      <i>Select a Class to add Features</i>
    </div>
    <div v-else class="text-center text-disabled text-caption pa-2">
      <i>No NPC features</i>
    </div>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import { NpcFeatureSelector } from './_components';
import NpcFeatureAlerts from './_components/NpcFeatureAlerts.vue';
import NpcModInset from './_components/NpcModInset.vue';
import _ from 'lodash';

export default {
  name: 'npc-builder-content',
  components: {
    NpcFeatureSelector,
    NpcFeatureAlerts,
    NpcModInset,
  },
  props: {
    npc: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    showPassives: {
      get: function () {
        return UserStore().User.View('showNpcPassives', true);
      },
      set: function (newVal) {
        UserStore().User.SetView('showNpcPassives', newVal);
      },
    },
    passiveCount() {
      return this.npc.NpcFeatureController.Passives.length;
    },
    shownFeatures() {
      const arr = this.showPassives
        ? this.npc.NpcFeatureController.Features
        : this.npc.NpcFeatureController.Features.filter((f: any) => !f.Passive);
      return _.orderBy(arr, 'FeatureType', 'desc');
    },
  },
};
</script>
