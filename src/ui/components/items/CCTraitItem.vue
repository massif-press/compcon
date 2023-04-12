<template>
  <v-card :color="color" variant="outlined">
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <div
            class="heading h3"
            :style="`color: ${color}`"
            v-text="trait.Name"
          />
        </v-col>
        <v-col v-if="trait.Use !== 'Mission'" cols="auto" class="ml-auto">
          <div class="text-subtle overline mt-n2">{{ trait.Use }}</div>
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <div class="body-text text-text" v-html="trait.Description" />
        </v-col>
        <v-col cols="12">
          <cc-action
            v-for="(a, i) in trait.Actions"
            :action="a"
            :panel="$vuetify.display.lgAndUp"
          />
          <cc-deployable-info
            v-for="(d, i) in trait.Deployables"
            :deployable="d"
            :panel="$vuetify.display.lgAndUp"
          />
          <cc-integrated-info
            v-for="(x, i) in trait.Integrated"
            :item="x"
            :panel="$vuetify.display.lgAndUp"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-trait-item',
  props: {
    trait: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>
