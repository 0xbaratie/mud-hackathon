import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    //TODO delete Counter
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Config: {
      keySchema: {},
      schema: {
        maxHackathonId: "bytes32",
      },
    },
    Hackathon: {
      schema: {
        owner: "address",
        prizeToken: "address",
        phase: "uint8",
        startTimestamp: "uint256",
        submitPeriod: "uint256",
        votingPeriod: "uint256",
        withdrawalPeriod: "uint256",
        prizeRank: "uint8", // prize is awarded to top N submitters
        name: "string",
        uri: "string",
      },
    },
    HackathonPrize: {
      schema: {
        deposit: "uint256",
        submitters: "address[]",
      },
    },
    Submission: {
      schema: {
        votes: "uint256",
        withdrawalPrize: "uint256",
        name: "string",
        uri: "string",
      },
      keySchema: {
        hackathonId: "bytes32",
        submitter: "address",
      },
    },
    Vote: {
      schema: {
        voted: "bool",
      },
      keySchema: {
        hackathonId: "bytes32",
        tokenId: "uint256",
      },
    },
  },
});
