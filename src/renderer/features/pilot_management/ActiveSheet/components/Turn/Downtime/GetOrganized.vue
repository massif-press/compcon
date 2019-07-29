<template>
  <div>
    <v-card-text>
      <v-layout row wrap class="text-xs-center">
        <v-flex xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You tweak something or attempt to make something new, either a physical project, or a piece of software. It doesn’t have to be something on the a gear list, but it generally can’t be something as impactful as a piece of mech gear. Once finished, you can use it as
            <strong>reserves.</strong>
          </p>
          <v-divider class="ma-2" />
          <v-card>
            <v-tabs v-model="tabs" dark color="primary" slider-color="yellow" grow>
              <v-tab>Start New Project</v-tab>
              <v-tab :disabled="!projects.length">Continue Project</v-tab>
              <v-tab-item>
                <v-card-text>new project</v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>{{projects}}</v-card-text>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        color="primary"
        @click="tabs === 0 ? addSkill() : improveSkill()"
        :disabled="(tabs === 0 && !newSkill) || (tabs === 1 && !improve)"
      >{{tabs === 0 ? 'Add Skill': 'Improve Skill'}}</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve, CustomSkill } from '@/class'
export default Vue.extend({
  name: 'get-focused',
  props: {
    pilot: Object,
  },
  data: () => ({
    tabs: 0,
    newSkill: '',
    improve: '',
  }),
  computed: {
    projects() {
      return this.pilot.Reserves.filter(x => x.Type === 'Project')
    },
  },
  methods: {
    addSkill() {
      this.pilot.AddSkill(new CustomSkill(this.newSkill))
      this.close()
    },
    improveSkill() {
      this.pilot.Skills.find(x => x.Skill.Name === this.improve).Increment()
      this.close()
    },
    close() {
      this.tabs = 0
      this.newSkill = ''
      this.improve = ''
      this.$emit('close')
    },
  },
})
</script>
