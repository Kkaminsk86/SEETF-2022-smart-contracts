// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface DuperSuperSafeSafe {
    function changeOwner(address _newOwner) external;
}

contract DuperChangeOwner {
    constructor(address _duperSuperSafeSafe, address _newOwner) {
        DuperSuperSafeSafe(_duperSuperSafeSafe).changeOwner(_newOwner);
    }
}
