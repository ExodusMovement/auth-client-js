import { hashMessage } from "@exodus/ethersproject-hash";
import { recoverAddress } from "@exodus/ethersproject-transactions";

import { AuthEngineTypes } from "../types";

export async function verifySignature(
  address: string,
  reconstructedMessage: string,
  cacaoSignature: AuthEngineTypes.CacaoSignature,
  chainId: string,
  projectId: string,
): Promise<boolean> {
  // Determine if this signature is from an EOA or a contract.
  switch (cacaoSignature.t) {
    case "eip191":
      return isValidEip191Signature(address, reconstructedMessage, cacaoSignature.s);
    case "eip1271":
      return await isValidEip1271Signature(
        address,
        reconstructedMessage,
        cacaoSignature.s,
        chainId,
        projectId,
      );
    default:
      throw new Error(
        `verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${cacaoSignature.t}`,
      );
  }
}

function isValidEip191Signature(address: string, message: string, signature: string): boolean {
  const recoveredAddress = recoverAddress(hashMessage(message), signature);
  return recoveredAddress.toLowerCase() === address.toLowerCase();
}

async function isValidEip1271Signature(
  _address: string,
  _reconstructedMessage: string,
  _signature: string,
  _chainId: string,
  _projectId: string,
): Promise<boolean> {
  throw new Error("isValidEip1271Signature disabled in Exodus fork");
}
