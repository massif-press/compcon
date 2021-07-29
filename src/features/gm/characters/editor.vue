<template>
  <editor-base :item="character" :new="id === 'new'" @exit="$router.push('/gm/characters')">
    <v-row dense align="center">
      <v-col cols="auto">
        <v-btn icon color="secondary" class="fadeSelect" @click="randomName()">
          <v-icon>mdi-dice-multiple</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-text-field v-model="character.Name" label="Name" />
      </v-col>
      <v-col cols="auto" offset="1">
        <v-btn icon color="secondary" class="fadeSelect" @click="randomAlias()">
          <v-icon>mdi-dice-multiple</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-text-field
          v-model="character.Alias"
          label="Alias"
          hint="Callsign, nickname, or other alias"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="character.Title"
          label="Title"
          hint="Job title, rank, or position"
          dense
        />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import { Character } from '@/classes/campaign/Character'
import { name, callsign } from '@/io/Generators'
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'

export default Vue.extend({
  name: 'character-editor',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    character: null,
  }),
  created() {
    this.mountCharacter()
  },
  watch: {
    id() {
      this.mountCharacter()
    },
  },
  methods: {
    randomAlias() {
      this.character.Alias = callsign()
    },
    async randomName() {
      this.character.Name = await name()
    },
    mountCharacter() {
      if (this.id === 'new') this.character = new Character()
      else
        this.character = this.$store.getters['character/getCharacters'].find(x => x.ID === this.id)
    },
  },
})
</script>
