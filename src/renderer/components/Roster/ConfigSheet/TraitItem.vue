<template>
  <v-layout>
    <v-flex>
      <b-card :title="trait.name">
        <p class="card-text">{{ trait.description }}</p>
      </b-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'trait-item',
    props: [
      'trait'
    ]
  }
</script>

