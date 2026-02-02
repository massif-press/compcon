<template>
  <v-row no-gutters
    justify="center">
    <v-col>
      <v-tooltip location="top"
        open-delay="500"
        max-width="300">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            variant="text"
            flat
            tile
            size="x-small"
            :color="damageEffect.IsCrit ? 'error' : 'rgba(125,125,125,0.5)'"
            @click.stop="damageEffect.IsCrit = !damageEffect.IsCrit">
            <v-icon size="25"
              icon="cc:eclipse" />
          </v-btn>
        </template>
        <div class="text-center">
          <span v-if="damageEffect.IsCrit">This damage is rolled as critical damage (roll twice,
            take
            highest)</span>
          <span v-else>This damage does not roll as critical damage</span>
          <div>
            <i class="text-caption text-disabled">Click to Override</i>
          </div>
        </div>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-tooltip v-if="!['heat', 'burn'].includes(damageEffect.DamageType)"
        location="top"
        open-delay="500"
        max-width="300">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            variant="text"
            flat
            tile
            size="x-small"
            :color="damageEffect.AP ? 'accent' : 'rgba(125,125,125,0.5)'"
            @click="damageEffect.AP = !damageEffect.AP">
            <v-icon size="25"
              icon="mdi-shield-off-outline" />
          </v-btn>
        </template>
        <div class="text-center">
          <span v-if="damageEffect.AP">This damage ignores armor</span>
          <span v-else>This damage does not ignore armor</span>
          <div>
            <i class="text-caption text-disabled">Click to Override</i>
          </div>
        </div>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-tooltip location="top"
        open-delay="500"
        max-width="300">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            variant="text"
            flat
            tile
            size="x-small"
            :color="damageEffect.Irreducible ? 'core' : 'rgba(125,125,125,0.5)'"
            @click="damageEffect.Irreducible = !damageEffect.Irreducible">
            <v-icon size="25"
              icon="cc:large_beam" />
          </v-btn>
        </template>
        <div class="text-center">
          <span v-if="damageEffect.Irreducible">This damage cannot be reduced in any way</span>
          <span v-else>
            This damage can be reduced by the target's defenses
            <span v-if="damageEffect.AP">, except for armor</span>
          </span>
          <div>
            <i class="text-caption text-disabled">Click to Override</i>
          </div>
        </div>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-tooltip location="top"
        open-delay="500"
        max-width="300">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            variant="text"
            flat
            tile
            size="x-small"
            :color="damageEffect.Overkill ? 'red' : 'rgba(125,125,125,0.5)'"
            @click.stop="damageEffect.Overkill = !damageEffect.Overkill">
            <v-icon size="25"
              icon="cc:burning" />
          </v-btn>
        </template>
        <div class="text-center">
          <span v-if="damageEffect.Overkill">This damage is subject to OVERKILL rules (reroll 1s,
            add
            heat (self))</span>
          <span v-else>This damage is not subject to OVERKILL rules</span>
          <div>
            <i class="text-caption text-disabled">Click to Override</i>
          </div>
        </div>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-menu location="top"
        open-on-hover
        :close-on-content-click="false"
        open-delay="500"
        max-width="200">
        <template #activator="{ props }">

          <v-icon v-bind="props"
            class="d-inline-block"
            style="margin: 0 2px"
            size="25"
            :color="damageEffect.Reliable ? 'core' : 'rgba(125,125,125,0.5)'"
            icon="mdi-alpha-r-circle-outline" />
        </template>
        <v-card class="pa-2"
          flat
          tile>
          <div class="text-cc-overline text-disabled">Reliable Damage:</div>
          <v-row align="center"
            no-gutters>
            <v-col cols="auto">
              <v-text-field v-model="damageEffect.Reliable"
                density="compact"
                variant="outlined"
                class="my-2"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile
                @update:model-value="damageEffect.Reliable = Number($event)">
                <template #prepend-inner>
                  <v-btn flat
                    tile
                    icon
                    size="x-small"
                    class="ml-n2"
                    @click="damageEffect.Reliable--">
                    <v-icon size="20"
                      icon="mdi-minus" />
                  </v-btn>
                </template>
                <template #append-inner>
                  <v-btn flat
                    tile
                    icon
                    size="x-small"
                    class="mr-n2"
                    @click="damageEffect.Reliable++">
                    <v-icon size="20"
                      icon="mdi-plus" />
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-btn size="x-small"
            flat
            tile
            block
            variant="tonal"
            @click.stop="damageEffect.Reliable = 0">
            Clear Reliable Damage
          </v-btn>
        </v-card>
      </v-menu>
    </v-col>
    <v-col>
      <v-tooltip location="top"
        open-delay="500"
        max-width="300">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            variant="text"
            flat
            tile
            size="x-small"
            :color="damageEffect.Bonus ? 'primary' : 'rgba(125,125,125,0.5)'"
            @click.stop="damageEffect.Bonus = !damageEffect.Bonus">
            <v-icon size="25"
              icon="mdi-plus-box" />
          </v-btn>
        </template>
        <div class="text-center">
          <span v-if="damageEffect.Bonus">Click to clear Bonus Damage</span>
          <span v-else>Click to add Bonus Damage</span>
        </div>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DamageEffectOptions',
  props: {
    damageEffect: { type: Object, required: true },
  },
};
</script>