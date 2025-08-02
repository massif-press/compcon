<template>
  <v-card>
    <v-card-title class="heading h2">{{ encounter.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      <span v-if="encounter.Environment.Name !== 'Default'" v-text="encounter.Environment.Name" />
      <span v-text="encounter.Sitrep.Name" />
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <p v-html="encounter.Description" />
    </v-card-text>
    <v-card-text class="pb-0">
      <div class="text-cc-overline text-disabled">Detail</div>
      <div class="heading h3 text-accent">Encounter Detail Header 1</div>
      <p>This is a placeholder for encounter additional detail, created in the encounter editor.</p>
      <div class="heading h3 text-accent">Encounter Detail Header 2</div>
      <p>This is a placeholder for encounter additional detail, created in the encounter editor.</p>
    </v-card-text>

    <v-card-text>
      <div class="text-cc-overline text-disabled">SITREP</div>
      <div class="heading h3 text-accent">Extraction</div>
      <div class="text-cc-overline">Description</div>
      <p>
        EXTRACTION missions require player characters to dash across the map to retrieve an
        objective and bring it safely back to extraction.
      </p>
      <br />
      <div class="text-cc-overline">Deployment</div>
      <p>
        The PCs deploy first, choosing positions for their characters in the Allied Deployment Zone;
        next, the GM places the Objective in the Objective Zone.
      </p>
      <br />
      <div class="text-cc-overline">Objective</div>
      <p>
        An object or person of Size 1/2–2. The Objective has 10 HP per level of Size, Evasion 10,
        E-Defense 10, and no Armor. Enemy forces want the Objective and will not willingly damage
        it. When a character starts their turn adjacent to the Objective, it moves with them when
        they make their regular move. If the Objective is ever adjacent to two characters of
        opposing sides, it stops moving and can’t move until it is only adjacent characters from one
        side. The Objective doesn’t move on its own.
      </p>
      <br />
      <div class="text-cc-overline">Extraction</div>
      <p>
        While in the Extraction Zone/Allied Deployment Zone, PCs can extract as a free action at the
        end of their turn. Extracted PCs are removed from the battlefield. If the Objective is
        adjacent to a PC when they extract and isn’t contested by any characters from the opposing
        side, it is safely extracted.
      </p>
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled">Environment</div>
      <div class="heading h3 text-accent">Spire World</div>
      <p>
        Instead of a surface, this world is comprised of countless floating islands or spires, each
        held aloft in a gaseous substrate and suspended through magnetic force. Perhaps the crust
        was shattered by a superweapon or natural disaster. Most of the remaining landmass is
        disconnected, although some islands are large enough to hold cities. Navigation systems are
        almost useless here.
      </p>
    </v-card-text>

    <v-card-text>
      <div class="text-cc-overline text-disabled">Reinforcements</div>
      TODO
      <br />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'EncounterInfo',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
};
</script>
