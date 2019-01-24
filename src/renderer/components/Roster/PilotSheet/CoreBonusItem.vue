<template>
  <b-row>
    <b-col>
      <b-card no-body>
        {{cb}}
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'cb-item',
    props: [
      'cb'
    ]
  }
</script>