<template>
    <v-container fluid px-5>
        <v-card>
            <v-card-title
             primary-title
             :style="{ backgroundColor: colors[item.data_type].light }"
             class="white--text"
            >
                <div class="headline">{{ item.name }}</div>
                <v-chip disabled outline label color="white" class="text-uppercase ml-4">
                      {{item.data_type}}
                </v-chip>
                <v-chip disabled outline label color="white" class="text-uppercase ml-2">
                      {{item.source}}
                      <span v-if="item.license_level">&nbsp;RANK {{item.license_level}}</span>
                      <span v-if="item.data_type === 'frame' && item.id !== 'everest'">&nbsp;RANK 2</span>
                </v-chip>
            </v-card-title>
            <v-card-text>
                <p class="fluff-text grey--text" v-if="item.description" v-html="item.description"></p>
                <p v-if="item.effect" v-html="item.effect"></p>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import colors from '@/components/UI/CCColors.ts'

export default Vue.extend({
    name: 'compendium-item',
    data: () => ({
        colors: colors.colors,
    }),
    computed: {
        validResults(): CCItem[] {
          return _.flatten(
              _.values(
            _.pick(this.$store.state.datastore as object, ['Frames', 'MechSystems', 'MechWeapons', 'WeaponMods']),
              ),
          )
        },
        item(): CCItem | undefined {
            const { type, id } = this.$route.params
            return this.validResults.find((i) => (i.data_type === type && i.id === id))
        },
    },
    methods: {
        getStaticPath(path: string) {
            return `static/${path}`
        },
    },
})
</script>