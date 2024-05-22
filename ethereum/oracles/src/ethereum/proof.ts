import { Hex } from 'viem';

export interface Proof {
  key: Hex;
  value: Hex;
  proof: Hex[];
}
