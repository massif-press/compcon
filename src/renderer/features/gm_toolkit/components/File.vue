<template>
    <v-btn
        class="file-btn"
        outline
        large
        :color="color"
        v-ripple="{ color: 'primary' }"
        @click="onClick"
    >
        <v-icon class="main-icon" left>{{ icon }}</v-icon>
        <div class="file-btn-text">{{ name }}</div>
        <div class="ml-auto">
            <slot name="extra-icons" />
        </div>
    </v-btn>
</template>

<script>
export default {
    props: {
        name: { type: String, required: true },
        icon: { type: String, default: 'mdi-file' },
        color: { type: String, default: 'secondary' },
        to: { type: String },
    },
    methods: {
        onClick() {
            if (this.to) this.$router.push(this.to);
        }
    }
}
</script>

<style>
.file-btn {
    display: flex;
    text-transform: none;
    font-size: 13px;
    border-radius: 6px;
    height: 50px;
    width: 100%;
    margin: 0;
    padding: 0;
    padding-right: 16px;
}

.file-btn:not(:hover) {
    border-color: rgb(218, 220, 224) !important;
}

.file-btn::before {
    color: transparent;
}

.file-btn-text {
    max-width: 150px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    line-height: 24px;
}

.file-btn .v-btn__content {
    justify-content: start;
}

.file-btn:not(:hover) .v-btn__content {
    color: rgba(0,0,0,.72) !important;
}

.file-btn .v-icon {
    margin-right: 0;
}

.file-btn .main-icon {
    padding: 12px 16px;
}

.file-btn:not(:hover) .main-icon {
    color: rgba(0,0,0,.50) !important;
}

.file-btn .more-icon {
    transition: 0.3s all cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.file-btn .more-icon:not(:hover) {
    color: rgba(0,0,0,.60) !important;
}

.more-list .v-list__tile__title {
    font-size: 15px !important;
}

</style>
