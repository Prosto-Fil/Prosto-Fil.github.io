// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenWithPresale is ERC20, Ownable {
    uint256 public immutable MaxSupply = 10000 * 10 ** decimals();
    uint256 public immutable PresaleMaxSupply = 1000 * 10 ** decimals();

    uint256 public presaleCounter = 0;
    uint256 public presaleCost1 = 0.05 ether; //cost1 for 1 * 10 ** decimals()
    uint256 public presaleCost2 = 0.1 ether; //cost2 for 1 * 10 ** decimals()

    enum Stage { 
        Paused, 
        FirstPresaleStage, 
        SecondPresaleStage,
        Launch 
    }

    Stage public CurrentStage = Stage.Paused;

    constructor() ERC20("MyTokenWithPresale", "MTWP") {}

    function buyOnPresale() public payable {
        require(
            CurrentStage == Stage(1) || CurrentStage == Stage(2),
            "Presale has not started yet or has already ended!"
        );

        uint256 cost = 0;
        if (CurrentStage == Stage(1)) {
            cost = presaleCost1;
        } else {
            cost = presaleCost2;
        }

        uint256 amount = (msg.value * 10 ** decimals()) / cost;
        require(amount > 1, "Too little value!");

        require(totalSupply() + amount <= MaxSupply, "Final supply reached!");

        presaleCounter += amount;
        require(
            presaleCounter <= PresaleMaxSupply,
            "Final presale supply reached!"
        );

        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount * 10 ** decimals() <= MaxSupply, "Final supply reached!");
        _mint(to, amount * 10 ** decimals());
    }

    function setStage(uint8 new_stage) public onlyOwner {
        CurrentStage = Stage(new_stage);
    }

    function withdraw() public onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

}
