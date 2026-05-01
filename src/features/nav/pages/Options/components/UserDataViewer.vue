<template>
  <v-card-text class="pa-2">
    <i class="text-cc-subtle">
      {{ ud.description }}
      <br />
      {{ ud.achievementNote }}
    </i>

    <v-table class="text-left mt-2"
      density="compact">
      <thead>
        <tr>
          <th>{{ ud.item }}</th>
          <th>{{ ud.value }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in userDataKeys" :key="key">
          <td v-text="key.replace('_', '')" />
          <td v-if="key === '_options'">
            <v-row dense>
              <v-col cols="4"
                v-for="viewKey in Object.keys(user[key].views)"
              :key="viewKey">
                {{ viewKey }}:
                <b class="text-accent">{{ user[key].views[viewKey] }}</b>
              </v-col>
            </v-row>
          </td>
          <td v-else-if="Array.isArray(user[key])"
            v-text="`${user[key].length} items`" />
          <td v-else
            v-text="user[key]" />
        </tr>
      </tbody>
    </v-table>

    <div class="text-right">
      <cc-button size="small"
        variant="tonal"
        color="error"
        @click="resetUserData()">
        {{ ud.resetUserData }}
      </cc-button>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import { useMobile } from '@/mixins/useMobile';
import { NAV_STRINGS } from '@/features/nav/strings';


export default {
  mixins: [useMobile],
  name: 'deleted-items',
  setup() {
    return { ud: NAV_STRINGS.userDataViewer }
  },
  data: () => ({
    resetDialog: false,
  }),
  computed: {
    user() {
      return UserStore().User;
    },
    userDataKeys() {
      const skipKeys = ['LcpSubscriptionData', '_patreonData', '_itchData'];
      if (this.mobile) {
        skipKeys.push('_options');
      }
      const data = [...Object.keys(UserStore().User)];
      return data.filter((key) => !skipKeys.includes(key));
    },
  },
  methods: {
    resetUserData() {
      this.user.Reset();
      this.$vuetify.theme.global.name = this.user.Theme;
      this.resetDialog = false;
    },
  },
};
</script>
