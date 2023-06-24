import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Config: {
      keySchema: {},
      schema: {
        prizeToken: "address",
        maxHackathonId: "bytes32",
      },
    },
    Owner: {
      schema: {
        isActive: "bool",
      },
      keySchema: {
        owner: "address",
      },
    },
    Hackathon: {
      schema: {
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
        hackathonId: "uint256",
        voter: "address",
      },
    },
  },
});
