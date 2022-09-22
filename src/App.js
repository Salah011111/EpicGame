// eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
// import { Button } from 'react-bootstrap'
import SelectCharacter from './components/SelectCharacter/index';
import Arena from './components/Arena/index'
import { CONTRACT_ADDRESS ,transformCharacterData  } from '../src/constant';
import myEpicGame from './utils/MyEpicGame.json';
// import LoadingIndicator from './components/LoadingIndicator/index';
// Constants
// eslint-disable-next-line
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null); 

  // const [isLoading, setIsLoading] = useState(false);
  // Actions

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      console.log('ethereum ',ethereum)
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        // setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
        // setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    // if (isLoading) {
    //   // return <LoadingIndicator />;
    //   return (
    //     <h1>loading</h1>
    //   )
    // }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount}/>;
    }
  };

  // 检查网络
  const checkNetwork = async () => {
    try {
      // if (window.ethereum.networkVersion !== '4') {
      //   alert("Please connect to Rinkeby!")
      // }
      const provider = window.ethereum;
      const chainId = await provider.request({ method: 'eth_chainId' });

        const rinkebyId = '0x4'

        if(chainId !== rinkebyId){
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: rinkebyId }],
          });
        }

    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // setIsLoading(true);
    checkNetwork();
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(characterNFT));
      }

      /*
      * Once we are done with all the fetching, set loading state to false
      */
      // setIsLoading(false);

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {/* This is where our button and image code used to be!
           *	Remember we moved it into the render method.
           */}
          {renderContent()}
        </div>
        <div className="footer-container">
          {/* <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /> */}
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;