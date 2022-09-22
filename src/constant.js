const CONTRACT_ADDRESS = '0xE80B5A22FcF1854F52602DC8469124517bfB8A43';

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};


export { CONTRACT_ADDRESS , transformCharacterData };