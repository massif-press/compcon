<template>
  <div class="ml-4">
    <v-row>
      <div class="flavor-text">
        COMP/CON OMNINET ARCHIVE ::
        <b class="stark--text">{{ mech.Frame.Name }}</b>
      </div>
      <v-row align="center">
        <v-col
          v-if="mech.Frame.ID !== 'mf_standard_pattern_i_everest'"
          cols="2"
          :class="selected === mech.Frame.DefaultImage ? 'selected-img' : 'unselected-img'"
        >
          <div @click="selected = mech.Frame.DefaultImage">
            <v-img :src="mech.Frame.DefaultImage" contain />
          </div>
        </v-col>
        <v-col
          v-for="a in mech.Frame.OtherArt"
          :key="a.src"
          :class="selected === imgPath(a.tag, a.src) ? 'selected-img' : 'unselected-img'"
          cols="2"
        >
          <div @click="selectImg(a)">
            <v-img :src="imgPath(a.tag, a.src)" contain />
          </div>
        </v-col>
      </v-row>
    </v-row>
    <v-alert v-if="selected && artist" outlined dense color="primary" class="my-2">
      <v-row>
        <v-col>
          <div>
            <div class="heading h3 accent--text">{{ artist.imgName }}</div>
            <div class="flavor-text ml-3">by {{ artist.name }}</div>
          </div>
          <a v-if="artist.website" v-extlink="`${artist.website}`" class="ml-3">
            <v-icon color="primary">mdi-web</v-icon>
            <span>Website</span>
          </a>
          <span v-if="artist.website && artist.twitter" class="ml-4 mr-2">|</span>
          <a
            v-if="artist.twitter"
            :key="artist.twitter"
            v-extlink="`https://twitter.com/${artist.twitter}`"
            class="ml-3"
          >
            <v-icon color="primary">mdi-twitter</v-icon>
            <span>@{{ artist.twitter }}</span>
          </a>
        </v-col>
        <v-col v-if="artist.logo" cols="4">
          <v-img v-extlink="artist.website" :src="artist.logo" class="logo" contain />
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import map from '../../../../../static/img/artistmap.json'
import path from 'path'

export default Vue.extend({
  name: 'mech-image-selector',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    artist() {
      if (!this.selected) return null
      const basename = path.basename(this.selected, path.extname(this.selected))
      const artist = map.find(x => x.images.some(y => y.img === basename))
      if (!artist) return null
      const image = artist.images.find(x => x.img === basename)
      return {
        imgName: image.name,
        name: artist.artist,
        logo: artist.logo ? getImagePath(ImageTag.Misc, artist.logo) : '',
        website: artist.website || null,
        twitter: artist.twitter || null,
      }
    },
  },
  methods: {
    selectImg(a) {
      this.selected = this.imgPath(a.tag, a.src)
      this.$emit('set-img', this.imgPath(a.tag, a.src))
    },
    imgPath(tag: ImageTag, src: string) {
      return getImagePath(tag, src)
    },
  },
})
</script>

<style scoped>
.selected-img {
  opacity: 1;
  border: 1px solid var(--v-stark-base);
  border-radius: 2px;
  background-color: var(--v-primary-base);
  cursor: pointer;
}

.unselected-img {
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.15s;
}

.unselected-img:hover {
  border: 1px solid var(--v-primary-base);
  border-radius: 2px;
  opacity: 0.9;
}

.logo {
  filter: saturate(0.6) brightness(80%);
  -webkit-filter: saturate(0.6) brightness(80%);
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}

.logo:hover {
  cursor: pointer;
  filter: saturate(1) brightness(110%);
  -webkit-filter: saturate(1) brightness(110%);
}
</style>
