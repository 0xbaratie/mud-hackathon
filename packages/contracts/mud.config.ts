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
      },
    },
    HackathonInfo: {
      schema: {
        name: "string",
        uri: "string",
        imageUri: "string",
        description: "string",
      },
    },
    HackathonPrize: {
      schema: {
        deposit: "uint256",
        submitters: "address[]",
      },
    },
    HackathonPrizeSponsor: {
      schema: {
        amounts: "uint256[]",
        sponsors: "address[]",
      },
    },
    HackathonVoteNft: {
      schema: {
        voteNft: "address",
        specialVoters: "address[]",
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
        voter: "address",
      },
      keySchema: {
        hackathonId: "bytes32",
        tokenId: "uint256",
      },
    },
    SpecialVote: {
      schema: {
        count: "uint256",
      },
      keySchema: {
        hackathonId: "bytes32",
        voter: "address",
      },
    }
  },
  enums: {
    Phase: ["NONE", "PREPARE_PRIZE", "HACKING", "VOTING", "WITHDRAWING", "END"],
  },
  costants: {
    ETH_ADDRESS: "0x00",
  },
});
