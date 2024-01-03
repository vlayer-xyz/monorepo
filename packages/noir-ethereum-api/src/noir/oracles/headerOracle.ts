import { ForeignCallOutput } from "@noir-lang/noir_js";
import { BlockHeader, encodeBlockHeader } from "../../ethereum/blockHeader.js";
import { encodeField, encodeHex } from "../encode.js";
import { padArrayRight } from "../../arrays.js";


export const MAX_HEADER_RLP_SIZE = 708;

export function encodeBlockHeaderPartial(header: BlockHeader) : ForeignCallOutput[] {
  const stateRoot = encodeHex(header.stateRoot);
  const transactionsRoot = encodeHex(header.transactionsRoot);
  const receiptsRoot = encodeHex(header.receiptsRoot);
  const number = header.number;
  const hex = encodeBlockHeader(header);
  const bytes = encodeHex(hex);
  const encoded = padArrayRight(bytes, MAX_HEADER_RLP_SIZE, "0x");
  const encoded_len = encodeField(encoded.length);
  return [stateRoot, transactionsRoot, receiptsRoot, number, encoded_len, encoded];
}
