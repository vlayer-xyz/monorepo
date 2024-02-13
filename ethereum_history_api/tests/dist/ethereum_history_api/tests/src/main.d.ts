import { type CompiledCircuit } from '@noir-lang/backend_barretenberg';
import { WitnessMap } from '@noir-lang/noir_js';
import { type InputMap } from '@noir-lang/noirc_abi';
export declare const circuit: CompiledCircuit;
export interface MainInputs extends InputMap {
    block_no: number;
    address: string[];
    state_root: string[];
}
export declare function readProof(path: string): Promise<Uint8Array>;
export declare function readWitnessMap(path: string): Promise<WitnessMap>;
export declare function readInputMap(path: string): Promise<InputMap>;
