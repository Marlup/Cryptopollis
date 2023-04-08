// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
/**
 * @title DataStructures
 * @dev Custom data structures.
 */
struct PollBody {
    string question;
    uint openDate;
    uint closeDate;
    uint nTotalVotes;
}
struct Option {
    string option;
    uint nVotes;
}
struct Voter {
    uint votingDate;
    uint optionIndex;
}
