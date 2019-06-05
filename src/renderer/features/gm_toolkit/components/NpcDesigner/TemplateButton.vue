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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import NPCTemplate from '../../logic/interfaces/NPCTemplate';

@Component
export default class SystemButton extends Vue {
    @Prop(Object) readonly template!: NPCTemplate;
    @Prop({default: false}) readonly closable!: boolean;
    @Prop({default: false}) readonly addable!: boolean;
    @Prop({default: false}) readonly disabled!: boolean;

}
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
