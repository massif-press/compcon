<template>
  <v-container>
    <div class="heading h2 mb-1">LANCER by:</div>
    <v-row>
      <dev-badge v-for="c in credits.writers" :info="c" :cols="3" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">COMP/CON by:</div>
    <v-row>
      <dev-badge v-for="c in credits.lead_devs" :info="c" :cols="3" />
    </v-row>
    <div class="heading h3 mt-4 mb-1">With:</div>
    <v-row dense>
      <dev-badge v-for="c in credits.devs" :info="c" :cols="3" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">Graphic design by:</div>
    <v-row dense>
      <dev-badge v-for="c in credits.graphics" :info="c" :cols="3" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">Additional art by:</div>
    <v-row dense>
      <dev-badge v-for="c in credits.art" :info="c" :cols="3" />
    </v-row>
    <div class="text-center mt-8">
      <span class="heading h2">
        The continued development of COMP/CON would not be possible without the generous
        <a target="_blank" href="https://www.patreon.com/compcon" v-html="'support'" />
        of:
      </span>
    </div>

    <div v-if="loading" class="text-center">
      <v-progress-circular :size="80" :width="5" color="primary" indeterminate />
    </div>
    <div v-else>
      <div v-for="t in tiers" v-show="active[t]" class="mb-6">
        <cc-title small class="my-2">{{ t.toUpperCase() }} TIER</cc-title>
        <v-row align="center">
          <v-col v-for="p in active[t]" cols="auto" class="ma-1">
            <v-row no-gutters>
              <v-col cols="auto">
                <v-icon :icon="`cc:${t.toLowerCase()}`" size="40px" color="accent" class="mt-n1" />
              </v-col>
              <v-col cols="auto">
                <div class="heading h3">{{ cleanName(p.attributes.full_name) }}</div>
                <div class="text-caption mt-n2 pl-1 text-disabled">
                  since
                  <b>{{ new Date(p.attributes.pledge_relationship_start).toLocaleDateString() }}</b>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <div class="mt-6">
        <span class="heading h2"> Along with: </span>
      </div>

      <p class="flavor-text text-text">
        {{ lapsed.map((x) => cleanName(x.attributes.full_name)).join(', ') }}
      </p>

      <div class="heading h2 mt-4">Special Thanks to:</div>
      <div class="my-2">
        <v-chip
          v-for="c in credits.special_thanks"
          variant="tonal"
          size="large"
          label
          class="ma-1"
          >{{ c }}</v-chip
        >
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import credits from './credits.json';
import DevBadge from './SupporterBadges/Dev.vue';
import { patrons } from './credits_api';

export default {
  name: 'credits',
  components: { DevBadge },
  data: () => ({
    patronsUrl: 'https://compcon-text-assets.s3.amazonaws.com/patrons.csv',
    credits: credits,
    // patrons: [],
    active: {},
    lapsed: [] as any[],
    tiers: ['MONIST', 'NHP', 'Lancer', 'Cosmopolitan', 'Diasporan'],
    cols: [12, 6, 4, 4, 4],
    loading: true,
  }),
  async mounted() {
    const p = await patrons();

    const all = p.data.flat(1);

    const current = all.filter((x) => x.attributes.patron_status === 'active_patron');
    this.lapsed = _.orderBy(
      all.filter(
        (x) =>
          x.attributes.patron_status === 'former_patron' ||
          x.attributes.patron_status === 'declined_patron'
      ),
      [(x) => x.attributes.lifetime_support_cents, (x) => x.attributes.pledge_relationship_start],
      ['desc', 'desc']
    );

    this.active = _.groupBy(current, (x) => x.relationships.currently_entitled_tiers.data[0].id);

    const TierIdMap = {
      '4485311': 'NHP',
      '4485280': 'Lancer',
      '4485260': 'Cosmopolitan',
      '4485242': 'Diasporan',
      '4485271': 'MONIST',
    };

    for (const key in this.active) {
      delete Object.assign(this.active, { [TierIdMap[key]]: this.active[key] })[key];
    }

    for (const key in this.active) {
      this.active[key] = _.orderBy(
        this.active[key],
        [(x) => x.attributes.lifetime_support_cents, (x) => x.attributes.pledge_relationship_start],
        ['desc', 'desc']
      );
    }

    console.log(this.active);

    this.loading = false;
  },
  methods: {
    cleanName(name: string) {
      const str = name.trim();
      if (str.includes(' ')) {
        const arr = str.split(' ');
        return arr
          .map((x, i) => {
            if (i === arr.length - 1) {
              return x.substring(0, 1) + '.';
            } else {
              return x;
            }
          })
          .join(' ');
      } else {
        return str;
      }
    },
  },
};
</script>

<style scoped></style>
