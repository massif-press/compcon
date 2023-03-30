<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'You focus on increasing your own skills, training, and self-improvement. You might practice, learn, meditate, or call on a teacher.'
        "
      />
      <v-divider class="ma-2" />
      <v-alert
        color="secondary"
        prominent
        icon="mdi-information-outline"
        density="compact"
        variant="outlined"
      >
        Completing this Downtime Action will add a "Get Focused" item to this
        pilot's Downtime Reserves. Each "Get Focused" Reserve adds a bonus Skill
        Trigger selection, which can be made in the
        <b class="text-accent">Pilot Sheet's Skill Trigger selection screen.</b>
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
import { Reserve } from '@/class';

export default {
  name: 'get-focused',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addSkill() {
      this.pilot.ReservesController.AddReserve(
        new Reserve({
          id: 'reserve_skillfocus',
          type: 'Bonus',
          name: 'Skill Focus',
          description: 'Added via the "Get Focused" Downtime Action',
          bonuses: [
            {
              id: 'skill_point',
              val: 1,
            },
          ],
          resource_name: 'Skill Focus',
          resource_cost: '',
          resource_note: '',
          used: false,
          consumable: false,
        })
      );
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
