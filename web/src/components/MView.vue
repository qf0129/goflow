<template>
    <div class="m-view">
        <div>
            <t-row align="center" :gutter="[10, 40]">
                <t-col>
                    <t-button v-if="!hideBack" theme="default" @click="clickBack">←</t-button>
                </t-col>
                <t-col :flex="1">
                    <slot name="title">
                        <h2 v-if="title">{{ title }}</h2>
                    </slot>
                </t-col>
                <t-col style="margin-right: 10px;">
                    <t-space>
                        <slot name="action" />
                    </t-space>
                </t-col>
            </t-row>
        </div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>

    const props = defineProps({
        title: { type: String },
        hideBack: { type: Boolean, default: false },
    });

    const clickBack = () => {
        window.history.back()
    }
</script>

<style lang="less" scoped>
    .m-view {
        padding: 20px;
    }
</style>