import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constant';
import myEpicGame from '../../utils/MyEpicGame.json';
import { Button } from 'react-bootstrap'
// import LoadingIndicator from "../LoadingIndicator/index"
import "../SelectCharacter/SelectCharacter.css"
const SelectCharacter = ({ setCharacterNFT }) => {

    // 设置合约初始化对象
    const [gameContract, setGameContract] = useState(null);

    const [mintingCharacter, setMintingCharacter] = useState(false);
    // UseEffect
    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            /*
            * This is the big difference. Set our gameContract in state.
            */
            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);


    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');
                /*
                * Call contract to get all mint-able characters
                */
                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn:', charactersTxn);

                /*
                * Go through all of our characters and transform the data
                */
                const characters = charactersTxn.map((characterData) =>
                transformCharacterData(characterData)
                );

                /*
                * Set all mint-able characters in state
                */
                setCharacters(characters);
            } catch (error) {
                console.error('Something went wrong fetching characters:', error);
            }
        };

        /*
         * If our gameContract is ready, let's get characters!
         */
        if (gameContract) {
            getCharacters();
        }
    }, [gameContract]);

    const [characters, setCharacters] = useState([]);

    // Render Methods
    const renderCharacters = () =>
    characters.map((character, index) => (
        <div className="character-item" key={character.name}>
            <div className="name-container">
            <p>{character.name}</p>
            </div>
            <img src={character.imageURI} alt={character.name} />
            <Button
            type="button"
            className="character-mint-button"
            onClick={()=> mintCharacterNFTAction(index)}
            >{`Mint ${character.name}`}</Button>
        </div>
    ));

    const mintCharacterNFTAction = async (characterId) => {
        try {
            if (gameContract) {
                setMintingCharacter(true);
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('mintTxn:', mintTxn);
                setMintingCharacter(false);
            }
        } catch (error) {
            console.warn('MintCharacterAction Error:', error);
            setMintingCharacter(false);
        }
    };

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose wisely.</h2>
            {characters.length > 0 && (
            <div className="character-grid">{renderCharacters()}</div>
            )}
            {/* Only show our loading state if mintingCharacter is true */}
            {mintingCharacter && (
            <div className="loading">
                <div className="indicator">
                {/* <LoadingIndicator /> */}
                <h1>loading</h1>
                <p>Minting In Progress...</p>
                </div>
                <img
                src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                alt="Minting loading indicator"
                />
            </div>
            )}
        </div>
        );
    };

export default SelectCharacter;