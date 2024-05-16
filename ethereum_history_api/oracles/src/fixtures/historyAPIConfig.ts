import { Address, Hex } from 'viem';

export const JS_FIXTURES_DIRECTORY = 'fixtures';
export const CIRCLE_USDC_BALANCE_STORAGE_KEY = '0x57d18af793d7300c4ba46d192ec7aa095070dde6c52c687c6d0d92fb8532b305';
export const UNISWAP_V3_USDC_BALANCE_STORAGE_KEY = '0x1f21a62c4538bacf2aabeca410f0fe63151869f172e03c0e00357ba26a341eff';
export const OWNER_OF_7TH_BORED_APE_STORAGE_KEY = '0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5add';
export const OWNER_OF_9TH_NOUN_STORAGE_KEY = '0x8a8dc4e5242ea8b1ab1d60606dae757e6c2cca9f92a2cced9f72c19960bcb458';
export const OWNER_OF_9TH_CRYPTO_PUNK_OF_STORAGE_KEY =
  '0x825eb4cda6b8b44578c55770496c59e6dc3cf2235f690bcdaf51a61898ceb284';
export const CHAIN_LINK_TRANSFER_TX_HASH = '0x98e19df80eb8feae436896cc7cc6d4a97818e6010b56a249352b9ac2caf0d573';
export const ETH_TRANSFER_TX_HASH = '0xfade98d8c3b7438655139080c33ccd0b1fc5d08b93dab0c3792d6c1001d56ddb';
export const ORACLIZE_TRANSFER_TX_HASH = '0x38f299591902bfada359527fa6b9b597a959c41c6f72a3b484807fbf52dc8abe';
export const TETHER_APPROVE_TX_HASH = '0xa799d5931eed84370b0d8917441d8c912a7e155d9a9a3ebcc0f5bf1a44e4dab6';

interface HistoryAPIFixture {
  blockNumber: bigint;
  skipHeader?: boolean;
  address?: Address;
  storageKeys?: Hex[];
  transactionHash?: Hex;
  logIdx?: number;
}

type HistoryAPIFixtures = Record<string, Record<string, Record<string, HistoryAPIFixture>>>;

export const HISTORY_API_FIXTURES: HistoryAPIFixtures = {
  mainnet: {
    frontier: {
      zero: {
        blockNumber: 0n,
        address: '0x756F45E3FA69347A9A973A725E3C98bC4db0b5a0'
      },
      first: {
        blockNumber: 1n,
        address: '0x40d45d9d7625d15156c932b771ca7b0527130958'
      }
    },
    homestead: {
      fork: {
        blockNumber: 1_150_000n,
        transactionHash: ORACLIZE_TRANSFER_TX_HASH
      }
    },
    london: {
      crypto_punks: {
        blockNumber: 14_194_126n,
        address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
        storageKeys: [OWNER_OF_9TH_CRYPTO_PUNK_OF_STORAGE_KEY]
      },
      vitalik_balance: {
        blockNumber: 12_965_000n,
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      }
    },
    paris: {
      usdc_circle: {
        blockNumber: 19_000_000n,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        storageKeys: [CIRCLE_USDC_BALANCE_STORAGE_KEY]
      },
      usdc_uniswap: {
        skipHeader: true,
        blockNumber: 19_000_000n,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        storageKeys: [UNISWAP_V3_USDC_BALANCE_STORAGE_KEY]
      },
      bored_ape_yacht_club: {
        blockNumber: 19_000_000n,
        address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        storageKeys: [OWNER_OF_7TH_BORED_APE_STORAGE_KEY]
      },
      nouns: {
        blockNumber: 19_000_000n,
        address: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
        storageKeys: [OWNER_OF_9TH_NOUN_STORAGE_KEY]
      }
    },
    cancun: {
      small_block: {
        blockNumber: 19_432_673n,
        transactionHash: CHAIN_LINK_TRANSFER_TX_HASH,
        logIdx: 0
      },
      with_blob: {
        blockNumber: 19_432_087n
      },
      access_list: {
        blockNumber: 19_439_366n
      },
      transfer: {
        skipHeader: true,
        blockNumber: 19_539_214n,
        transactionHash: ETH_TRANSFER_TX_HASH
      },
      approve: {
        blockNumber: 19_667_377n,
        transactionHash: TETHER_APPROVE_TX_HASH,
        logIdx: 0
      }
    }
  }
};
