<template>
  <b-card no-body>
    <b-form-row>
      <b-col cols=3 align-self="center">&emsp;<span :id="skill.id"><strong>{{skill.trigger}}</strong></span></b-col>
      <b-col cols align-self="center"><p class="card-text">{{skill.description}}</p></b-col>
      <b-col cols=1 align-self="center"><h3>+{{bonus}}</h3></b-col>
    </b-form-row>
  </b-card>
</template>

<script>
export default {
  name: 'skill-item',
  props: [
    'skill',
    'bonus'
  ]
}
</script>
