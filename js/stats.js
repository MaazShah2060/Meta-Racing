/**
 * @author mrdoob / http://mrdoob.com/
 */

const Web3 = require("web3")
const MemoryToken = require('./abis/MemoryToken.json')
var tokenURIArr = []

var Stats = function () {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
     window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  document.addEventListener('DOMContentLoaded', function () {
    loadBlockchainData();
  }, false);

  var startTime = Date.now(), prevTime = startTime;
  var ms = 0, msMin = 1000, msMax = 0;
  var fps = 0, fpsMin = 1000, fpsMax = 0;
  var frames = 0, mode = 0;mode
  var container = document.createElement( 'div' );
  container.id = 'stats';
  console.log('se', document.getElementById('stats'))
  container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );


   

  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

  var fpsDiv = document.createElement( 'div' );
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild( fpsDiv );

  var fpsText = document.createElement( 'div' );
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild( fpsText );

  var fpsGraph = document.createElement( 'div' );
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild( fpsGraph );

  while ( fpsGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild( bar );

  }

  var msDiv = document.createElement( 'div' );
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild( msDiv );

  var msText = document.createElement( 'div' );
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild( msText );

  var msGraph = document.createElement( 'div' );
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild( msGraph );

  while ( msGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild( bar );

  }

  var loadBlockchainData = async function() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    // this.setState({ account: accounts[0] })
    // Load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    if(networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      // this.setState({ token })
      const totalSupply = await token.methods.totalSupply().call()
      // this.setState({ totalSupply })
      // Load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
       
        var tokenURI = await token.methods.tokenURI(id).call()
        tokenURIArr.push(tokenURI)
        console.log('tokens', tokenURIArr)
      }
      var html='';
      for (let i=0; i<=tokenURIArr.length-1; i++) {
        
          html+='<a class="dropdown-item token-class" onclick=clickToken("'+tokenURIArr[i]+'")><img src = '+ tokenURIArr[i] + ' width="80" height="60">'+tokenURIArr[i]+'</a>';
      }
      document.getElementById('select-token').innerHTML+= html;
      
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
 
  var setMode = function ( value ) {
    mode = value;

    switch ( mode ) {

      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;
      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }

  }

  var updateGraph = function ( dom, value ) {

    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';

  }

  return {

    domElement: container,

    setMode: setMode,
    loadBlockchainData: loadBlockchainData,
    // clickToken: clickToken,
    current: function() { return fps; },

    begin: function () {

      startTime = Date.now();

    },

    end: function () {

      var time = Date.now();

      ms = time - startTime;
      msMin = Math.min( msMin, ms );
      msMax = Math.max( msMax, ms );

      msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
      updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

      frames ++;

      if ( time > prevTime + 1000 ) {

        fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
        fpsMin = Math.min( fpsMin, fps );
        fpsMax = Math.max( fpsMax, fps );

        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

        prevTime = time;
        frames = 0;

      }

      return time;

    },

    update: function () {

      startTime = this.end();
      
    }

  }
  
};

module.exports = Stats

