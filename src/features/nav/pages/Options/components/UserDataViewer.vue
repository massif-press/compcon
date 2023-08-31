<template>
  <div>
    <i class="text-subtle">
      This is the locally-saved user data. These items should generally not have to be reset, but
      may be useful in debugging or clearing a persistent loading issue.
      <br />Resetting User Data will not reset achievement unlocks (this can be done in the
      Achievement Browser).
    </i>

    <v-table class="text-left pa-2 mt-2">
      <thead>
        <th>Item</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr v-for="key in Object.keys(user)">
          <td v-text="key" />
          <td v-text="user[key]" />
        </tr>
      </tbody>
    </v-table>

    <div class="text-right">
      <v-btn size="small" variant="plain" color="error" @click="resetUserData()"
        >Reset User Data</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'deleted-items',
  data: () => ({
    resetDialog: false,
  }),
  computed: {
    user() {
      return UserStore().UserProfile;
    },
  },
  methods: {
    resetUserData() {
      this.user.Reset();
      // @ts-ignore
      this.$vuetify.theme.global.name = this.user.Theme;
      this.resetDialog = false;
    },
  },
};
</script>
