<template>
  <v-container>
    <cc-title>typography</cc-title>
    <v-row class="mx-5">
      <v-col>
        <h1 class="heading">Heading 1</h1>
        <h2 class="heading">Heading 2</h2>
        <h3 class="heading">Heading 3</h3>
        <p class="heading table">Table Heading</p>
        <p class="heading mech">Mech Heading</p>
        <p class="heading sub">Subheading</p>
      </v-col>
      <v-col>
        <p class="body-text">Body Text</p>
        <ol class="body-text">
          <li>Ordered List Text</li>
        </ol>
        <br />
        <ul class="body-text">
          <li>Unordered List Text</li>
        </ul>
        <br />
        <p class="effect-text">Effect Text</p>
        <p class="fluff-text">Fluff Text</p>
        <p class="flavor-text">Flavor Text</p>
        <p class="stat-text">Stat Text</p>
        <p class="caption">Caption</p>
        <p class="overline">Overline</p>
      </v-col>
      <v-col>
        <p class="ra-quiet">RA Subtle Text</p>
        <p>
          <code>Code Text</code>
        </p>
        <p>
          <code class="horus">RA Text</code>
        </p>
      </v-col>
    </v-row>
    <v-divider class="ma-4" />
    <cc-title>colors</cc-title>
    <span class="heading sub">light</span>
    <v-container grid-list-xs>
      <v-row dense>
        <v-col v-for="c in allColors('light')" :key="c.name + 'light'">
          <v-card tile :color="c.color" class="text-center">
            <v-card-text>
              <span class="heading h3 px-2">{{ c.name }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <br />
    <span class="heading sub">dark</span>
    <v-card dark color="grey darken-3">
      <v-container grid-list-xs>
        <v-row dense>
          <v-col v-for="c in allColors('dark')" :key="c.name + 'light'">
            <v-card dark tile :color="c.color" class="text-center">
              <v-card-text>
                <span class="heading h3 px-2">{{ c.name }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-divider class="ma-4" />
    <cc-title>glyphs</cc-title>
    <v-container grid-list-xs>
      <v-row dense>
        <v-col v-for="i in allIcons()" :key="i" dense>
          <v-card outlined>
            <v-card-text class="text-center">
              <v-icon size="60px" color="black">cci-{{ i }}</v-icon>
              <br />
              <span class="caption">{{ i }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="ma-4" />
    <cc-title>titles</cc-title>
    <v-container>
      <cc-title small>cc-title element - small</cc-title>
      <br />
      <cc-title>cc-title element</cc-title>
      <br />
      <cc-title large>cc-title element - large</cc-title>
    </v-container>
    <v-divider class="ma-4" />
    <cc-title>buttons</cc-title>
    <v-container class="text-center">
      <v-row class="my-2">
        <v-col>
          <cc-btn small color="primary">small button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn color="secondary">regular button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn large color="info">large button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn x-large color="success">x-large button</cc-btn>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <v-btn block color="primary" tile>block button</v-btn>
        </v-col>
        <v-col>
          <v-btn block color="primary" tile outlined>outlined block button</v-btn>
        </v-col>
        <v-col>
          <v-btn block color="primary" text>text block button</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <br />
    <cc-title>dialogs</cc-title>
    <v-container class="text-center">
      <v-row class="my-2">
        <v-col>
          <cc-dialog small @confirm="dialog1Confirm()">
            <template v-slot:button>small dialog</template>
            <template v-slot:title>Small Dialog Box (v-slot:title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
        <v-col>
          <cc-dialog @confirm="dialog1Confirm()">
            <template v-slot:button>dialog</template>
            <template v-slot:title>Dialog Box (v-slot:title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
        <v-col>
          <cc-dialog large @confirm="dialog1Confirm()">
            <template v-slot:button>large dialog</template>
            <template v-slot:title>Large Dialog Box (v-slot:title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <cc-popup small @confirm="dialog1Confirm()">
            <template v-slot:button>popup</template>
            <template v-slot:title>CC-Popup</template>
            popup content
          </cc-popup>
        </v-col>
        <v-col>
          <cc-btn @click="notification = true">Notification</cc-btn>
          <cc-notification :model="notification" @close="notification = false">snackbar notification</cc-notification>
        </v-col>
      </v-row>
    </v-container>

    <v-btn text x-large to="/">back</v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const icons = [
  'rank-1',
  'rank-2',
  'rank-3',
  'nested-hexagons',
  'orbit',
  'orbital',
  'large-beam',
  'ammo',
  'burning',
  'balance',
  'reticule',
  'spikes',
  'eclipse',
  'sword-array',
  'marker',
  'barrage',
  'range',
  'thrown',
  'weaponmod',
  'blast',
  'accuracy',
  'activate',
  'burst',
  'cone',
  'line',
  'corebonus',
  'burn',
  'energy',
  'explosive',
  'heat',
  'kinetic',
  'variable',
  'deactivate',
  'difficulty',
  'frame',
  'melee',
  'overcharge',
  'pilot',
  'reactor',
  'repair',
  'role-artillery',
  'role-controller',
  'role-striker',
  'role-support',
  'role-tank',
  'size-1',
  'size-2',
  'size-3',
  'size-4',
  'size-half',
  'structure',
  'system',
  'threat',
  'trait',
  'weapon',
]

export default Vue.extend({
  name: 'ui-test',
  data: () => ({
    notification: false,
  }),
  methods: {
    allIcons() {
      return icons
    },
    allColors(theme) {
      const t = this.$vuetify.theme.themes[theme]
      let output = []
      Object.keys(t).forEach(e => {
        output.push({ name: e, color: t[e] })
      })
      return output
    },
    dialog1Confirm() {
      console.log('dialog 1 confirmed')
    },
  },
})
</script>
