<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  isJoinsDisabled,
  usePoolHelpers,
  deprecatedDetails,
} from '@/composables/usePoolHelpers';
import useNetwork from '@/composables/useNetwork';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import { Goals, trackGoal } from '@/composables/useFathom';
import { useDisabledJoinPool } from '@/composables/useDisabledJoinPool';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { usePoolWarning } from '@/composables/usePoolWarning';
import { PoolWarning } from '@/types/pools';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'risksClicked'): void;
}>();

/**
 * COMPOSABLES
 */
const { isMigratablePool, hasNonApprovedRateProviders } = usePoolHelpers(
  toRef(props, 'pool')
);
const { isWalletReady, startConnectWithInjectedProvider, account } = useWeb3();
const { networkSlug } = useNetwork();
const { shouldDisableJoins } = useDisabledJoinPool(props.pool);
const { balanceFor } = useTokens();
const { isAffectedBy } = usePoolWarning(computed(() => props.pool.id));

/**
 * COMPUTED
 */
const hasBpt = computed((): boolean =>
  bnum(balanceFor(props.pool.address)).gt(0)
);
const joinDisabled = computed(
  (): boolean =>
    !!deprecatedDetails(props.pool.id) ||
    isJoinsDisabled(props.pool.id) ||
    hasNonApprovedRateProviders.value ||
    isMigratablePool(props.pool) ||
    shouldDisableJoins.value ||
    (props.pool.id ===
      '0xcacc06ea569e239d0e4b718e4da1b456d49e06f6000200000000000000000019' &&
      account.value.toLowerCase() !==
        '0x510b92c476fc53b5514033c3d73805deb1824337'.toLowerCase())
  // (props.pool.id ===
  //   '0xcf29825dfe41e62e218baa10b791a3d087fa7a83000200000000000000000018' &&
  //   account.value !== '0x510b92c476fc53b5514033c3d73805deb1824337')
);
</script>

<template>
  <div
    class="p-4 w-full bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-900"
  >
    <BalBtn
      v-if="!isWalletReady"
      :label="$t('connectWallet')"
      color="gradient"
      block
      @click="startConnectWithInjectedProvider"
    />
    <div v-else>
      <div class="grid grid-cols-2 gap-2">
        <BalBtn
          :tag="joinDisabled ? 'div' : 'router-link'"
          :to="{ name: 'add-liquidity', params: { networkSlug } }"
          :label="$t('addLiquidity')"
          color="gradient"
          :disabled="joinDisabled"
          block
          @click="trackGoal(Goals.ClickAddLiquidity)"
        />

        <BalBtn
          v-if="isAffectedBy(PoolWarning.CspPoolVulnWarning)"
          tag="router-link"
          :to="{ name: 'recovery-exit', params: { networkSlug } }"
          :label="$t('withdraw.label')"
          :disabled="!hasBpt"
          color="blue"
          outline
          block
        />
        <BalBtn
          v-else
          :tag="hasBpt ? 'router-link' : 'div'"
          :to="{ name: 'withdraw', params: { networkSlug } }"
          :label="$t('withdraw.label')"
          :disabled="!hasBpt"
          color="blue"
          outline
          block
          @click="trackGoal(Goals.ClickWithdraw)"
        />
      </div>
      <div class="pt-4 text-xs text-secondary">
        {{ $t('poolTransfer.myPoolBalancesCard.risksDisclaimer') }}

        <a class="font-medium link" @click="emit('risksClicked')">
          {{ $t('poolTransfer.myPoolBalancesCard.poolsRisks') }} </a
        >.
      </div>
    </div>
  </div>
</template>
