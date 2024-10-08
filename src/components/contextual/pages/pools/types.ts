export type UserGaugeShare = {
  id: string;
  gauge: {
    poolId: string;
    id?: string;
  };
  balance: string;
};

export type LiquidityGauge = {
  id?: string;
  poolId: string;
  shares: {
    balance: string;
  }[];
};

export type UserGaugeSharesResponse = {
  gaugeShares: UserGaugeShare[];
  liquidityGauges: LiquidityGauge[];
};

export type PoolStakingDataResponse = {
  liquidityGauge: LiquidityGauge;
};

export enum PoolAction {
  Add = 'add',
  Remove = 'remove',
  Stake = 'stake',
  Unstake = 'unstake',
  StakeForPoints = 'stakeForPoints',
  UnstakeForPoints = 'unstakeForPoints',
  MigrateGauge = 'migrateGauge',
  Poke = 'poke',
}
