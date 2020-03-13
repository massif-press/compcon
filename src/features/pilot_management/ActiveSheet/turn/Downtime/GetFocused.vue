<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You focus on increasing your own skills, training, and self-improvement. You might practice, learn, meditate, or call on a teacher.'
        "
      />
      <v-divider class="ma-2" />
      <v-alert
        color="secondary"
        prominent
        icon="mdi-information-outline"
        dense
        outlined
        border="left"
      >
        Completing this Downtime Action will add a "Get Focused" item to this pilot's Downtime
        Reserves. Each "Get Focused" Reserve adds a bonus Skill Trigger selection, which can be made
        in the
        <b class="accent--text">Pilot Sheet's Skill Trigger selection screen.</b>
      </v-alert>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" @click="addSkill()">
        {{ tabs === 0 ? 'Add Skill' : 'Improve Skill' }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'get-focused',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addSkill() {
      this.pilot.Reserves.push(
        new Reserve({
          id: 'reserve_skill',
          type: 'Resources',
          name: 'Skill Focus',
          description: 'Added via the "Get Focused" Downtime Action',
          resource_name: 'Skill Focus',
          resource_cost: '',
          resource_note: '',
          used: false,
        })
      )
      this.close()
    },
    close() {
      this.$emit('close')
    },
  },
})
</script>
