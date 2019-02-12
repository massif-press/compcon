<template>
  <b-card no-body>
    <b-form-row>
      <b-col cols=2 align-self="center">&emsp;<span :id="skill.id"><strong>{{skillData.trigger}}</strong></span></b-col>
      <b-col cols align-self="center"><p class="card-text">{{skillData.description}}</p></b-col>
      <b-col cols=1 align-self="center"><h3 v-html="'+' + skill.bonus" /></b-col>
      <b-col cols=1 align-self="center">
        <b-badge v-if="skill.specialty" variant="success" v-b-tooltip title="+1 Accuracy">Speciality</b-badge> 
        <b-badge v-else-if="skill.flaw" variant="danger" v-b-tooltip title="-1 Accuracy">Flaw</b-badge> 
      </b-col>
    </b-form-row>
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
