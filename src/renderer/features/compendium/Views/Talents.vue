<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs2>
        <div class="sidebar">
          <ul
            class="menu"
            v-scroll-spy-active="{ class: 'customActive' }"
            v-scroll-spy-link
          >
            <li
              v-for="t in talents"
              :key="'key_' + t.id"
              class="minor-title pt-1 pb-1"
            >
              <a>{{ t.Name }}</a>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex shrink>
        <v-divider class="ml-0 mr-5" vertical />
      </v-flex>
      <v-flex xs9>
        <span class="display-1 text-uppercase font-weight-thin">
          PILOT TALENTS
        </span>
        <div v-scroll-spy="{ offset: 60, time: 0 }" class="mt-3">
          <div v-for="t in talents" :key="`${t.id}_data'`">
            <v-toolbar-title class="mt-2" dense>
              <span class="minor-title">{{ t.Name }}</span>
            </v-toolbar-title>
            <v-card flat class="mt-1 pt-0">
              <v-card-title class="mt-1 pt-0">
                <p class="fluff-text mb-0 pb-0 pt-0" v-html="t.Description" />
              </v-card-title>
            </v-card>
            <v-card flat>
              <v-card-title
                v-for="(r, index) in t.Ranks"
                :key="r.name + index"
                primary-title
                class="pb-0 pt-0 mb-0"
              >
                <div style="width:100%">
                  <div class="title">
                    <v-icon class="mt-2" color="primary">
                      cc-rank-{{ index + 1 }}
                    </v-icon>
                    {{ r.name }}
                  </div>
                  <p class="pl-4 effect-text" v-html="r.description" />
                </div>
              </v-card-title>
            </v-card>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <br />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talents',
  data: () => ({
    talents: [],
    section: 0,
  }),
  created() {
    var vm = this as any
    vm.talents = vm.$store.getters['getItemCollection']('Talents')
  },
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 60px;
  left: 15px;
  width: 16.6vw;
  height: 90vh;
  overflow-y: scroll;
}

.customActive {
  color: #0091ea;
  border-left: 5px solid #178ce6;
  padding-left: 5px;
  transition: all 0.5s;
}

.menu {
  display: contents;
}

.menu a {
  color: #424242;
}
</style>
