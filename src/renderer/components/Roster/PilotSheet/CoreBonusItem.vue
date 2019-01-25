<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header header-tag="header">
          {{cb.name}} ({{cb.source}})
        </b-card-header>
          <b-card-body>
            <p class="card-text">
              <em>{{ cb.description }}</em>
              {{cb.effect}}
            </p>
          </b-card-body>
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