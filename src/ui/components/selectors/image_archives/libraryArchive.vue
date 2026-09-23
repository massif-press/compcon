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
            <i18n-t keypath="ui.image.artworkBy"
              tag="div"
              class="text-caption text-center"
              scope="global">
              <template #artist>
                <b>{{ image.artist }}</b>
              </template>
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
              <v-btn v-if="image.bluesky"
                size="small"
                icon
                variant="plain"
                :href="`https://bsky.app/profile/${image.bluesky}`"
                target="_blank"
                class="mx-2">
                <v-icon>mdi-butterfly</v-icon>
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
import * as _ from 'lodash-es'
import artistMap from '@/io/assets/artistmap.json'

defineOptions({ name: 'LibraryImageArchive' })

const props = defineProps<{
  item: { Portrait: string }
  type: string
  avatar?: boolean
}>()

const emit = defineEmits<{
  'set-staged': [payload: any]
}>()

const currentArtistPage = ref(1)
const itemsPerPage = ref(12)
const selectedImage = ref(null as unknown as any)

const selectedTags = ref([] as string[])

selectedTags.value = props.type === 'mech' ? ['frame', 'mech'] : [props.type]

const displayedArtistImages = computed(() => {
  const startIndex = (currentArtistPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return artistImages.value.slice(startIndex, endIndex)
})
const totalArtistPages = computed(() => {
  return Math.ceil(artistImages.value.length / itemsPerPage.value)
})

const imageTags = computed(() => {
  return _.uniq(artistMap.flatMap(x => x.images.map(i => i.tag)))
})
const artistImages = computed(() => {
  return _.sortBy(artistMap, a => a.artist.toLowerCase()).flatMap(artist =>
    artist.images
      .filter(image => selectedTags.value.includes(image.tag))
      .map(image => ({
        url: `https://d2c79xe1p61csc.cloudfront.net/${image.tag === 'pilot' ? 'pilots' : 'frames'}/${image.img}`,
        filename: image.name,
        tag: image.tag,
        artist: artist.artist,
        website: artist.website || '',
        bluesky: artist.bluesky || '',
      }))
  )
})
const selectedImageUrl = computed(() => {
  return selectedImage.value ? selectedImage.value.url : ''
})

function isSelected(url) {
  return selectedImageUrl.value === url
}
function stage(image) {
  selectedImage.value = image
  emit('set-staged', image)
}
</script>
