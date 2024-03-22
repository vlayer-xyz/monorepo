import { Hex } from 'viem';

export interface Proof {
  key: Hex;
  proof: Hex[];
  value: Hex;
}
