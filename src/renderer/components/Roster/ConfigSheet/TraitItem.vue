<template>
  <b-row>
    <b-col>
      <b-card :title="trait.name">
        <p class="card-text">{{ trait.description }}</p>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'trait-item',
    props: [
      'trait'
    ]
  }
</script>

