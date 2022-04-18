<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="auto">
        <v-card outlined width="1200px" height="200px" class="my-1">
          <v-row justify="center" align="center" style="height: 100%">
            <v-col cols="auto" class="text-center">
              <div class="flavor-text text--disabled"><i>No Campaign Image</i></div>
              <div class="overline text--disabled">1200 x 200</div>
            </v-col>
          </v-row>
        </v-card>
        <v-btn x-small block class="fadeSelect" outlined color="accent">
          Change Campaign Image
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" dense>
      <v-col cols="auto">
        <cc-short-string-editor large @set="item.Name = $event">
          <span class="display-2 accent--text">
            {{ item.Name }}
          </span>
        </cc-short-string-editor>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="5">
        <v-text-field v-model="item.Author" outlined hide-details dense label="Author(s)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          v-model="item.Description"
          outlined
          auto-grow
          rows="3"
          label="Campaign Description"
          hide-details
          class="my-3"
        />
        <v-textarea
          v-model="item.Contributors"
          outlined
          auto-grow
          rows="3"
          label="Contributors"
          hide-details
          class="my-3"
        />
        <v-textarea
          v-model="item.License"
          outlined
          auto-grow
          rows="3"
          label="License and/or Distribution Information"
          hide-details
          class="my-3"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'campaign-overview-page',
  props: {
    item: { type: Object, required: true },
  },
})
</script>

<style scoped>
.row {
  margin: 0px !important;
}
</style>
