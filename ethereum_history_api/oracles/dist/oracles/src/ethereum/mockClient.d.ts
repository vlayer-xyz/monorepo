import { PublicClient } from 'viem';
import { Call } from './recordingClient.js';
export declare function createMockClient(filePath: string, resultModifier?: (call: Call) => Call): Promise<PublicClient>;
