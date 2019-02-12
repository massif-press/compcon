<template>
  <b-card no-body>
    <v-layout>
      <v-flex xs2 align-self="center">&emsp;<span :id="skill.id"><strong>{{skillData.trigger}}</strong></span></v-flex>
      <v-flex cols align-self="center"><p class="card-text">{{skillData.description}}</p></v-flex>
      <v-flex xs1 align-self="center"><h3 v-html="'+' + skill.bonus" /></v-flex>
      <v-flex xs1 align-self="center">
        <b-badge v-if="skill.specialty" variant="success" v-b-tooltip title="+1 Accuracy">Speciality</b-badge> 
        <b-badge v-else-if="skill.flaw" variant="danger" v-b-tooltip title="-1 Accuracy">Flaw</b-badge> 
      </v-flex>
    </v-layout>
  </b-card>
</template>

<script>
export default {
  name: 'skill-item',
  props: [
    'skill',
    'skillData'
  ]
}
</script>
