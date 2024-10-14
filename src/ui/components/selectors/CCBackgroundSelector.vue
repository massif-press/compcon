<template>
  <div>
    <v-icon :small="small" color="secondary" @click="open()">cci-orbit</v-icon>
    <cc-solo-dialog ref="dialog" fullscreen no-confirm title="Select Pilot Background">
      <cc-sidebar-view>
        <v-list-item
          v-for="(e, i) in backgrounds"
          :key="`${i}_sidebar'`"
          slot="sidebar"
          link
          @click="
            $vuetify.goTo(`#e_${e.ID}`, {
              duration: 250,
              easing: 'easeInOutQuad',
              offset: 25,
              container: '.v-dialog--active',
            })
          "
        >
          <v-list-item-title class="heading h3 ml-2">{{ e.Name }}</v-list-item-title>
        </v-list-item>
        <br />
        <v-row v-for="(e, i) in backgrounds" :id="`e_${e.ID}`" :key="`${e.ID}_${i}`" dense>
          <v-col>
            <cc-titled-panel
              icon="cci-orbit"
              :title="e.Name"
              class="ma-3 ml-5"
              clickable
              @click="choose(e.Name)"
            >
              <h3 v-if="e.InLcp" v-html-safe="e.LcpName" class="heading mb-2" />
              <p v-html-safe="e.Description" class="flavor-text" />
              <v-row class="skills">
                <span style="margin: auto 0">Example Triggers: <b v-if="!e.Skills[0]">Skill Profile Unknown</b></span>
                <span v-for="(s) in e.Skills" v-html-safe="getSkillName(s)" class="skill"/>
              </v-row>
            </cc-titled-panel>
          </v-col>
        </v-row>
      </cc-sidebar-view>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, store } from '@/store'

export default Vue.extend({
  name: 'cc-background-selector',
  props: {
    small: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    backgrounds: [],
  }),
  methods: {
    open() {
      this.$refs.dialog.show()
      this.backgrounds = getModule(CompendiumStore, this.$store).Backgrounds
    },
    choose(background: string) {
      this.$emit('select', background)
      this.$refs.dialog.hide()
    },
    getSkillName(skillId: string) {
      return store.getters.referenceByID('Skills', skillId).Name
    }
  },
})
</script>

<style lang="css" scoped>
.skills{
  border-top: 1px solid var(--v-light-text-base);
  margin: 0;
  text-align: center;
}

.skill{
  border: 1px solid var(--v-primary-base);
  color: var(--v-light-text-base);
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 1rem;
  
}
</style>
