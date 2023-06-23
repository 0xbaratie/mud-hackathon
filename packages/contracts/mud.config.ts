import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    //TODO delete this table later
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
      keySchema: {
        owner: "address",
      },
      schema: {
        isActive: "bool",
      },
    },
    Hackathon: {
      schema: {
        name: "string",
        uri: "string",
        phase: "uint8",
        startTimestamp: "uint256",
        submitPeriod: "uint256",
        votingPeriod: "uint256",
        withdrawalPeriod: "uint256",
      },
    },
    HackathonPrize: {
      schema: {
        prizes: "uint256[]",
        deposit: "uint256",
      },
    },
    Submission: {
      keySchema: {
        hackathonId: "bytes32",
        submitter: "address",
      },
      schema: {
        name: "string",
        uri: "string",
        votes: "uint256",
      },
    },
    Vote: {
      keySchema: {
        hackathonId: "uint256",
        submitter: "address",
      },
      schema: {
        voted: "bool",
      },
    },
  },
});
