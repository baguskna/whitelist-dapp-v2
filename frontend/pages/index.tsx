import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { abi, WHITELIST_CONTRACT_ADDRESS } from "../constants";

const Home: NextPage = () => {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState<boolean>(false);
  // loading is set to true when we are waiting for transactions to get mined
  const [loading, setLoading] = useState<boolean>(false);
  // numberOfWhitelisted keeps track of the number of people who have joined the whitelist
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState<number>(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef<Web3Modal | null>(null);

  const getProviderOrSigner: (
    needSigner?: boolean
  ) => Promise<
    providers.Web3Provider | providers.JsonRpcSigner | undefined
  > = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current?.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      // Chain Id 4 for Rinkeby Network
      if (chainId !== 4) {
        window.alert("Change the network to Rinkeby");
        throw new Error("Change the network to Rinkeby");
      }
      if (needSigner) {
        return web3Provider.getSigner();
      }
      return web3Provider;
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfAddressIsWhitelisted: () => Promise<void> = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await (signer as providers.JsonRpcSigner).getAddress();
      const _joinedWhitelist: boolean =
        await whitelistContract.whitelistAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.log(err);
    }
  };

  const getNumberOfWhitelisted: () => Promise<void> = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numOfWhitelisted: number =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet: () => Promise<void> = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  };

  const addAddressToWhitelist: () => Promise<void> = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  const renderButton: () => JSX.Element | undefined = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>You are already whitelisted</div>
        );
      } else if (loading) {
        return <div className={styles.description}>Loading...</div>;
      } else {
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      <button className={styles.button} onClick={connectWallet}>
        Connect your wallet
      </button>;
    }
  };

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
};

export default Home;
