<template>
    <v-card
        :class="`system--${system.type}--text`"
        style="max-height: 250px; overflow-y: hidden; cursor: pointer;"
        height="100%"
        v-ripple="{
            class: system.effect
                ? `system--${system.type}--text`
                : 'white--text',
        }"
        @click="dialog = true"
    >
        <v-card-title
            :class="`system--${system.type} white--text`"
            class="system-name"
            :style="{
                height: !(system.effect_short || system.effect)
                    ? '100%'
                    : 'auto',
            }"
        >
            {{ system.name }}
        </v-card-title>
        <v-card-text
            class="primary--text"
            v-if="system.effect_short || system.effect"
            style="overflow-y: hidden;"
        >
            {{ system.effect_short || system.effect }}
        </v-card-text>
        <v-dialog v-model="dialog" max-width="40%">
            <system-dialog-card :npc="npc" :system="system" />
        </v-dialog>
    </v-card>
</template>

<script>
import SystemDialogCard from '../SystemDialogCard.vue'

export default {
    name: 'system-card',
    components: { SystemDialogCard },
    data: () => ({ dialog: false }),
    props: { system: { type: Object, required: true }, npc: { type: Object } }
}
</script>

<style scoped>
.system-name {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    text-transform: uppercase;
    font-size: 0.9em;
    padding: 0.8em;
    justify-content: center;
    white-space: nowrap;
}
</style>
