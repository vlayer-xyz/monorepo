import assert from 'assert';
import { ChildProcess, spawn } from 'child_process';

let anvil: ChildProcess;

export function setup() {
  assert(anvil === undefined, 'Anvil already running');
  anvil = spawn('anvil');
}

export function teardown() {
  anvil.kill();
}
