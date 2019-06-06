<template>
    <v-chip
        class="system-chip"
        v-ripple="!disabled"
        label
        outline
        color="template"
        :class="{ 'template-disabled': disabled }"
    >
        <!-- <v-icon left small>{{ icon }}</v-icon> -->
        {{ template.name }}
        <v-icon
            class="rightbtn"
            size="24"
            right
            v-if="closable"
            @click.stop="$emit('close')"
        >
            mdi-minus-box
        </v-icon>
        <v-icon
            class="rightbtn"
            size="24"
            right
            v-if="addable && !disabled"
            @click.stop="$emit('add')"
        >
            mdi-plus-box
        </v-icon>
    </v-chip>
</template>

<script lang="ts">
import Vue from 'vue';
import NPCTemplate from '../../logic/interfaces/NPCTemplate';

export default Vue.extend({
    props: {
        template: { type: Object, required: true },
        closable: { type: Boolean, default: false },
        addable: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    }
})
</script>

<style>
.v-chip.system-chip {
    padding: 0.1em 0.5em;
    text-transform: uppercase;
    font-size: 0.85em;
}
.v-chip.system-chip * {
    cursor: pointer !important;
}
.v-chip.system-chip:focus {
    box-shadow: none !important;
}
.v-chip.system-chip:focus::after {
   display: none;
}

.v-chip .rightbtn:hover {
    opacity: 0.7 !important;
}
.v-chip.template-disabled {
    opacity: 0.5 !important;
}
</style>
