// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;


import "./interfaces/IERC20.sol";


contract StakingWarmup {

    address public immutable staking;
    address public immutable sBRAVO;

    constructor ( address _staking, address _sBRAVO ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sBRAVO != address(0) );
        sBRAVO = _sBRAVO;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sBRAVO ).transfer( _staker, _amount );
    }
}
