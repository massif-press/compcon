<template>
  <div style="width: 100%">
    <v-card flat tile>
      <v-card-text class="px-2 py-0 background">
        <div>
          <v-row density="compact">
            <active-mount-block
              v-for="(m, j) in mech.ActiveMounts"
              :mount="m"
              :mech="mech"
              :color="color"
              :rest="rest"
            />
          </v-row>
          <v-divider class="my-2" />
          <active-systems-block :mech="mech" :color="color" :rest="rest" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import ActiveMountBlock from './_ActiveMountBlock.vue';
import ActiveSystemsBlock from './_ActiveSystemsBlock.vue';

export default {
  name: 'active-mech-loadout-block',
  components: { ActiveSystemsBlock, ActiveMountBlock },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    rest: {
      type: Boolean,
    },
  },
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.GetColor(
        this.$vuetify.theme.current.dark
      );
    },
  },
};
</script>
