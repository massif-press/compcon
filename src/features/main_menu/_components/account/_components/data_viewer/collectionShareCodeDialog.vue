<template>
  <v-dialog max-width="70vw" min-width="1020px">
    <template #activator="{ props }">
      <v-btn color="accent" size="small" prepend-icon="mdi-plus" variant="tonal" v-bind="props">
        Add New Subscription
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="heading h3">SUBSCRIBE TO CONTENT COLLECTION</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0">
          <div class="text-center">
            <div class="text-overline">Collection Share Code</div>
            <div class="code-input mb-2">
              <span v-for="(digit, index) in code">
                <input
                  :key="index"
                  v-model="code[index]"
                  maxlength="1"
                  ref="codeInputs"
                  @input="onInput(index)"
                  @paste="onPaste($event, index)"
                  @keydown.backspace="onBackspace(index)" />
                <span v-if="index === 3 || index === 7" class="heading h1 px-4">&ndash;</span>
              </span>
            </div>
            <v-row no-gutters justify="center">
              <v-col cols="4">
                <v-btn
                  block
                  size="small"
                  flat
                  rounded="0"
                  class="rounded-s"
                  color="accent"
                  :disabled="hasCode"
                  :loading="loading"
                  @click="getFromCode()">
                  Find Collection
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  size="small"
                  class="ma-0 rounded-e px-0"
                  style="min-width: 25px"
                  rounded="0"
                  variant="tonal"
                  flat
                  @click="reset">
                  <v-icon icon="mdi-close" />
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-scroll-y-reverse-transition>
            <div v-if="badCode">
              <v-divider class="my-4" />
              <div class="text-center">
                <v-alert
                  type="error"
                  variant="tonal"
                  prominent
                  density="compact"
                  icon="mdi-information-outline">
                  No item found with code {{ badCode.substring(0, 4) }}-{{
                    badCode.substring(4, 8)
                  }}.
                </v-alert>
              </div>
            </div>
          </v-scroll-y-reverse-transition>
          <v-scroll-y-reverse-transition>
            <div v-if="queryResult">
              <v-divider class="my-4" />
              <span class="flavor-text">// COLLECTION DATA FOUND</span>
              <collection-info :collection="queryResult" />
              <v-alert
                v-if="isUserOwned || remoteItemExists"
                type="error"
                variant="tonal"
                prominent
                density="compact"
                class="my-2"
                icon="mdi-information-outline">
                <span v-if="isUserOwned">
                  You are the author of this collection. You cannot add your own collections as
                  remote resources.
                </span>
                <span v-else>This collection has already been added as a remote resource.</span>
              </v-alert>
              <div class="text-right">
                <v-btn
                  flat
                  color="accent"
                  class="mb-1"
                  :loading="dlLoading"
                  :disabled="isUserOwned || remoteItemExists || !canDownload"
                  @click="subscribe(isActive)">
                  subscribe
                </v-btn>
              </div>
            </div>
          </v-scroll-y-reverse-transition>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { GetFromCode } from '@/io/apis/account';
import { UserStore } from '@/stores';
import CollectionInfo from './collectionInfo.vue';

export default {
  name: 'share-code-dialog',
  components: { CollectionInfo },
  data: () => ({
    codeSearch: '',
    code: Array(12).fill(''),
    queryResult: null as any,
    badCode: '',
    loading: false,
    dlLoading: false,
  }),
  computed: {
    isCampaign() {
      return this.queryResult && this.queryResult.sortkey.startsWith('campaign');
    },
    hasCode() {
      return this.code.some((char) => char === '');
    },
    isUserOwned() {
      return this.queryResult && this.queryResult.user_id === UserStore().Cognito.userId;
    },
    canDownload() {
      return this.queryResult && this.queryResult.uri && !this.isUserOwned;
    },
    remoteItemExists() {
      return (
        this.queryResult &&
        UserStore().UserMetadata.CollectionSubscriptionSettings.items.some(
          (r) => r.code === this.queryResult.code
        )
      );
    },
  },
  methods: {
    onInput(index: number) {
      if (this.code[index].length === 1 && index < 7) {
        (this.$refs.codeInputs as HTMLElement[])[index + 1].focus();
      }
    },
    onPaste(event: ClipboardEvent, index: number) {
      let pastedData = event.clipboardData?.getData('Text') || '';
      pastedData = pastedData.replace(/-/g, '');
      const pasteArray = pastedData.slice(0, 12).split('');
      pasteArray.forEach((char, i) => {
        if (index + i < 12) {
          this.code[index + i] = char;
        }
      });
      this.$nextTick(() => {
        const nextIndex = Math.min(index + pasteArray.length, 5);
        (this.$refs.codeInputs as HTMLElement[])[nextIndex].focus();
      });
    },
    onBackspace(index: number) {
      if (this.code[index] === '' && index > 0) {
        this.code[index - 1] = '';
        (this.$refs.codeInputs as HTMLElement[])[index - 1].focus();
      }
    },
    async getFromCode() {
      this.loading = true;
      GetFromCode(this.code.join(''))
        .then((res) => {
          this.badCode = '';
          console.log(res);
          this.queryResult = res;
        })
        .catch((err) => {
          this.badCode = this.code.join('');
          this.queryResult = null;
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async subscribe(isActive) {
      this.dlLoading = true;

      if (!this.queryResult) return;
      await UserStore().addContentSubscription(this.queryResult);
      await UserStore().updateRemoteCollection(this.queryResult);
      this.dlLoading = false;
      this.reset();
      isActive.value = false;
    },

    reset() {
      this.code = Array(12).fill('');
      this.queryResult = null;
      this.badCode = '';
    },
  },
};
</script>

<style scoped>
.code-input input {
  width: 4rem;
  height: 4rem;
  font-size: 3rem;
  font-family: 'Helvetica Bold', sans-serif;
  text-align: center;
  margin: 0.2rem;
  border: 2px solid rgb(var(--v-theme-primary));
  border-radius: 8px;
}
</style>
