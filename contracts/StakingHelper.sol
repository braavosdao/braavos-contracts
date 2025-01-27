// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';
import './interfaces/IStaking.sol';

contract StakingHelper {
    address public immutable staking;
    address public immutable BRAVO;

    constructor(address _staking, address _BRAVO) {
        require(_staking != address(0));
        staking = _staking;
        require(_BRAVO != address(0));
        BRAVO = _BRAVO;
    }

    function stake(uint256 _amount, address _recipient) external {
        IERC20(BRAVO).transferFrom(msg.sender, address(this), _amount);
        IERC20(BRAVO).approve(staking, _amount);
        IStaking(staking).stake(_amount, _recipient);
        IStaking(staking).claim(_recipient);
    }
}
