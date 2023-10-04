// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("SpecialVote")));
bytes32 constant SpecialVoteTableId = _tableId;

struct SpecialVoteData {
  uint256 count;
  bool used;
}

library SpecialVote {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.UINT256;
    _schema[1] = SchemaType.BOOL;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.BYTES32;
    _schema[1] = SchemaType.ADDRESS;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](2);
    _fieldNames[0] = "count";
    _fieldNames[1] = "used";
    return ("SpecialVote", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get count */
  function getCount(bytes32 hackathonId, address voter) internal view returns (uint256 count) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get count (using the specified store) */
  function getCount(IStore _store, bytes32 hackathonId, address voter) internal view returns (uint256 count) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set count */
  function setCount(bytes32 hackathonId, address voter, uint256 count) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((count)));
  }

  /** Set count (using the specified store) */
  function setCount(IStore _store, bytes32 hackathonId, address voter, uint256 count) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((count)));
  }

  /** Get used */
  function getUsed(bytes32 hackathonId, address voter) internal view returns (bool used) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get used (using the specified store) */
  function getUsed(IStore _store, bytes32 hackathonId, address voter) internal view returns (bool used) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set used */
  function setUsed(bytes32 hackathonId, address voter, bool used) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((used)));
  }

  /** Set used (using the specified store) */
  function setUsed(IStore _store, bytes32 hackathonId, address voter, bool used) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((used)));
  }

  /** Get the full data */
  function get(bytes32 hackathonId, address voter) internal view returns (SpecialVoteData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(
    IStore _store,
    bytes32 hackathonId,
    address voter
  ) internal view returns (SpecialVoteData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(bytes32 hackathonId, address voter, uint256 count, bool used) internal {
    bytes memory _data = encode(count, used);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(IStore _store, bytes32 hackathonId, address voter, uint256 count, bool used) internal {
    bytes memory _data = encode(count, used);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 hackathonId, address voter, SpecialVoteData memory _table) internal {
    set(hackathonId, voter, _table.count, _table.used);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 hackathonId, address voter, SpecialVoteData memory _table) internal {
    set(_store, hackathonId, voter, _table.count, _table.used);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (SpecialVoteData memory _table) {
    _table.count = (uint256(Bytes.slice32(_blob, 0)));

    _table.used = (_toBool(uint8(Bytes.slice1(_blob, 32))));
  }

  /** Tightly pack full data using this table's schema */
  function encode(uint256 count, bool used) internal view returns (bytes memory) {
    return abi.encodePacked(count, used);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 hackathonId, address voter) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 hackathonId, address voter) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 hackathonId, address voter) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = hackathonId;
    _keyTuple[1] = bytes32(uint256(uint160(voter)));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}

function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}