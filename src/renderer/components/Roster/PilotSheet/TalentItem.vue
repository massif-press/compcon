<template>
  <b-row>
    <b-col>
      <b-card no-body>
        {{talent.id}} {{talent.rank}}
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'talent-item',
    props: [
      'talent'
    ]
  }
</script>