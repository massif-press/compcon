<template>
  <v-btn-toggle
    v-model="itemSize"
    color="primary"
    mandatory
    style="height: 20px; margin-top: -6px; width: 100%">
    <v-btn value="100" key="100" size="small" style="width: 25%">
      <v-icon size="x-large" icon="mdi-size-s" />
    </v-btn>
    <v-btn value="200" key="200" size="small" style="width: 25%">
      <v-icon size="x-large" icon="mdi-size-m" />
    </v-btn>
    <v-btn value="300" key="300" size="small" style="width: 25%">
      <v-icon size="x-large" icon="mdi-size-l" />
    </v-btn>
    <v-btn value="450" key="450" size="small" style="width: 25%">
      <v-icon size="x-large" icon="mdi-size-xl" />
    </v-btn>
  </v-btn-toggle>
  <v-data-table
    density="compact"
    :mobile="mobile"
    :headers="headers"
    :items="images"
    item-key="name"
    :items-per-page="25">
    <template #item.image="{ item }">
      <v-img :width="itemSize" :src="`${distributor}/${item.uri}`" />
    </template>
    <template #item.name="{ item }">
      <span>{{ item.uri.split('/').pop() }}</span>
    </template>
    <template #item.created="{ item }">
      <span>
        {{ new Date(item.created).toLocaleString() }}
      </span>
    </template>
    <template #item.actions="{ item }">
      <v-dialog>
        <template #activator="{ props }">
          <v-btn size="small" color="accent" icon variant="text" v-bind="props">
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon size="x-large">mdi-magnify</v-icon>
              </template>
              <div class="text-center">View Image</div>
            </v-tooltip>
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card style="position: relative">
            <v-btn
              @click="isActive.value = false"
              icon
              color="primary"
              style="position: fixed; top: 8px; right: 8px; z-index: 9">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-img :src="`${distributor}/${item.uri}`" />
          </v-card>
        </template>
      </v-dialog>

      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn
            size="small"
            color="accent"
            icon
            variant="text"
            v-bind="props"
            @click="downloadImage(`${distributor}/${item.uri}`)">
            <v-icon size="x-large">mdi-download</v-icon>
          </v-btn>
        </template>
        <div class="text-center">Download Copy</div>
      </v-tooltip>

      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn
            size="small"
            color="accent"
            variant="text"
            icon
            v-bind="props"
            @click="deleteImage(item)">
            <v-icon size="x-large">mdi-delete-outline</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          Delete
          <br />
          <i class="text-caption">
            Please note that this will break any references to this image in your data. This action
            cannot be undone.
          </i>
        </div>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import DiffViewer from './diffViewer.vue';
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController';
import { cloudDelete, downloadFromS3 } from '@/io/apis/account';
import logger from '@/user/logger';

const distributor = import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || '';

export default {
  name: 'cloud-item-data-tab',
  components: {
    DiffViewer,
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    tab: 'Images',
    itemSize: '200',
    deleteLoading: false,
    headers: [
      { title: '', key: 'image' },
      { title: 'Filename', key: 'name' },
      { title: 'Upload Date', key: 'created' },
      { title: '', key: 'actions', width: '155px' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    allImages() {
      return UserStore().CloudImages;
    },
    distributor() {
      return distributor;
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull;
    },
    images() {
      return this.allImages.filter((item) => {
        if (this.search && !item.Name.toLowerCase().includes(this.search.toLowerCase()))
          return false;
        return true;
      });
    },
    skipDeleteWarning: {
      get() {
        return UserStore().User.View('skipDeleteWarning_image', false);
      },
      set(val) {
        UserStore().User.SetView('skipDeleteWarning_image', val);
      },
    },
  },
  emits: ['refresh'],
  methods: {
    async downloadImage(url) {
      const filename = url.split('/').pop();
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        logger.error(`Error downloading image: ${error}`, this, error);
      }
    },
    async deleteImage(item) {
      this.deleteLoading = true;
      try {
        const { user_id, sortkey, uri } = item;
        await cloudDelete(user_id, sortkey, uri);

        this.$emit('refresh');
        this.$notify({
          title: `Image Deleted`,
          text: `Removed ${item.ItemType} ${item.Name}.`,
          data: { icon: 'mdi-delete', color: 'success' },
        });
        this.deleteLoading = false;
        return true;
      } catch (err) {
        logger.error(`Error deleting image: ${err}`, this, err);
        this.$notify({
          title: `Deletion Failed`,
          text: `Unable to communicate with server. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
      this.deleteLoading = false;
    },
  },
};
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
