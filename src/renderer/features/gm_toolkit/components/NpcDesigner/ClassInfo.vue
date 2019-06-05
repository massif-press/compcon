<template>
    <v-card>
        <v-card-title :class="color" class="white--text"
            ><h1 class="headline text-uppercase text-sm-center">
                {{ cls.name }}
            </h1></v-card-title
        >
        <v-card-text class="text-sm-center">
            <div>
                <i>{{ cls.info.flavor }}</i>
            </div>
            <v-divider class="my-3" />
            <h1 class="title mb-2">Tactics</h1>
            <div>
                <p>{{ cls.info.tactics }}</p>
            </div>
            <h1 class="title mb-2">Systems</h1>
            <div>
                <h1 class="body-2 mb-1">Base</h1>
                <v-layout px-5 wrap justify-center grow-shrink-0>
                    <v-flex v-for="system in baseSystems" :key="system.name">
                        <system-card :system="system" />
                    </v-flex>
                </v-layout>
                <h1 class="body-2 mt-3 mb-1">Optional</h1>
                <v-layout px-5 wrap justify-center grow-shrink-0>
                    <v-flex
                        v-for="system in optionalSystems"
                        :key="system.name"
                    >
                        <system-card :system="system" />
                    </v-flex>
                </v-layout>
            </div>
        </v-card-text>
        <v-divider class="my-1" />
        <v-card-actions class="mb-1">
            <v-spacer />
            <v-btn flat :color="color" @click="$emit('chosen')">
                Choose
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import NPCClass from '../../logic/interfaces/NPCClass';
import { NPCSystem } from '../../logic/interfaces/NPCSystem';
import SystemCard from '../../components/NpcDesigner/SystemButton.vue'

const allSystems: NPCSystem.Any[] = require('../../static/systems.json');

@Component({
    components: { SystemCard }
})
export default class ClassInfo extends Vue {
    @Prop() cls!: NPCClass;
    get color() {
        if (!this.cls) return 'primary'
        else return `role--${this.cls.role}`
    }

    get baseSystems() {
        return allSystems.filter(s => s.class === this.cls.name && s.base)
    }

    get optionalSystems() {
        return allSystems.filter(s => s.class === this.cls.name && !s.base)
    }

}
</script>