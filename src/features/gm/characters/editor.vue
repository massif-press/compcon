<template>
  <editor-base
    :item="character"
    show-description
    :isNew="!!newCharacter"
    @exit="$emit('exit')"
    @add-new="saveAsNew($event)"
    @save="save()"
    @delete="deleteCharacter()"
    @copy="dupeCharacter()"
  >
    <v-container slot="builder">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-btn icon color="secondary" class="fadeSelect" @click="randomName()">
            <v-icon>mdi-dice-multiple</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-text-field v-model="character.Name" label="Name" />
        </v-col>
        <v-col cols="auto">
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
        <v-col>
          <v-text-field
            v-model="character.Title"
            label="Title"
            hint="Job title, rank, or position"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-n6">
        <v-col cols="auto" style="margin-left: 45px">
          <v-combobox
            v-model="character.Pronouns"
            :items="character.PronounSuggestions"
            dense
            hide-details
            class="small"
          />
        </v-col>
      </v-row>
    </v-container>
  </editor-base>
</template>

<script lang="ts">
import { name, callsign } from '@/io/Generators'
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CharacterStore } from '@/store'
import { Character } from '@/classes/campaign/Character'

export default Vue.extend({
  name: 'gm-editor-character',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    newCharacter: null,
  }),
  computed: {
    character() {
      if (this.id === 'new') {
        if (!this.newCharacter) this.newCharacter = new Character()
        return this.newCharacter
      }
      return getModule(CharacterStore, this.$store).Characters.find(x => x.ID === this.id)
    },
  },
  methods: {
    async randomName() {
      this.character.Name = await name()
    },
    async randomAlias() {
      this.character.Alias = await callsign()
    },
    exit() {
      this.$set(this, 'newCharacter', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(CharacterStore, this.$store)
      store.addCharacter(this.character)
      this.exit()
    },
    save() {
      const store = getModule(CharacterStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveCharacterData()
      this.$emit('exit')
    },
    deleteItem() {
      this.character.SaveController.delete()
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(CharacterStore, this.$store)
      const dupe = Character.Deserialize(Character.Serialize(this.character))
      dupe.RenewID()
      store.addCharacter(dupe)
      this.$emit('exit')
    },
  },
})
</script>
