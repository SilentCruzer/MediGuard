import {CeramicClient} from "@ceramicnetwork/http-client";
import {Ed25519Provider} from "key-did-provider-ed25519";
import {DID} from "dids";
import {getResolver} from "key-did-resolver";
import {TileDocument} from "@ceramicnetwork/stream-tile";

// import { ModelManager } from '@glazed/devtools'
// import { model as basicProfileModel } from '@datamodels/identity-profile-basic'
export async  function UseCeramic ()
{

        //configure with your API_URL with
        const API_URL = ''
        const ceramic = new CeramicClient(API_URL)
     // till here is enough for read only access



    async function CreateDocument(seed) {
        //For write & Read

        // Activate the account by somehow getting its seed.
        // See further down this page for more details on
        // seed format, generation, and key management.
        const provider = new Ed25519Provider(seed)
        // Create the DID object
        const did = new DID({provider, resolver: getResolver()})
        // Authenticate with the provider
        await did.authenticate()
        // Mount the DID object to your Ceramic object
        ceramic.did = did

        const doc = await TileDocument.create(ceramic, "Hello world")

    }

}
