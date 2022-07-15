<template>
  <editor-base
    :item="eidolon"
    :isNew="!!newEidolon"
    @exit="$emit('exit')"
    @add-new="saveAsNew($event)"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <builder slot="builder" :item="eidolon" />
    <features :item="eidolon" />
  </editor-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EditorBase from '../../gm/_components/EditorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { EidolonStore } from '@/store'
import Features from './features.vue'
import Builder from './builder.vue'
import { Eidolon } from '@/classes/npc/eidolons/Eidolon'

export default Vue.extend({
  name: 'gm-eidolon-editor-base',
  components: { Builder, Features, EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    newEidolon: null,
  }),
  computed: {
    eidolon() {
      if (this.id === 'new') {
        if (!this.newEidolon) this.newEidolon = new Eidolon()
        return this.newEidolon
      }
      return getModule(EidolonStore, this.$store).Eidolons.find(x => x.ID === this.id)
    },
  },
  methods: {
    exit() {
      this.$set(this, 'newEidolon', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(EidolonStore, this.$store)
      store.addEidolon(this.eidolon)
      this.exit()
    },
    save() {
      const store = getModule(EidolonStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveEidolonData()
      this.$emit('exit')
    },
    deleteItem() {
      const store = getModule(EidolonStore, this.$store)
      store.deleteEidolon(this.eidolon)
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(EidolonStore, this.$store)
      const dupe = Eidolon.Deserialize(Eidolon.Serialize(this.eidolon))
      dupe.RenewID()
      store.addEidolon(dupe)
      this.$emit('exit')
    },
  },
})
</script>
