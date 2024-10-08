<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useNumbers from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';

import Summary from './components/Summary.vue';
import TokenAmounts from '@/components/forms/pool_actions/shared/TokenAmounts.vue';
import Actions from './components/Actions.vue';
import { useJoinPool } from '@/providers/local/join-pool.provider';
import { useIntervalFn } from '@vueuse/shared';
import { oneSecondInMs } from '@/composables/useTime';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
};

type AmountMap = {
  [address: string]: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'showStakeModal'): void;
  (e: 'showStakePointsModal'): void;
}>();

/**
 * STATE
 */
const confirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { getToken } = useTokens();
const { toFiat } = useNumbers();
const {
  isSingleAssetJoin,
  amountsIn,
  bptOut,
  fiatValueIn,
  fiatValueOut,
  priceImpact,
  highPriceImpact,
  rektPriceImpact,
  isLoadingQuery,
  txInProgress,
  queryJoinQuery,
  missingPricesIn,
  resetAmounts,
} = useJoinPool();

/**
 * COMPUTED
 */
const title = computed((): string =>
  confirmed.value
    ? t('investment.preview.titles.confirmed')
    : t('investment.preview.titles.default')
);

const showTokensOut = computed<boolean>(
  () => !!Object.keys(tokenOutMap.value).length
);

const amountInMap = computed((): AmountMap => {
  const amountMap = {};
  amountsIn.value.forEach(amountIn => {
    amountMap[amountIn.address] = amountIn.value;
  });
  return amountMap;
});

const amountOutMap = computed((): AmountMap => {
  const amountMap = {
    [props.pool.address]: bptOut.value,
  };
  return amountMap;
});

const tokenInMap = computed((): TokenInfoMap => {
  const tokenMap = {};
  Object.keys(amountInMap.value).forEach(address => {
    tokenMap[address] = getToken(address);
  });
  return tokenMap;
});

const tokenOutMap = computed((): TokenInfoMap => {
  const tokenMap = {
    [props.pool.address]: getToken(props.pool.address),
  };
  return tokenMap;
});

const fiatAmountInMap = computed((): AmountMap => {
  const fiatAmountMap = {};
  Object.keys(amountInMap.value).forEach(address => {
    fiatAmountMap[address] = toFiat(amountInMap.value[address], address);
  });
  return fiatAmountMap;
});

const fiatAmountOutMap = computed((): AmountMap => {
  if (!fiatValueOut.value) return {};
  const fiatAmountMap = {
    [props.pool.address]: fiatValueOut.value,
  };
  return fiatAmountMap;
});

const fiatTotalOut = computed((): string =>
  Object.values(fiatAmountOutMap.value).reduce(
    (total, amount) => bnum(total).plus(amount).toString(),
    '0'
  )
);

/**
 * METHODS
 */
function handleClose(): void {
  if (confirmed.value) {
    resetAmounts();
    confirmed.value = false;
  }
  emit('close');
}

function handleShowStakeModal() {
  handleClose();
  emit('showStakeModal');
}

function handleShowStakePointsModal() {
  handleClose();
  emit('showStakePointsModal');
}

/**
 * WATCHERS
 */
// Every 10s we should re-trigger queryJoin in case the expected output
// has changed as a result of pool state changing. This should only happen in
// the preview modal, not at the JoinPoolProvider level.
//
// Originally we did it every block but this is overfetching on short blocktime
// networks like Polygon.
useIntervalFn(() => {
  if (!isLoadingQuery.value && !txInProgress.value) {
    queryJoinQuery.refetch();
  }
}, oneSecondInMs * 10);
</script>

<template>
  <BalModal show :fireworks="confirmed" @close="handleClose">
    <template #header>
      <div class="flex items-center">
        <BalCircle
          v-if="confirmed"
          size="8"
          color="green"
          class="mr-2 text-white"
        >
          <BalIcon name="check" />
        </BalCircle>
        <h4>
          {{ title }}
        </h4>
      </div>
    </template>

    <TokenAmounts
      :title="$t('investment.preview.titles.tokenIn')"
      :amountMap="amountInMap"
      :tokenMap="tokenInMap"
      :fiatAmountMap="fiatAmountInMap"
      :fiatTotal="fiatValueIn"
      :hideAmountShare="isSingleAssetJoin"
    />
    <TokenAmounts
      v-if="showTokensOut"
      showZeroAmounts
      :title="$t('investment.preview.titles.tokenOut')"
      class="mt-4"
      :amountMap="amountOutMap"
      :tokenMap="tokenOutMap"
      :fiatAmountMap="fiatAmountOutMap"
      :fiatTotal="fiatTotalOut"
      hideAmountShare
    />

    <BalAlert
      v-if="missingPricesIn"
      type="warning"
      :title="$t('noPriceInfo')"
      class="mt-4"
      block
    />

    <Summary
      :pool="pool"
      :fiatTotal="missingPricesIn ? '-' : fiatValueIn"
      :priceImpact="priceImpact"
      :highPriceImpact="highPriceImpact"
    />

    <BalAlert
      v-if="rektPriceImpact"
      type="error"
      :title="$t('investment.error.rektPriceImpact.title')"
      :description="$t('investment.error.rektPriceImpact.description')"
      class="mt-6 mb-2"
    />

    <Actions
      :pool="pool"
      class="mt-4"
      @success="confirmed = true"
      @show-stake-modal="handleShowStakeModal"
      @show-stake-points-modal="handleShowStakePointsModal"
    />
  </BalModal>
</template>
