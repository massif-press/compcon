<template>
  <v-window-item>
    <cc-heading size="large">Text Containers</cc-heading>

    <v-card>
      <v-card-text>
        <cc-text :text="sample" />
      </v-card-text>
    </v-card>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-text',
  data: () => ({
    sample:
      '<p><strong>RANGE</strong> is measured from any edge of the attacking character, unless specified otherwise. Targets must be inside <strong>RANGE</strong> to be valid targets. On a grid, that means targets must be at least 1 space inside a character&rsquo;s <strong>RANGE</strong> to be attacked.</p> <p>Some weapons and systems have special attack patterns: <strong>LINE</strong>, <strong>CONE</strong>, <strong>BLAST</strong>, and <strong>BURST</strong>. These attacks affect all targets within a defined area. A separate attack roll is made for each target, but damage is only rolled once and bonus damage is halved if there are multiple characters affected. For any ability or effect calling for you to choose a target or targets within <strong>RANGE</strong>, a weapon with a pattern can choose any target that could be hit by its pattern.</p> <ul> <li><strong>LINE X</strong>: affects characters in a straight line, <strong>X spaces</strong> long.</li> <li><strong>CONE X</strong>: affects characters within a cone,<strong> X spaces</strong> long and<strong> X spaces</strong> wide at its furthest point. The cone begins at one space wide.</li> <li><strong>BLAST X</strong>: affects characters within a radius of <strong>X spaces</strong>, drawn from a point within <strong>RANGE</strong> and line of sight. Cover and line of sight for the attacks are calculated based on the center of the blast, rather than the position of the attacker.</li> <li><strong>BURST X</strong>: affects characters within a radius of <strong>X spaces</strong>, centered on and including the space occupied by the user (or target). If the Burst is an attack, the user or target is not affected by the attack unless specified. Cover and line of sight are calculated from the character. If a <strong>BURST</strong> effect is ongoing, it moves with the character at its center.</li> </ul> <p>Some <strong>LINE</strong>, <strong>CONE</strong>, <strong>BURST</strong>, and <strong>BLAST</strong> attacks list a <strong>RANGE</strong>. In these cases, the attack&rsquo;s origin point can be drawn from a point within the range specified and line of sight. For example, an attack with <strong>BLAST 2</strong> and <strong>RANGE 10</strong> would affect a <strong>BLAST 2</strong> area centered on any point within<strong> RANGE 10</strong>. Some mech <strong>FRAMES</strong> and systems grant increased <strong>RANGE</strong>. This does not affect the size of the area affected by <strong>CONE</strong>, <strong>LINE</strong>, <strong>BURST</strong> and <strong>BLAST</strong> attacks, although it does increase the RANGE of such attacks that have a listed range.</p>',
  }),
};
</script>
