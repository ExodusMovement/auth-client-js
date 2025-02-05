import { describe, expect, it } from "vitest";
import { AuthClient } from "../src/client";
import { isValidRequest, isValidRespond } from "../src/utils/validators";
import { disconnectSocket } from "./helpers/ws";

const metadataRequester = {
  name: "client (requester)",
  description: "Test Client as Requester",
  url: "www.walletconnect.com",
  icons: [],
};

describe("Validation", () => {
  describe("Request Validation", () => {
    it("Validates happy case", () => {
      const iat = new Date().toISOString();
      const exp = new Date(new Date().getTime() + 50000).toISOString();
      const isValid = isValidRequest({
        aud: "https://foo.bar.com/login",
        domain: "bar.com",
        chainId: "eip191:1",
        iat,
        nonce: "nonce",
        type: "eip4361",
        version: "1",
        exp,
      });

      expect(isValid).to.eql(true);
    });

    it("Validates bad case", () => {
      const isValid = isValidRequest({
        aud: "bad url",
        domain: "bar.com",
        chainId: "ei",
        iat: new Date().toISOString(),
        nonce: "nonce",
        type: "eip4361",
        version: "1",
        exp: new Date().toISOString(),
      });

      expect(isValid).to.eql(false);
    });
  });

  describe("Respond Validation", () => {
    it("Validates happy case", async () => {
      const id = 1;
      const client = await AuthClient.init({
        logger: console,
        relayUrl: process.env.TEST_RELAY_URL || "wss://staging.relay.walletconnect.com",
        projectId: process.env.TEST_PROJECT_ID!,
        storageOptions: {
          database: ":memory:",
        },
        metadata: metadataRequester,
      });

      await client.requests.set(1, {
        id: 1,
        message: "",
        requester: { publicKey: "" },
        cacaoPayload: {} as any,
      });

      const isValid = isValidRespond({ id, signature: {} as any }, client.requests);
      expect(isValid).to.eql(true);
      await disconnectSocket(client.core);
    });

    it("Validates bad case", async () => {
      const client = await AuthClient.init({
        logger: console,
        relayUrl: process.env.TEST_RELAY_URL || "wss://staging.relay.walletconnect.com",
        projectId: process.env.TEST_PROJECT_ID!,
        storageOptions: {
          database: ":memory:",
        },
        metadata: metadataRequester,
      });

      const isValid = isValidRespond({ id: 2, signature: {} as any }, client.requests);
      expect(isValid).to.eql(false);
      await disconnectSocket(client.core);
    });
  });
});
