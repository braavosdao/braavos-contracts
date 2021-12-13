// SPDX-License-Identifier: AGPL-3.0-or-later\
pragma solidity 0.7.5;

import "./interfaces/IERC20.sol";

import "./libraries/SafeMath.sol";

contract CirculatingSupply {
    using SafeMath for uint;

    bool public isInitialized;

    address public BRAVO;
    address public owner;
    address[] public nonCirculatingBRAVOAddresses;

    constructor( address _owner ) {
        owner = _owner;
    }

    function initialize( address _BRAVO ) external returns ( bool ) {
        require( msg.sender == owner, "caller is not owner" );
        require( isInitialized == false );

        BRAVO = _BRAVO;

        isInitialized = true;

        return true;
    }

    function BRAVOCirculatingSupply() external view returns ( uint ) {
        uint _totalSupply = IERC20( BRAVO ).totalSupply();

        uint _circulatingSupply = _totalSupply.sub( getNonCirculatingBRAVO() );

        return _circulatingSupply;
    }

    function getNonCirculatingBRAVO() public view returns ( uint ) {
        uint _nonCirculatingBRAVO;

        for( uint i=0; i < nonCirculatingBRAVOAddresses.length; i = i.add( 1 ) ) {
            _nonCirculatingBRAVO = _nonCirculatingBRAVO.add( IERC20( BRAVO ).balanceOf( nonCirculatingBRAVOAddresses[i] ) );
        }

        return _nonCirculatingBRAVO;
    }

    function setNonCirculatingBRAVOAddresses( address[] calldata _nonCirculatingAddresses ) external returns ( bool ) {
        require( msg.sender == owner, "Sender is not owner" );
        nonCirculatingBRAVOAddresses = _nonCirculatingAddresses;

        return true;
    }

    function transferOwnership( address _owner ) external returns ( bool ) {
        require( msg.sender == owner, "Sender is not owner" );

        owner = _owner;

        return true;
    }
}
