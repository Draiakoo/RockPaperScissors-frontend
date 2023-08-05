const chains = {
    1: "Ethereum mainnet",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    42: "Kovan",
    11155111: "Sepolia",
    137: "Polygon mainnet",
    80001: "Mumbai",
    43114: "Avalanche mainnet",
    43113: "Fuji",
    1088: "Andromeda mainnet",
    588: "Stardust",
    1313161554: "Aurora mainnet",
    1313161555: "Aurora testnet",
    56: "BSC mainnet",
    97: "BSC testnet",
    250: "Fantom mainnet",
    4002: "Fantom testnet",
    50: "XDC mainnet",
    51: "XDC testnet",
    9001: "Evmos mainnet",
    9001: "Evmos testnet",
    361: "Theta mainnet",
    365: "Theta testnet",
    314: "Filecoin mainnet",
    3141: "Filecoin Hyperspace",
    31415: "Filecoin Wallaby",
    31415926: "Filecoin Butterfly",
    66: "OKX",
    1284: "Moonbeam",
    1287: "Moonbeam testnet",
    100: "Gnosis",
    10200: "Gnosis testnet",
    42220: "Celo",
    44787: "Alfajores",
    62320: "Baklava",
    42161: "Arbitrum one",
    421613: "Arbitrum goerli",
    10: "Optimism",
    420: "Optimism goerli",
    30: "Rootstock",
    31: "Rootstock testnet",
}

const supportedChains = ["Sepolia"]

const supportedNetworksInfo = [
    {name: "Sepolia", chainId: "0xaa36a7"}
]

module.exports = {
    chains,
    supportedChains,
    supportedNetworksInfo
}
