<template>
  <div>
    <i class="text-disabled">
      This is the locally-saved user data. These items should generally not have to be reset, but
      may be useful in debugging or clearing a persistent loading issue.
      <br />
      Resetting User Data will not reset achievement unlocks (this can be done in the Achievement
      Browser).
    </i>

    <v-table class="text-left pa-2 mt-2">
      <thead>
        <tr>
          <th>Item</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in userDataKeys">
          <td v-text="key.replace('_', '')" />
          <td v-if="key === '_options'">
            <v-row dense>
              <v-col cols="4" v-for="viewKey in Object.keys(user[key].views)">
                {{ viewKey }}:
                <b class="text-accent">{{ user[key].views[viewKey] }}</b>
              </v-col>
            </v-row>
          </td>
          <td v-else-if="Array.isArray(user[key])" v-text="`${user[key].length} items`" />
          <td v-else v-text="user[key]" />
        </tr>
      </tbody>
    </v-table>

    <div class="text-right">
      <v-btn size="small" variant="plain" color="error" @click="resetUserData()">
        Reset User Data
      </v-btn>
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
      return UserStore().User;
    },
    userDataKeys() {
      const skipKeys = ['LcpSubscriptionData', '_patreonData', '_itchData'];
      const data = [...Object.keys(UserStore().User)];
      return data.filter((key) => !skipKeys.includes(key));
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
