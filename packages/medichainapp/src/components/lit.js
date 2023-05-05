import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient();
const chain = "mumbai";

// Checks if the user has at least 0 ET

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encrypt(file) {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const ipfsCid = await LitJsSdk.encryptToIpfs({
      authSig,
      accessControlConditions,
      chain,
     file,
    //   file, // If you want to encrypt a file instead of a string
      litNodeClient: this.litNodeClient,
      infuraId: 'a00514dd87f5a98cb0d9',
      infuraSecretKey: '825f50a01bf1d3ad3095d4a87786257da56ded882797e4c0b448e9442d488598',
    });
    return ipfsCid;
}

async  decrypt(ipfsCid) {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const decryptedString = await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });
    return decryptedString;
}

  async encryptFile(file, address) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });

    const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain,
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address,
          },
        },
      ];

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });


    return {
      encryptedFile: encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decrypt(ipfsCid) {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const decryptedString = await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });

    return decryptedString;
}

  async decryptFile(encryptedFile, encryptedSymmetricKey, address) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain,
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address,
          },
        },
      ];

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });

    const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedFile,
        symmetricKey
    });
    return decryptedFile;
  }
}

export default new Lit();
