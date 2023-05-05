import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import BasicPatientProfile from "../models/BasicPatientProfile.json" assert { type: "json" };




const models = [BasicPatientProfile];

 const SEED = Uint8Array.from({ length: 32 }, () => [1, 76, 79, 87, 205, 222, 92, 28, 36, 65, 221, 1, 34, 17, 180, 166, 91, 209, 77, 13, 138, 175, 221, 182, 162, 88, 91, 217, 25, 11, 221, 216]);


//const arr = [11, 76, 79, 87, 205, 222, 92, 28]


// let SEED = process.env.SEED;

// The seed must be provided as an environment variable
// if (!process.env.SEED) {
//     throw new Error("Missing SEED environment variable");
// }
//const seed = fromString(SEED, "base16");

// Create and authenticate the DID
const did = new DID({
    provider: new Ed25519Provider(SEED),
    resolver: getResolver(),
});

await did.authenticate();


// Connect to the local Ceramic node
const CERAMIC_CLIENT_URL =
    "http://localhost:7007";
const ceramic = new CeramicClient(CERAMIC_CLIENT_URL);
ceramic.did = did;
// Create a manager for the model
const manager = new ModelManager({ceramic});

// read in files from models directory
models.forEach(async (model) => {
    // Pass in schema name and json
    const schemaId = await manager.createSchema(model.title, model);

    // Create the definition using the created schema ID
    await manager.createDefinition(model.title, {
        name: model.title,
        description: model.description,
        schema: manager.getSchemaURL(schemaId),
    });

    await writeFile(
        new URL("create-model.json", import.meta.url),
        JSON.stringify(manager.toJSON())
    );
});

console.log("Encoded model written to scripts/create-model.json file");
