<template>
    <v-flex shrink>
      <v-menu open-on-hover top offset-y>
        <v-chip slot="activator" color="primary" dark small>
          <v-avatar>
            <v-icon small>label</v-icon>
          </v-avatar>
          {{ insert(tagData.name) }}
        </v-chip>
        <v-card>
          <v-card-title class="subheading pb-2 mb-2 pt-2 mt-2">{{ insert(tagData.name) }}</v-card-title>
          <v-card-text v-if="id === 'limited'" class="pb-2 mb-2 pt-0 mt-0">{{ insert(tagData.description) }}<br>
            <em v-if="bonus">(Includes +{{bonus}} Limited Systems bonus)</em></v-card-text>
          <v-card-text v-else class="pb-2 mb-2 pt-0 mt-0">{{ insert(tagData.description) }}</v-card-text>
        </v-card>
      </v-menu>
    </v-flex>
</template>

<script>
  import Stats from '@/logic/stats'

  export default {
    name: 'tag',
    props: ['id', 'val'],
    data: () => ({
      tagData: {}
    }),
    computed: {
      bonus: function () {
        return Stats.limitedBonus(this.$store.getters.getPilot)
      }
    },
    methods: {
      insert: function (str) {
        return str.replace(/{VAL}/g, this.val + this.bonus)
      }
    },
    created: function () {
      this.tagData = this.$store.getters.getItemById('Tags', this.id)
    }
  }
</script>