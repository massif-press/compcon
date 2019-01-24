<template>
  <b-card no-body>
    <b-row>
      <b-col cols=8><span :id="skill.id">{{skill.trigger}}</span></b-col>
      <b-col cols=3><span class="float-right">{{bonus}}</span></b-col>
    </b-row>
    
    <b-popover :target="skill.id"
      placement="righttop"
      triggers="hover focus"
      :content="skill.description" />
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
