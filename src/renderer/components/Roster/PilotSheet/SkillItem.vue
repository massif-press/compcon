<template>
  <v-card>
    <v-layout justify-space-between>
      <v-flex xs3>&emsp;
        <v-tooltip top :disabled="!skill.flaw && !skill.specialty">
          <v-chip slot="activator"
            :dark="!skill.specialty || !skill.flaw" 
            :color="chipColor(skill)" 
            small >
            <v-avatar v-if="skill.specialty && skill.flaw"><v-icon small>trending_flat</v-icon></v-avatar>
            <v-avatar v-else-if="skill.specialty"><v-icon small>star</v-icon></v-avatar>
            <v-avatar v-else-if="skill.flaw"><v-icon small>thumb_down</v-icon></v-avatar>
            +<b>{{skill.bonus}}</b>
          </v-chip>
          <span v-if="skill.specialty && skill.flaw">+0 Accuracy</span>
          <span v-else-if="skill.specialty">+1 Accuracy</span>
          <span v-else-if="skill.flaw">-1 Accuracy</span>
        </v-tooltip>
        <h5 class="center-align">&nbsp;{{skillData.trigger}}</h5>
        </v-flex>
      <v-flex>&emsp;<span class="center-align">{{skillData.description}}</span></v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'skill-item',
  props: [
    'skill',
    'skillData'
  ],
  methods: {
    chipColor: function (skill) {
      if ((skill.specialty && skill.flaw)) return ''
      if (skill.specialty) return 'green'
      else if (skill.flaw) return 'red'
      else return 'blue'
    }
  }
}
</script>

<style scoped>
  .center-align {
    min-height: 55px;
    display: inline-flex;
    align-items: center;
  }
</style>

