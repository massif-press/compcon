<template>
  <b-col cols=12>
    <b-card no-body>
      {{license.name}} {{license.source}} {{license.level}}
    </b-card>
  </b-col>
</template>

<script>
  export default {
    name: 'license-item',
    props: [
      'license'
    ]
  }
</script>