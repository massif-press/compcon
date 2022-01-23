<template>
  <div :class="`mt-4 ${$vuetify.breakpoint.mdAndDown ? 'text-center' : ''}`">
    <div v-if="loading" class="text-center">
      <v-progress-circular
        :size="80"
        :width="5"
        color="primary"
        indeterminate
      />
    </div>
    <div v-else>
      <div class="heading h2 accent--text text-center mt-2 mb-1">
        LANCER by:
      </div>
      <v-row justify="center">
        <dev-badge
          v-for="c in credits.writers"
          :key="c.name"
          :info="c"
          :cols="6"
        />
      </v-row>
      <div class="heading h2 accent--text text-center mt-2 mb-1">
        COMP/CON by:
      </div>
      <v-row justify="center">
        <dev-badge
          v-for="c in credits.lead_devs"
          :key="c.name"
          :info="c"
          :cols="12"
        />
      </v-row>
      <div class="heading h2 accent--text text-center mt-2 mb-1">With:</div>
      <v-row dense justify="center">
        <dev-badge
          v-for="c in credits.devs"
          :key="c.name"
          :info="c"
          :cols="6"
        />
      </v-row>
      <div class="heading h2 accent--text text-center mt-2 mb-1">
        Graphic design by:
      </div>
      <v-row dense justify="center">
        <dev-badge
          v-for="c in credits.graphics"
          :key="c.name"
          :info="c"
          :cols="4"
        />
      </v-row>
      <div class="heading h2 accent--text text-center mt-2 mb-1">
        Additional art by:
      </div>
      <v-row dense justify="center">
        <dev-badge v-for="c in credits.art" :key="c.name" :info="c" :cols="4" />
      </v-row>
      <v-divider class="my-3" />
      <div class="text-center mt-6 mb-2">
        <span class="heading h2 text--text">
          The continued development of COMP/CON would not be possible without
          the generous
          <a
            target="_blank"
            href="https://www.patreon.com/compcon"
            v-html="'support'"
          />
          of:
        </span>
      </div>
      <v-row v-for="(t, i) in tiers" :key="`tier_${t}`">
        <v-col cols="12">
          <cc-title small class="mb-n4">{{ t.toUpperCase() }} TIER</cc-title>
        </v-col>
        <v-col
          v-for="p in patrons[t]"
          :key="`tier_${t}_patron_${p.Name}`"
          dense
          :cols="isActive(p) ? cols[i] : 3"
        >
          <v-row align="center">
            <v-col cols="auto">
              <v-img
                :src="`@/assets/img/misc/patreon_tiers/${t}.svg`"
                :max-height="isActive(p) ? '100px' : '50px'"
                :max-width="isActive(p) ? '100px' : '50px'"
                :style="
                  $vuetify.theme.dark
                    ? 'filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);'
                    : 'filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(320deg) brightness(96%) contrast(104%);'
                "
                class="mr-n5"
              />
            </v-col>
            <v-col v-if="isActive(p)">
              <div class="heading h2 accent--text">{{ p.Name }}</div>
              <div class="flavor-text font-weight-bold">
                STATUS//[
                <span class="success--text">ACTIVE</span>
                ]
              </div>
              <div v-if="p['Patronage Since Date']" class="flavor--text">
                Since {{ p['Patronage Since Date'].substring(0, 10) }}
              </div>
            </v-col>
            <v-col v-else>
              <div class="heading h3">{{ p.Name }}</div>
              <div>Former Patron</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <span class="heading h2 text--text mt-4">Special Thanks to:</span>
      <div class="my-2">
        <special-thanks
          v-for="c in credits.special_thanks"
          :key="c"
          :name="c"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import csvConverter from "./csvConverter";
import _ from "lodash";
import credits from "./credits.json";
import DevBadge from "./SupporterBadges/Dev.vue";
import SpecialThanks from "./SupporterBadges/SpecialThanks.vue";

export default Vue.extend({
  name: "credits",
  components: { DevBadge, SpecialThanks },
  data: () => ({
    patronsUrl: "https://compcon-text-assets.s3.amazonaws.com/patrons.csv",
    credits: credits,
    patrons: [],
    tiers: ["MONIST", "NHP", "Lancer", "Cosmopolitan", "Diasporan"],
    cols: [12, 6, 4, 4, 4],
    loading: true,
  }),
  async mounted() {
    await fetch(this.patronsUrl, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.text())
      .then((content) => {
        const patrons = csvConverter.toJson(content);

        this.patrons = _.groupBy(
          _.orderBy(patrons, "Patron Status", "asc"),
          "Tier"
        );
      })
      .catch((err) => {
        console.error(
          "There was an issue downloading the latest welcome message.",
          err
        );
      });

    this.loading = false;
  },
  methods: {
    isActive(p) {
      return p["Patron Status"].toLowerCase() === "active patron";
    },
  },
});
</script>

<style scoped></style>
