<template>
    <v-flex shrink>
      <v-menu open-on-hover top offset-y>
        <v-chip slot="activator" :color="tagData.err? 'deep-orange' : 'primary'" dark small>
          <v-avatar>
            <v-icon small v-if="tagData.err">label_off</v-icon>
            <v-icon small v-else>label</v-icon>
          </v-avatar>
          <span v-if="tagData.err">MISSING DATA</span>
          <span v-else>{{ insert(tagData.name) }}</span>
        </v-chip>
        <v-card v-if="tagData.err">
          <v-card-text>
            Tag data not found. This is likely due to a missing content pack, or malformed item data.
          </v-card-text>
        </v-card>
        <v-card v-else>
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
    props: {
      id: String,
      val: [Number, String]
    },
    data: () => ({
      tagData: {}
    }),
    computed: {
      bonus: function () {
        return this.id === 'limited' ? Stats.limitedBonus(this.$store.getters.getPilot) : 0
      }
    },
    methods: {
      insert: function (str) {
        if (!this.val) return str
        if (typeof this.val === 'number') {
          return str.replace(/{VAL}/g, this.val + this.bonus)
        } else {
          if (this.val.includes('+')) {
            var split = this.val.split('+')
            var newVal = `${split[0]}+${parseInt(split[1]) + this.bonus}`
            return str.replace(/{VAL}/g, newVal)
          } else {
            return this.bonus > 0 ? str.replace(/{VAL}/g, `${this.val}+${this.bonus}`) : str.replace(/{VAL}/g, this.val)
          }
        }
      }
    },
    created: function () {
      this.tagData = this.$store.getters.getItemById('Tags', this.id)
    }
  }
</script>