<script setup lang="ts">
import StakedPoolsTable from '@/components/contextual/pages/pools/StakedPoolsTable.vue';
import StakedPointsPoolsTable from '@/components/contextual/pages/pools/StakedPointsPoolsTable.vue';
import UnstakedPoolsTable from '@/components/contextual/pages/pools/UnstakedPoolsTable.vue';
import VeBalPoolTable from '@/components/contextual/pages/pools/VeBalPoolTable.vue';
import PortfolioPageHero from '@/components/heros/PortfolioPageHero.vue';
import { useLock } from '@/composables/useLock';
import { providerUserPools } from '@/providers/local/user-pools.provider';
import { provideUserStaking } from '@/providers/local/user-staking.provider';
import UserInvestedInAffectedPoolAlert from '@/pages/recovery-exit/UserInvestedInAffectedPoolAlert.vue';
import { isVeBalSupported } from '@/composables/useVeBAL';
import { configService } from '@/services/config/config.service';

/**
 * PROVIDERS
 */
const userStaking = provideUserStaking();
providerUserPools(userStaking);

const isPointsSupported = computed(
  () => configService.network.pools.PointsGauges
);

/**
 * COMPOSABLES
 */
const { lockPool, lock } = useLock();
</script>

<template>
  <div>
    <PortfolioPageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <UserInvestedInAffectedPoolAlert />
        <div class="px-4 xl:px-0">
          <BalStack horizontal justify="between" align="center">
            <h3>{{ $t('myLiquidityInBalancerPools') }}</h3>
          </BalStack>
        </div>
        <BalStack vertical spacing="2xl">
          <UnstakedPoolsTable />
          <StakedPointsPoolsTable v-if="isPointsSupported" />
          <StakedPoolsTable v-if="isVeBalSupported" />
          <VeBalPoolTable
            v-if="lockPool && Number(lock?.lockedAmount) > 0"
            :lock="lock"
            :lockPool="lockPool"
          />
        </BalStack>
      </BalStack>
    </div>
  </div>
</template>
