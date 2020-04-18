<template>
  <div>
    <v-toolbar id="toolbar" :color="color" dark flat dense class="sliced" max-height="30px">
      <v-toolbar-title style="max-height: 30px" class="mt-n3">
        <v-menu offset-y top>
          <template v-slot:activator="{ on }">
            <v-icon left class="fadeSelect mt-n2" v-on="on">mdi-menu</v-icon>
          </template>
          <v-list class="px-2 py-3">
            <v-list-item-subtitle class="overline">Available Loadouts</v-list-item-subtitle>
            <v-list-item
              v-for="(l, i) in loadouts"
              :key="`pl_${i}`"
              @click="$emit('set-active', l)"
            >
              <v-list-item-title class="stat-text">{{ l.Name }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!readonly" @click="$emit('add-loadout')">
              <v-list-item-title class="accent--text font-weight-bold">
                <v-icon color="primary" left>add</v-icon>
                Add New Loadout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <span class="l-title">
          <cc-short-string-editor v-if="!readonly" inline @set="activeLoadout.Name = $event">
            {{ activeLoadout.Name }}
          </cc-short-string-editor>
          <span v-else>{{ activeLoadout.Name }}</span>
        </span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items v-if="!readonly" class="mr-6 mt-n4">
        <v-btn small icon class="fadeSelect" @click="$emit('clone-loadout')">
          <v-icon>mdi-content-duplicate</v-icon>
        </v-btn>
        <v-menu v-model="confirmMenu" offset-y top>
          <template v-slot:activator="{ on }">
            <v-btn small icon class="fadeSelect" :disabled="loadouts.length === 1" v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <cc-confirmation
            :content="
              `Lancer, please confirm deletion of:
          <span class='accent--text'>
            ${activeLoadout.Name}
          </span> Loadout`
            "
            @confirm="removeConfirm"
          />
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-card flat outlined tile :color="color">
      <v-card-text class="px-2 py-0 background">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-loadout-panel',
  props: {
    loadouts: {
      type: Array,
      required: true,
    },
    activeLoadout: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    confirmMenu: false,
  }),
  methods: {
    removeConfirm() {
      this.confirmMenu = false
      this.$emit('remove-loadout')
    },
  },
})
</script>

<style scoped>
.l-title {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 18pt;
  line-height: 14pt;
  color: white;
  text-transform: uppercase;
}
</style>
