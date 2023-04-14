<template>
  <cc-sidebar-view>
    <template v-slot:sidebar>
      <v-list-item
        v-for="t in talents"
        slot="sidebar"
        link
        :title="t.Name"
        @click="scrollTo(t)"
      />
    </template>
    <v-row density="compact" align="center">
      <v-col cols="auto">
        <div class="heading h1 mt-3 mb-2">PILOT TALENTS</div>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="ctype" mandatory>
          <v-btn value="full"><v-icon icon="mdi-view-stream" /></v-btn>
          <v-btn value="terse"><v-icon icon="mdi-view-list" /></v-btn>
          <v-btn value="small"><v-icon icon="mdi-view-comfy" /></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row justify="center" class="pb-3">
      <cc-talent
        v-for="t in talents"
        :id="`e_${t.ID}`"
        :talent="t"
        :terse="ctype === 'terse'"
        :small="ctype === 'small'"
      />
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Talent } from '@/class';

export default {
  name: 'Talents',
  data: () => ({
    ctype: 'full',
  }),
  computed: {
    talents(): Talent[] {
      return CompendiumStore().Talents.filter((x) => !x.IsHidden);
    },
  },
  methods: {
    scrollTo(t: Talent): void {
      const el = document.getElementById(`e_${t.ID}`);
      console.log(el);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>
