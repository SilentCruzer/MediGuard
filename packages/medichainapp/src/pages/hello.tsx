import {CeramicClient} from "@ceramicnetwork/http-client";
import {Ed25519Provider} from "key-did-provider-ed25519";
import {DID} from "dids";
import { DIDSession } from 'did-session'
import {
    ChainId
} from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
// import {TileDocument} from "@ceramicnetwork/stream-tile";
import { DIDDataStore } from "@glazed/did-datastore";
import {TileLoader} from "@glazed/tile-loader";
import {DataModel} from "@glazed/datamodel";
import publishedModels from "../../schemas/models/BasicPatientProfile.json";
import {CeramicApi} from "@ceramicnetwork/common";
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import {getResolver} from "key-did-resolver";
import {useWeb3AuthContext} from "./SocialLoginContext";



type BasicHealthProfile = {
    dateOfBirth: string;
    gender: string;
    height: number;
    weight: number;

};

export type ModelTypes = {
    schemas: {
        BasicPatientProfile: BasicHealthProfile;

    };
    definitions: {
        BasicPatientProfile: "BasicHealthProfile"
    };
    tiles: {};
};




// const aliases = {
//     schemas: {
//         HealthProfile:BasicHealthProfile
//     };
//     definitions: {
//         HealthProfile: "BasicHealthProfile";
//     };
//     tiles: {};
// };

export default function About() {
    const API_URL = 'http://localhost:7007' ;
    const ceramic = new CeramicClient(API_URL);
    class  CeramicBase {
        did: DID;
        loader: TileLoader;
        ceramicClient: CeramicApi;
        model: DataModel<ModelTypes>;
        store: DIDDataStore<ModelTypes>;
        apiHost: string;

        constructor() {
            this.apiHost = 'http://localhost:7007' ;
            this.ceramicClient=new CeramicClient(this.apiHost);
        }


    }


    // till here is enough for read only access

    //@ts-ignore
    const SEED = Uint8Array.from({ length: 32 }, () => [1, 76, 79, 87, 205, 222, 92, 28, 36, 65, 221, 1, 34, 17, 180, 166, 91, 209, 77, 13, 138, 175, 221, 182, 162, 88, 91, 217, 25, 11, 221, 216]);




    InitCeramic(SEED);
    //CreateBasicPatientProfile();
    let ceramicBase ;

    async function InitCeramic(seed , aliases?:any) {
        //For write & Read
        const { provider, address } = useWeb3AuthContext();
        const ethProvider =  provider
        const addresses = await ethProvider.enable()
        const accountId = await getAccountId(ethProvider, addresses[0])
        console.log(accountId + "From accountId")
        const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
        const session = await DIDSession.authorize(authMethod, { resources: ['']})
        ceramicBase = new CeramicBase();
        ceramic.did = session.did
        // const ceramic = new CeramicClient();

        // const did = new DID({provider, resolver: getResolver()})
        // await did.authenticate()
        // ceramicBase.did = did

        // Activate the account by somehow getting its seed.
        // See further down this page for more details on
        // seed format, generation, and key management.
        //  this.provider = new Ed25519Provider(seed)
        // // Create the DID object
        //  this.did = new DID({this.provider, resolver: getResolver()})
        // // Authenticate with the provider
        // await this.did.authenticate()
        // // Mount the DID object to your Ceramic object
        // ceramic.did = did
        //
        const loader =  ceramicBase.loader = new TileLoader({ ceramic });
        const model = new DataModel({ ceramic, aliases: aliases ?? publishedModels });
        ceramicBase.model = new DataModel({ ceramic, aliases: aliases ?? publishedModels })
        const store = new DIDDataStore({loader, ceramic , model});
        ceramicBase.store = store ;
        //  this.model = new DataModel({ ceramic, aliases: aliases ?? publishedModels });
        //  this.store = new DIDDataStore({ this.loader, ceramic, this.model });
        // const doc = await TileDocument.create(ceramic, "Hello world")
        const NewPatientProfile : BasicHealthProfile = {
            dateOfBirth : '16-06-1991' ,
            gender : 'Male' ,
            height:180 ,
            weight: 89 ,


        }
        const stream = await ceramicBase.store.set('BasicPatientProfile', { ...NewPatientProfile });
        console.log(stream);

    }

    // const model = new DataModel({ ceramic, aliases: aliases ?? publishedModel });
    // const store = new DIDDataStore({ loader, ceramic, model });

    // const doc = await TileDocument.create(ceramic, "Hello world");
    // console.log(doc.id)

    // async function CreateBasicPatientProfile () {
    //
    //
    // }





    return (
        <div>hi</div>
    );
}


