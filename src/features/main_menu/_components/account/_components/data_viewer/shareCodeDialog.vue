<template>
  <v-dialog max-width="70vw">
    <template #activator="{ props }">
      <v-btn color="accent" size="small" prepend-icon="mdi-plus" v-bind="props">
        Add Remote Item
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title class="heading h3">ADD REMOTE ITEM</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-center">
            <div class="text-overline">Item Share Code</div>
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
                <span v-if="index === 3" class="heading h1 px-4">&ndash;</span>
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
                  Find Item
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
              <span class="flavor-text">// ITEM DATA FOUND</span>
              <v-row dense class="mb-n2">
                <v-col cols="auto" class="heading h4 text-accent mr-2">Name</v-col>
                <v-col cols="9">{{ queryResult.name }}</v-col>
              </v-row>
              <v-row dense class="my-n2">
                <v-col cols="auto" class="heading h4 text-accent mr-2">Author</v-col>
                <v-col cols="9">{{ queryResult.author }}</v-col>
              </v-row>
              <v-row dense class="my-n2">
                <v-col cols="auto" class="heading h4 text-accent mr-2">Type</v-col>
                <v-col cols="9">{{ queryResult.sortkey.split('_')[1] }}</v-col>
              </v-row>
              <v-row dense class="my-n2">
                <v-col cols="auto" class="heading h4 text-accent mr-2">Created</v-col>
                <v-col cols="9">{{ new Date(queryResult.created).toLocaleString() }}</v-col>
              </v-row>
              <v-row dense class="my-n2">
                <v-col cols="auto" class="heading h4 text-accent mr-2">Last Updated</v-col>
                <v-col cols="9">{{ new Date(queryResult.item_modified).toLocaleString() }}</v-col>
              </v-row>
              <v-alert
                v-if="isUserOwned || remoteItemExists"
                type="error"
                variant="tonal"
                prominent
                density="compact"
                class="my-2"
                icon="mdi-information-outline">
                <span v-if="isUserOwned">
                  You are the author of this item. You cannot add your own items as remote
                  resources.
                </span>
                <span v-else>This item has already been added as a remote resource.</span>
              </v-alert>
              <div class="text-right">
                <v-btn
                  flat
                  color="accent"
                  class="mb-1"
                  :loading="dlLoading"
                  :disabled="!canDownload"
                  @click="downloadAsRemote(isActive)">
                  add as remote resource
                  <v-tooltip location="top" max-width="300px">
                    <template v-slot:activator="{ props }">
                      <v-icon end class="fade-select" v-bind="props">
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <span>
                      Adding this item as a remote resource will create a readonly version of this
                      item linked to the author's original data. When the author saves an update to
                      this item to their COMP/CON cloud account, your local version can receive
                      those changes.
                    </span>
                  </v-tooltip>
                </v-btn>
                <br />
                <v-btn
                  size="small"
                  flat
                  color="accent"
                  :loading="dlLoading"
                  :disabled="!canDownload"
                  @click="downloadAsCopy(false, isActive)">
                  add as local copy
                  <v-tooltip location="top" max-width="300px">
                    <template v-slot:activator="{ props }">
                      <v-icon end class="fade-select" v-bind="props">
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <span>
                      Adding this item as a local copy will create a new, editable version of this
                      item saved to your local COMP/CON data. Changes made to this item will not
                      affect the author's original data, and you will not receive updates from the
                      author.
                    </span>
                  </v-tooltip>
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
import { CloudController, ISaveable } from '@/classes/components';
import { downloadFromS3, GetFromCode } from '@/io/apis/account';
import { UserStore } from '@/stores';

export default {
  name: 'share-code-dialog',
  data: () => ({
    codeSearch: '',
    code: Array(8).fill(''),
    queryResult: null as any,
    badCode: '',
    loading: false,
    dlLoading: false,
  }),
  computed: {
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
        UserStore().UserMetadata.RemoteItems.some((ri) => ri === this.queryResult.code)
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
      const pasteArray = pastedData.slice(0, 8).split('');
      pasteArray.forEach((char, i) => {
        if (index + i < 8) {
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
    async downloadAsRemote(isActive) {
      await this.downloadAsCopy(true, isActive);
    },
    async downloadAsCopy(remote = false, isActive) {
      this.dlLoading = true;
      const itemData = await downloadFromS3(this.queryResult.uri);
      const itemType = this.queryResult.sortkey.split('_')[1];
      const item = await CloudController.NewByType(itemType, itemData);
      if (remote) {
        item.CloudController.setRemoteMetadata(this.queryResult);
        UserStore().addRemoteItem(this.queryResult.code);
      } else {
        item.CloudController.GenerateMetadata();
      }
      console.log(item);
      await CloudController.AddByType(itemType, item);

      this.dlLoading = false;
      isActive.value = false;
    },
    reset() {
      this.code = Array(8).fill('');
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
