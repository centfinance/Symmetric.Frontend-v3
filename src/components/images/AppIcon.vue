<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();

// const slug = useNetwork().networkSlug;

/**
 * COMPUTED
 */
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <img
    v-if="useDarkLogo"
    src="~@/assets/images/logo.svg"
    width="30"
    class="mr-2"
  />
  <img v-else src="~@/assets/images/logo.svg" width="30" class="mr-2" />
</template>
