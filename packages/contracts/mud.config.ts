import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    //TODO delete Counter
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Administrator: {
      keySchema: {},
      schema: "address",
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
        winnerCount: "uint8", // prize is awarded to top N submitters
        name: "string",
        uri: "string",
        imageUri: "string",
      },
    },
    HackathonPrize: {
      schema: {
        deposit: "uint256",
        submitters: "address[]",
      },
    },
    HackathonVoteNft: {
      schema: {
        voteNft: "address",
        voteNftSnapshot: "uint64",
      },
    },
    Submission: {
      schema: {
        votes: "uint256",
        withdrawalPrize: "uint256",
        name: "string",
        description: "string",
        uri: "string",
        imageUri: "string",
      },
      keySchema: {
        hackathonId: "bytes32",
        submitter: "address",
      },
    },
    Vote: {
      schema: {
        count: "uint256",
        aggregated: "bool",
      },
      keySchema: {
        hackathonId: "bytes32",
        voter: "address",
      },
    },
  },
  enums: {
    Phase: ["NONE", "PREPARE_PRIZE", "HACKING", "VOTING", "WITHDRAWING", "END"],
  },
});
