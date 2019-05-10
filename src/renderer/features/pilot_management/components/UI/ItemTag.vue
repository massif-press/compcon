<template>
    <v-flex shrink>
      <v-tooltip top offset-y>
        <v-chip class="px-1 py-2" slot="activator" :color="tagData.err? 'deep-orange' : 'primary'" dark small>
          <v-avatar>
            <v-icon small v-if="tagData.err">label_off</v-icon>
            <v-icon small v-else>label</v-icon>
          </v-avatar>
          <span v-if="tagData.err">MISSING DATA</span>
          <span v-else>{{ insert(tagData.name) }}</span>
        </v-chip>
        <v-card-text v-if="tagData.err">
          Tag data not found. This is likely due to a missing content pack, or malformed item data.
        </v-card-text>
        <template v-else>
          <v-card-title class="subheading pb-2 mb-2 pt-2 mt-2">
            {{ insert(tagData.name) }}
          </v-card-title>
          <v-card-text v-if="tagObj.id === 'limited'" class="pb-2 mb-2 pt-0 mt-0">{{ insert(tagData.description) }}
            <br>
            <em v-if="bonus">(Includes +{{bonus}} Limited Systems bonus)</em>
          </v-card-text>
          <v-card-text v-else class="pb-2 mb-2 pt-0 mt-0">
            {{ insert(tagData.description) }}
          </v-card-text>
        </template>
      </v-tooltip>
    </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Stats from '../../logic/stats'

  export default Vue.extend({
    name: 'item-tag',
    props: {
      tagObj: Object
    },
    data: () => ({
      tagData: {}
    }),
    computed: {
      bonus(): number {
        return this.tagObj.id === 'limited'
          ? Stats.limitedBonus(this.$store.getters['getPilot'])
          : 0
      }
    },
    methods: {
      insert (str: string): string {
        // if this tag is valueless, do nothing
        if (!this.tagObj.val) { return str }
        // if it's a number, we can do a straight replacement (plus bonus)
        if (typeof this.tagObj.val === 'number') {
          return str.replace(/{VAL}/g, this.tagObj.val + this.bonus)
        // otherwise (a string)...
        } else {
          //  if there's a + we consider it dice, split it out to add our bonus
          if (this.tagObj.val.includes('+')) {
            const split = this.tagObj.val.split('+')
            const newVal = `${split[0]}+${parseInt(split[1]) + this.bonus}`
            return str.replace(/{VAL}/g, newVal)
          } else {
            // otherwise just send everything across
            return this.bonus > 0
              ? str.replace(/{VAL}/g, `${this.tagObj.val}+${this.bonus}`)
              : str.replace(/{VAL}/g, this.tagObj.val)
          }
        }
      },
    },
    created() {
      this.tagData = this.$store.getters['getItemById']('Tags', this.tagObj.id)
    },
  })
</script>