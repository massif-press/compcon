<template>
  <editor-base
    :item="character"
    show-description
    :isNew="!!newNpc"
    @exit="$emit('exit')"
    @add-new="SaveAsNew($event)"
    @save="Save()"
    @delete="deleteNpc()"
    @copy="dupeNpc()"
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
    </v-container>
  </editor-base>
</template>

<script lang="ts">
import { name, callsign } from '@/io/Generators'
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CharacterStore } from '@/store'

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
    exit() {
      this.$set(this, 'newNpc', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(NpcStore, this.$store)
      store.addNpc(this.npc)
      this.exit()
    },
    save() {
      const store = getModule(NpcStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveNpcData()
      this.$emit('exit')
    },
    deleteItem() {
      const store = getModule(NpcStore, this.$store)
      store.delete_npc(this.npc)
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(NpcStore, this.$store)
      const dupe = Npc.Deserialize(Npc.Serialize(this.npc))
      dupe.RenewID()
      store.addNpc(dupe)
      this.$emit('exit')
    },
  },
})
</script>
