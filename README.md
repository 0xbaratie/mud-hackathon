# AW Hack

This is an onchain hackathon kit that utilizes MUD. The winner of the hackathon will be determined by voting utilizing the ERC721 (but Enumerable is required) on the deployed chain.

For detailed specifications of the hackathon, [click here.](https://komorebi88.notion.site/AW-Hack-doc-e82110e8c392409aadc3f5bee09239fc)

Although it is technically possible to use Lattice net, we recommend using Optimism testnet (or Optimism mainnet)

[**About Prizes]**

Hackathon owner can choose their winnings in one of the following tokens: ETH, DAI and USDC. Anyone can make a donation in advance before the hackathon takes place.

[**About Voting]**

There are two main types of voting. Basically, voting will be done using the ERC721 (with Enumerable)on the same chain that will be specified at the hackathon.

- Be sure to use the ERC721 with Enumerable as the ballot.
See below for detailed specifications
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol

sample code: https://goerli-optimism.etherscan.io/address/0x8366fbc573bf8b1113c99dee297cfe46e875d3db#code

- A hackathon owner can give the Wallet address the right to vote and the number of votes without having a pre-whitelist-like ballot.
(To be used when inviting special guests or judges).

[**About WalletConnect]**

Currently, only Metamask is supported; if you would like to know how to connect utilizing Metamask, please see below.

https://github.com/dubiella/mud-template-read-vite-metamask/tree/master/packages

## Get Started

**Setup an env file on client**

```markdown
cp packages/client/.env.sample packages/client/.env

```

```markdown
VITE_CHAIN_ID=420 #optimism goerli
VITE_ALCHEMY_ID=ALCHEMY_ID
VITE_PRIVATE_KEY=WALLET_PRIVATE_KEY
VITE_RPC_PROVIDER="https://optimism-goerli.publicnode.com"
VITE_ETH_PROVIDER="https://ethereum.publicnode.com"
```

**Setup an env file on contracts**

```markdown
cp packages/contracts/.env.sample packages/contracts/.env
```

```markdown
# This .env file is for demonstration purposes only.
#
# This should usually be excluded via .gitignore and the env vars attached to
# your deployment environment, but we're including this here for ease of local
# development. Please do not commit changes to this file!
#
# Anvil default private key:
PRIVATE_KEY=0x[YOUR PRIVATE KE]
```

**This will deploy smart contracts to a local chain and deploy the client. You can also deploy the contracts to the Optimism goerli by running**

```
cd packages/contracts && pnpm deploy:opgoerli

```

**You should return to the project home directory. This project uses pnpm workspaces. To install packages and run, simply run**

```
pnpm install
pnpm dev

```

### Configure Contracts

This project uses [MUD](https://mud.dev/), a solidity library and associated set of client libraries, for smart contracts & client-side onchain state syncing. For more info on MUD, look at [MUD](https://mud.dev/).

## Getting Help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.
