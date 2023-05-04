
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { Button } from "antd";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
import SmartAccount from "@biconomy/smart-account";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { setWalletAddress, setWeb3Provider } from "../stores/mainSlice";

const Home = () => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(
    null
  );

  const router = useRouter();
  const dispatch = useDispatch();
  

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;
    console.log("socialLoginSDK", socialLoginSDK);
    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);
      dispatch(setWalletAddress(accounts[0]));
      dispatch(setWeb3Provider(web3Provider));
      router.push('/');
      return;
    }
    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      return socialLoginSDK;
    }
    const sdk = new SocialLogin();
    await sdk.init({
      chainId: ethers.utils.hexValue(80001),
    });
    setSocialLoginSDK(sdk);
    sdk.showWallet();
    return socialLoginSDK;
  }, [socialLoginSDK]);

  // if wallet already connected close widget
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  // after metamask login -> get provider event
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
    setScwAddress("");
  };

  useEffect(() => {
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const smartAccount = new SmartAccount(provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);
      setScwLoading(false);
    }
    if (!!provider && !!account) {
      setupSmartAccount();
      console.log("Provider...", provider);
    }
  }, [account, provider]);

  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          {!account ? (
            <Button
              className="bg-black !text-white !border-none w-44 hover:bg-slate-700"
              type="default"
              size="large"
              onClick={!account ? connectWeb3 : disconnectWeb3}
            >
              Let&apos;s go!
            </Button>
          ) : (
            <Button
              className="bg-white !text-black !border-black w-44 hover:bg-slate-200"
              type="default"
              size="large"
              onClick={!account ? connectWeb3 : disconnectWeb3}
            >
              Okay Bye 👋
            </Button>
          )}
        </div>

        {account && (
          <div>
            <h2>EOA Address</h2>
            <p>{account}</p>
          </div>
        )}

        {scwLoading && <h2>Loading Smart Account...</h2>}

        {scwAddress && (
          <div>
            <h2>Smart Account Address</h2>
            <p>{scwAddress}</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;