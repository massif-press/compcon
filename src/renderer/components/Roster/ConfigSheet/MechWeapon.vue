<template>
  <b-card no-body v-if="mount.weapon_id">
    <v-layout>
      <v-flex xs2>
        <v-btn block v-b-modal.pilotGearSelectorModal>{{mount.mount}}</v-btn>
      </v-flex>
      <v-flex>
        <v-btn block v-b-toggle="mount.weapon_id + 'collapse'">
          <span class="float-left">{{weaponData.name}} </span> 
          <span class="float-right">{{weaponData.source}}</span>
        </v-btn>
          <b-collapse :id="mount.weapon_id + 'collapse'" class="mt-2">
            <b-card>
                <p>{{weaponData.mount}} {{weaponData.type}}</p>
                <p>{{weaponData.source}} {{weaponData.license}} {{weaponData.license_level}}</p>
                <p v-if="weaponData.description" v-html="weaponData.description" />
                <p v-if="weaponData.sp">{{ weaponData.sp }} SP</p>
                <p v-html="`${weaponData.damage} Damage // ${weaponData.range}`" />
                <p v-if="weaponData.effect" v-html="weaponData.effect" />
                <div v-if="weaponData.tags.length">
                  <b-badge v-for="tag in weaponData.tags" :key="tag.id">{{tag.id}}</b-badge>
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
  name: 'mech-weapon-item',
  props: ['mount'],
  computed: {
    weaponData: function () {
      return this.$store.getters.getItemById('MechWeapons', this.mount.weapon_id)
    }
  }
}
</script>