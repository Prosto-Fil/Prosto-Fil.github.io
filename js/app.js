let web3 = new web3js.myweb3(window.ethereum);
let addr;

const sttaddr = "0x72e34e0b72bd81afe2df217bb92f7b478e8c9588";
const sttabi = [
  {
    "inputs": [],
    "name": "buyOnPresale",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
		"inputs": [],
		"name": "CurrentStage",
		"outputs": [
			{
				"internalType": "enum MyTokenWithPresale.Stage",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let sttcontract = new web3.eth.Contract(sttabi, sttaddr);


//***************** our smart-contract integration *****************/

const buystt = async () => {
  await loadweb3();
  const chainId = await web3.eth.getChainId();
  if (addr == undefined) {
    Swal.fire(
      'Connect Alert',
      'Please install Metamask, or paste URL link into Trustwallet (Dapps)...',
      'error'
    )
  }
  if (chainId !== 4) { //Change for LIVE
    Swal.fire(
      'Connect Alert',
      'Please Connect on Rinkeby', //Change for LIVE
      'error'
    )
  }

  let ethval = document.getElementById("buyinput").value;
  if (ethval >= 0.01) {
    ethval = (ethval * Math.pow(10, 18));

    sttcontract.methods.buyOnPresale().send({ from: addr, value: ethval }).then(function (error, result) {
      Swal.fire(
        'Success!',
        'Thank you for your purchase!',
        'info'
      )
    }, function (e, processedContract) {
      Swal.fire(
        'Error!',
        'Transaction rejected!',
        'error'
      )
    });
  } 
  else {
    Swal.fire(
      'Buy Alert',
      'Buy as low as 0.01 ETH.',
      'error'
    )
  }
}


const loadweb3 = async () => {
  try {
    web3 = new web3js.myweb3(window.ethereum);
    console.log('Injected web3 detected.')
    sttcontract = new web3.eth.Contract(sttabi, sttaddr);
    let a = await ethereum.enable();
    addr = web3.utils.toChecksumAddress(a[0]);
    return (addr);

  } catch (error) {
    if (error.code === 4001) {
      console.log('Please connect to MetaMask.')
    } else {
      Swal.fire(
        'Connect Alert',
        'Please install Metamask!',
        'error'
      )
    }
  }
};



//***************** adding our token to wallet *****************/

function addToWallet() {
  try {
    web3.currentProvider.sendAsync({
      method: 'wallet_watchAsset',
      params: {
        'type': 'ERC20',
        'options': {
          'address': '0x72e34e0b72bd81afe2df217bb92f7b478e8c9588',
          'symbol': 'MTWP',
          'decimals': '18'
        },
      },
      id: Math.round(Math.random() * 100000)
    }, function (err, data) {
      if (!err) {
        if (data.result) {
          console.log('Token added');
        } else {
          console.log(data);
          console.log('Some error');
        }
      } else {
        console.log(err.message);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

//***************** some beauty jewelry  *****************/

// Set the date we're counting down to
var countDownDate = new Date("August 5, 2022 15:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  const stage = sttcontract.methods.CurrentStage().call().then(value => {
    console.log(value);
    return value;
  }).catch(err => {
    console.log(err);
  });

  const result = async () => {
    const a = await stage;
    let current_stage = "";
    if (a == 0) {
      current_stage = "Paused";
    } else if (a == 1) {
      current_stage = "First Presale Round";
    } else if (a == 2) {
      current_stage = "Second Presale Round";
    } else {
      current_stage = "Presale already ended";
    }
    document.getElementById("demo").innerHTML = "Current Stage: " + "test " + current_stage;
  };

  result();

}, 1000);
