<template>
  <div class="no-print-break">
    <!-- Blank weapon slot -->
    <v-row v-if="blank"
      dense>
      <v-col>
        <div class="caption text-grey">WEAPON</div>
        <blank-line :height="28" />
      </v-col>
      <v-col cols="2">
        <div class="caption text-grey">TYPE</div>
        <blank-line :height="28" />
      </v-col>
      <v-col cols="1">
        <div class="caption text-grey">RANGE</div>
        <blank-line :height="28" />
      </v-col>
      <v-col cols="1">
        <div class="caption text-grey">DAMAGE</div>
        <blank-line :height="28" />
      </v-col>
    </v-row>
    <blank-line v-if="blank"
      :height="80"
      class="mt-1" />

    <!-- Populated weapon slot -->
    <div v-else
      class="px-1 pb-3">
      <v-row dense
        align="center">
        <v-col cols="auto"><v-icon icon="cc:weapon" /></v-col>
        <v-col cols="auto">
          <b class="heading h4"
            style="line-height: 0">{{ weapon.Name }}</b>
        </v-col>
        <v-col>
          <span class="text-overline"
            style="line-height: 0">
            {{ weapon.Source }} {{ weapon.Size }} {{ weapon.WeaponTypes.join('/') }}
          </span>
        </v-col>
        <v-col v-if="weapon.Uses"
          cols="auto">
          <v-icon v-for="n in weapon.getTotalUses(mech?.LimitedBonus || 0)"
            size="small"
            color="primary">
            mdi-hexagon-outline
          </v-icon>
        </v-col>
      </v-row>
      <div class="pl-7">
        <div v-if="showCollectedEffect"
          class="caption mb-2">{{ weapon.Profiles[0].Effect }}</div>
        <div v-for="p in weapon.Profiles"
          class="mb-n4">
          <div class="flavor-text text-black mt-n1"
            style="font-size: 16px">
            <span v-if="weapon.Profiles.length > 1 && p.Name"
              class="heading">
              {{ p.Name }}:&nbsp;
            </span>
            <b v-for="r in p.Range"
              class="px-1">
              <v-icon class="mt-n1"
                :icon="r.Icon" />
              {{ r.Text }}
            </b>
            <span v-if="p.Damage && p.Damage.length"
              class="pl-2 pr-1"><cc-slashes /></span>
            <b v-for="d in p.Damage">
              <v-icon class="mt-n1 mr-n2"
                :icon="d.Icon"
                :color="d.Color" />
              {{ d.Text }}
            </b>
            <div v-if="p.Effect && !showCollectedEffect"
              class="caption">{{ p.Effect }}</div>
            <div v-if="p.OnMiss"
              class="caption">
              <b>ON MISS:</b>
              {{ p.OnMiss.Detail }}
            </div>
            <div v-if="p.OnAttack"
              class="caption">
              <b>ON ATTACK:</b>
              {{ p.OnAttack.Detail }}
            </div>
            <div v-if="p.OnHit"
              class="caption">
              <b>ON HIT:</b>
              {{ p.OnHit.Detail }}
            </div>
            <div v-if="p.OnCrit"
              class="caption">
              <b>ON CRIT:</b>
              {{ p.OnCrit.Detail }}
            </div>
            <print-action :actions="p.Actions" />
            <print-deployable :deployables="p.Deployables" />
          </div>
          <tag-block v-if="options"
            :tags="p.Tags"
            :options="options"
            mech />
        </div>

        <v-card v-if="weapon.Mod"
          variant="outlined"
          color="mod"
          class="px-2 pb-1 mb-1">
          <div class="text-black">
            <span class="heading">
              {{ weapon.Mod.Name }}
            </span>
            <span class="text-cc-overline">&nbsp;//APPLIED MOD</span>
            <p v-if="weapon.Mod.Effect"
              v-html-safe="weapon.Mod.Effect"
              class="caption mt-n1"
              print />
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintWeaponSlot',
  props: {
    weapon: {
      type: Object,
      default: null
    },
    mech: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    blank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showCollectedEffect() {
      if (!this.weapon) return false
      return this.weapon.Profiles.length > 1 &&
        this.weapon.Profiles.every(p => p.Effect === this.weapon.Profiles[0].Effect)
    }
  }
}
</script>