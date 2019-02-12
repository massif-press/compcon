<template>
  <b-card no-body v-if="mount.id">
    <v-layout>
      <v-flex xs2>
        <v-btn block v-b-modal.pilotGearSelectorModal>SYSTEM</v-btn>
      </v-flex>
      <v-flex>
        <v-btn block v-b-toggle="mount.id + 'collapse'">
          <span class="float-left">{{systemData.name}} </span> 
          <span class="float-right">{{systemData.source}}</span>
        </v-btn>
          <b-collapse :id="mount.id + 'collapse'" class="mt-2">
            <b-card>
                <p>{{systemData.type}}</p>
                <p>{{systemData.source}} {{systemData.license}} {{systemData.license_level}}</p>
                <p v-if="systemData.description" v-html="systemData.description" />
                <p v-if="systemData.sp">{{ systemData.sp }} SP</p>
                <p v-if="systemData.effect" v-html="systemData.effect" />
                <div v-if="systemData.tags.length">
                  <b-badge v-for="tag in systemData.tags" :key="tag.id">{{tag.id}}</b-badge>
                </div>
            </b-card>
          </b-collapse>
      </v-flex>
    </v-layout>
  </b-card>
  <b-card no-body v-else>
    <v-layout>
      <v-flex xs2>
        <v-btn block v-b-modal.pilotGearSelectorModal>{{mount.mount}}</v-btn>
      </v-flex>
      <v-flex>
        <v-btn block variant="outline-primary"><span class="float-left"> // empty // </span> </v-btn>
      </v-flex>
    </v-layout>
  </b-card>
</template>

<script>
export default {
  name: 'mech-system-item',
  props: ['mount'],
  computed: {
    systemData: function () {
      return this.$store.getters.getItemById('MechSystems', this.mount.id)
    }
  }
}
</script>