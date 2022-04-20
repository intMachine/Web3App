// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract CrazyBearzz is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    mapping(address => bool) public excludedList;
    uint excludedCounter = 0;

    struct Trade {
        uint256 index;
        address poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;
    uint public tradeCounter = 0;

    uint public constant MAX_SUPPLY = 100;
    uint public PRICE = 0.01 ether;
    uint public constant MAX_PER_MINT = 3;
    mapping(uint256 => bool) public onSale;

    mapping(string => uint8) public existingURIs;
    Counters.Counter private _tokenIdCounter;
    string public baseTokenURI = "ipfs://ipQmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/";

    constructor() ERC721("CrazyBearzz", "CB") {}

    function setPrice(uint256 _price) public onlyOwner{
        PRICE = _price;
    }

    function setExcluded(address excluded, bool status) public onlyOwner {
        require(msg.sender == address(this), "owner only");
        excludedList[excluded] = status;
        excludedCounter = excludedCounter + 1;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }


    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function payToMint(address recipient, string memory metadataURI)
     public payable returns (uint256) {
         /*
        require(existingURIs[metadataURI] != 1, "NFT already minted!");
        require (msg.value >= 0.05 ether, "Need to pay up!");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] = 1;
        // _safeMint
        _mint(recipient, newItemId);
        //_setTokenURI(newItemId, metadataURI);
*/      
        if(excludedList[msg.sender] == false) // sender not in excludedList 
            require(msg.value >= PRICE, "Pay up!");

        uint newItemId = _tokenIdCounter.current();
        existingURIs[metadataURI] = 1;
        _safeMint(msg.sender, newItemId);
        onSale[newItemId] = false;
        _tokenIdCounter.increment();

        return newItemId;
    }

    function count() public view returns (uint256){
        return _tokenIdCounter.current();
    }

    function tokensOfOwner(address _owner) external view returns (uint[] memory) {

        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);

        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function getActiveTrades() external view returns (Trade[] memory){
        uint currentIndex = 0;
        // count opened trades
        for (uint i = 0; i < tradeCounter; i++) {
            if(trades[i].status == "Open"){
                currentIndex = currentIndex + 1;
            }
        }
        // list opened trades
        Trade[] memory activeTrades = new Trade[](currentIndex);
        uint crt = 0;
        for (uint i = 0; i < tradeCounter; i++) {
            if(trades[i].status == "Open"){
                activeTrades[crt] = trades[i];
                crt += 1;
            }
        }

        return activeTrades;
    }

    // sell
    function openTrade(uint256 _item, uint256 _price)
    public
    {
        require(_exists(_item), "Token ID not available");
        require(msg.sender == ownerOf(_item), "Not owner of this token");
        require(_price > 0, "Price zero");

        // check if token is already on sale
        for (uint i = 0; i < tradeCounter; i++) {
            if(trades[i].status == "Open" && trades[i].item == _item){
                require(false, "Token already on sale!");
            }
        }

        approve(address(this), _item);
        //itemToken.transferFrom(msg.sender, address(this), _item);
        trades[tradeCounter] = Trade({
            index: tradeCounter,
            poster: msg.sender,
            item: _item,
            price: _price,
            status: "Open"
        });
        tradeCounter += 1;
        onSale[_item] = true;
        //emit TradeStatusChange(tradeCounter - 1, "Open");
    }

    // buy
    function executeTrade(uint256 _trade)
    public
    payable
    {
        Trade memory trade = trades[_trade];
        require(trade.status == "Open", "Trade is not Open.");
        require(trade.poster != msg.sender, "No permission");
        require(msg.value >= trade.price, "Pay the price !!!");

        this.transferFrom(trade.poster, msg.sender, trade.item);
        payable(trade.poster).transfer(msg.value);
        //transferFrom(trade.poster, msg.sender, trade.item);
        trades[_trade].status = "Executed";
        //emit TradeStatusChange(_trade, "Executed");
        onSale[trade.item] = false;
    }
    
    // cancel trade
    function cancelTrade(uint256 _trade)
    public
    {
        Trade memory trade = trades[_trade];
        require(
            msg.sender == trade.poster,
            "No permission to cancel!"
        );
        require(trade.status == "Open", "Trade is not Open.");
        //itemToken.transferFrom(address(this), trade.poster, trade.item);
        trades[_trade].status = "Cancelled";
        //emit TradeStatusChange(_trade, "Cancelled");
        onSale[trade.item] = false;
    }

    // returns true if token is on sale
    function getItemStatus(uint256 item) public view returns(bool){
        return onSale[item];
    }

}