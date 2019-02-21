<template>
    <v-flex shrink>
      <v-menu open-on-hover top offset-y>
        <v-chip slot="activator" color="primary" dark>
          <v-avatar>
            <v-icon>label</v-icon>
          </v-avatar>
          {{ insert(tagData.name) }}
        </v-chip>
      <v-card>
        <v-card-title>{{ insert(tagData.description) }}</v-card-title>
      </v-card>
      </v-menu>
    </v-flex>
</template>

<script>
  export default {
    name: 'tag',
    props: ['id', 'val'],
    data: () => ({
      tagData: {}
    }),
    methods: {
      insert: function (str) {
        return str.replace(/{VAL}/g, this.val)
      }
    },
    created: function () {
      this.tagData = this.$store.getters.getItemById('Tags', this.id)
    }
  }
</script>