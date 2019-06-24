<template>
  <v-card
    flat
    :color="tableItem ? '' : '#373737'"
    :class="item.IsDestroyed ? 'destroyed-bg' : ''"
  >
    <v-card-text class="pb-0 pt-0">
      <v-tooltip left v-if="item.IsDestroyed">
        <v-btn
          slot="activator"
          fab
          absolute
          right
          dark
          style="top: 5px"
          @click="ToggleDestroy()"
        >
          <v-icon large color="success">mdi-checkbox-blank</v-icon>
        </v-btn>
        <span>Repair Equipment</span>
      </v-tooltip>
      <v-tooltip left v-else>
        <v-btn
          slot="activator"
          fab
          absolute
          right
          icon
          style="top: 5px"
          @click="ToggleDestroy()"
        >
          <v-icon large color="warning" class="hover-opacity">
            mdi-image-broken-variant
          </v-icon>
        </v-btn>
        <span>Mark equipment as Destroyed</span>
      </v-tooltip>
      <div class="pt-2">
        <em v-if="!item.License">
          {{ item.Source }}
          <br />
        </em>
        <em v-else>
          {{ item.Source }} {{ item.License }}, RANK
          <span v-for="n in item.LicenseLevel" :key="n">I</span>
          <br />
        </em>
      </div>
      <b>
        {{ item.Size }} {{ item.Type }}
        <span v-if="item.SP">({{ item.SP }} SP)</span>
      </b>
      <p
        v-if="tableItem && item.Description"
        v-html="item.Description"
        class="fluff-text"
      />
      <br v-else />
      <damage-element dark :dmg="getDamage()" />
      <range-element :range="getRange()" />
      <p
        v-if="item.Effect"
        v-html="item.Effect"
        class="pl-1 ml-1 pb-1 mb-1 effect-text"
      />
      <v-layout class="pb-2">
        <item-tag
          v-for="(t, index) in item.Tags"
          :key="t.id + index"
          :tagObj="t"
          :pilot="!tableItem ? pilot : null"
        />
        <div v-if="mod && mod.AddedTags" style="display: inline-flex;">
          <item-tag
            v-for="t in mod.AddedTags"
            :key="t.id"
            :tagObj="t"
            :pilot="!tableItem ? pilot : null"
          />
        </div>
      </v-layout>
      <div v-if="!tableItem && pilot && item.IsLimited">
        <v-layout>
          <v-flex xs1>
            <v-divider class="mt-2 mr-3" />
          </v-flex>
          <v-flex shrink>
            <span class="caption grey--text">USES</span>
            <b class="warning--text">
              {{ item.Uses }} / {{ item.MaxUses + pilot.LimitedBonus }}
            </b>
          </v-flex>
          <v-flex grow>
            <v-divider class="mt-2 ml-3" />
          </v-flex>
          <v-flex xs1></v-flex>
        </v-layout>
        <v-layout justify-start>
          <limited-bar
            :key="item.Name + '_tb_' + item.Uses"
            :current="item.Uses"
            :max="item.MaxUses + pilot.LimitedBonus"
            large
            color="warning"
            bg-color="grey darken-1"
            empty-icon="mdi-hexagon-outline"
            full-icon="mdi-hexagon"
            @update="item.Uses = $event"
          />
          <!-- :readonly="!config.IsActive" -->
        </v-layout>
      </div>
      <div v-if="!tableItem" class="pb-4">
        <v-layout>
          <v-flex xs1>
            <v-divider class="mt-2 mr-3" />
          </v-flex>
          <v-flex shrink>
            <span class="caption grey--text">ITEM NOTES</span>
          </v-flex>
          <v-flex grow>
            <v-divider class="mt-2 ml-3" />
          </v-flex>
          <v-flex xs1></v-flex>
        </v-layout>
        <v-layout
          v-for="(n, idx) in item.Notes"
          :key="`${item.Name}_note_${idx}`"
          class="mt-1"
        >
          <v-flex xs11>
            <item-note :content="n" @update="updateNote(idx, $event)" />
          </v-flex>
          <v-flex xs1>
            <v-tooltip top>
              <v-btn
                slot="activator"
                outline
                color="error"
                icon
                dark
                small
                @click="removeNote(idx)"
              >
                <v-icon>close</v-icon>
              </v-btn>
              <span>Delete Note</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-tooltip top>
          <v-btn
            slot="activator"
            outline
            color="warning"
            icon
            dark
            small
            absolute
            bottom
            right
            style="bottom: 10px"
            @click="addNote"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add Note</span>
        </v-tooltip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { RangeElement, DamageElement } from './'
  import ItemTag from './ItemTag.vue'
  import LimitedBar from './LimitedBar.vue'
  import ItemNote from './ItemNote.vue'
  import {
    MechWeapon,
    WeaponMod,
    Range,
    Damage,
    RangeType,
    DamageType,
    MechLoadout,
    Tag,
    Pilot,
  } from '@/class'

  export default Vue.extend({
    name: 'weapon-card',
    props: {
      item: MechWeapon,
      tableItem: Boolean,
      mod: WeaponMod,
      loadout: MechLoadout,
    },
    components: { ItemTag, RangeElement, DamageElement, ItemNote, LimitedBar },
    computed: {
      pilot(): Pilot {
        return this.$store.getters.getPilot
      },
    },
    methods: {
      //TODO: should not be hardcoded
      getRange(): Range[] {
        if (this.tableItem) return this.item.Range
        const w = this.item
        let bonuses = [] as { type: RangeType; val: number }[]
        if (w.Mod && w.Mod.AddedRange)
          bonuses.push({
            type: RangeType.Range,
            val: w.Mod.AddedRange,
          })
        if (this.pilot.has('CoreBonus', 'neurolinked'))
          bonuses.push({
            type: RangeType.Range,
            val: 3,
          })
        if (this.pilot.has('CoreBonus', 'gyges'))
          bonuses.push({
            type: RangeType.Threat,
            val: 1,
          })
        if (
          this.loadout.HasSystem('externalbatteries') &&
          w.Damage[0].Type === DamageType.Energy
        )
          bonuses.push({
            type: RangeType.Range,
            val: 5,
          })
        return Range.AddBonuses(w.Range, bonuses)
      },
      getDamage() {
        if (this.tableItem) return this.item.Damage
        if (this.item.Damage && this.mod && this.mod.AddedDamage)
          return this.item.Damage.concat(this.mod.AddedDamage)
        return this.item.Damage || null
      },
      addNote() {
        this.item.AddNote('')
      },
      updateNote(index: number, note: string) {
        this.item.UpdateNote(index, note)
      },
      removeNote(index: number) {
        this.item.DeleteNote(index)
      },
      ToggleDestroy() {
        if (this.item.IsDestroyed) this.item.Repair()
        else this.item.Destroy()
      },
    },
  })
</script>


<style scoped>
  .hover-opacity {
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .hover-opacity:hover {
    opacity: 1;
  }
</style>
