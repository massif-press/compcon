<template>
  <v-row class="my-1">
    <v-col>
      <v-select v-model="selectedTags"
        :label="$t('ui.fields.imageType')"
        hide-details
        density="compact"
        variant="outlined"
        :items="imageTags"
        multiple
        chips
        closable-chips />
    </v-col>
  </v-row>
  <v-card>
    <v-row dense
      align="center">
      <v-col v-for="image in displayedArtistImages"
        :key="image.url"
        cols="4"
        md="3">
        <v-card class="ma-2"
          outlined
          tile
          :color="isSelected(image.url) ? 'primary' : ''"
          :class="{ selected: image === selectedImage }"
          style="border-width: 3px"
          @click="isSelected(image.url) ? (selectedImage = null) : stage(image)">
          <div class="background">
            <v-img :src="image.url"
              contain
              max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card v-if="isSelected(image.url)"
            flat
            outlined
            class="pa-1"
            tile>
            <i18n-t keypath="ui.image.artworkBy" tag="div" class="text-caption text-center" scope="global">
              <template #artist><b>{{ image.artist }}</b></template>
            </i18n-t>
            <div class="text-center mt-n2">
              <v-btn v-if="image.website"
                size="small"
                icon
                variant="plain"
                :href="image.website"
                target="_blank"
                class="mx-2">
                <v-icon>mdi-web</v-icon>
              </v-btn>
              <v-btn v-if="image.twitter"
                size="small"
                icon
                variant="plain"
                :href="`https://twitter.com/${image.twitter}`"
                target="_blank"
                class="mx-2">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
    <v-pagination v-model="currentArtistPage"
      :length="totalArtistPages"
      total-visible="5"
      @input="currentArtistPage = $event" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import artistMap from '@/assets/artistmap.json';

defineOptions({ name: 'LibraryImageArchive' })

const props = defineProps<{
  item: object
  type: string
  avatar?: boolean
}>()

const emit = defineEmits<{
  'set-staged': [payload: any]
}>()

const currentUserPage = ref(1)
const currentArtistPage = ref(1)
const itemsPerPage = ref(12)
const selectedImage = ref(null as unknown as any)
const loading = ref(false)
const imageSelectTab = ref(0)
const userStorageData = ref(null as unknown as any)
const stagedImage = ref(null as unknown as any)
const imageUrl = ref('')
const selectedTags = ref([] as string[])

selectedTags.value = [props.type];

selectedTags.value = [props.type];

const displayedUserImages = computed(() => {
      const startIndex = (currentUserPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return userImages.value.slice(startIndex, endIndex);
    })
const totalUserPages = computed(() => {
      return Math.ceil(userImages.value.length / itemsPerPage.value);
    })
const displayedArtistImages = computed(() => {
      const startIndex = (currentArtistPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return artistImages.value.slice(startIndex, endIndex);
    })
const totalArtistPages = computed(() => {
      return Math.ceil(artistImages.value.length / itemsPerPage.value);
    })
const displayImage = computed(() => {
      if (selectedImage.value) return selectedImage.value.url;
      if (props.item.Portrait) return props.item.Portrait;
      else return 'https://via.placeholder.com/550';
    })
const isAuthed = computed(() => {
      return false;
      // return getModule(UserStore, _store).IsLoggedIn;
    })
const isOverCapacity = computed(() => {
      return (
        isAuthed.value &&
        userStorageData.value &&
        userStorageData.value.totalSize >= userStorageData.value.max
      );
    })
const userImages = computed(() => {
      if (!userStorageData.value || userStorageData.value.contents.length === 0) return [];
      const contents = userStorageData.value.contents
        .flatMap((x) => x.objects)
        .map((x) => ({
          url: `https://d1nurxym97qk9o.cloudfront.net/${x.Key}`,
          filename: x.Key.split('/').pop(),
          tag: x.Key.split('/').slice(-2, -1)[0],
          size: x.Size / 1000000,
          key: x.Key,
        }));
      return contents;
    })
const imageTags = computed(() => {
      return _.uniq([...artistMap.flatMap((x) => Object.keys(x.images))]);
    })
const artistImages = computed(() => {
      const out = [] as any[];

      artistMap.forEach((artist) => {
        selectedTags.value.forEach((t) => {
          if (artist.images[t])
            artist.images[t].forEach((image) => {
              out.push({
                url: image.img,
                filename: image.name,
                tag: props.type,
                artist: artist.artist,
                website: artist.website || '',
                twitter: artist.twitter || '',
              });
            });
        });
      });
      return out;
    })
const selectedImageUrl = computed(() => {
      return selectedImage.value ? selectedImage.value.url : '';
    })

function isSelected(url) {
      return selectedImageUrl.value === url;
    }
function stage(image) {
      selectedImage.value = image;
      emit('set-staged', image);
    }
</script>
