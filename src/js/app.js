App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      App3.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
      web3 = new Web3(App.web3Provider)
    }

    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election)
      App.contracts.Election.setProvider(App.web3Provider)
    
      // App.contracts.Election.at('0x2a9c1d265d06d47e8f7b00ffa987c9185aecf672')

      return App.render();
    })
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        document.querySelector("#accountAddress").innerHTML = "Your Account: <strong>" + account + "</strong>"
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = document.querySelector("#candidatesResults");
      for (let i=0; i < candidatesResults.childNodes.length; i++) {
        candidatesResults.removeChild(candidatesResults.childNodes[i])
      }
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          var tableRow = document.createElement('tr')
          var tableHeading = document.createElement('th')
          tableHeading.innerHTML = id
          var tableData1 = document.createElement('td')
          tableData1.innerHTML = name
          var tableData2 = document.createElement('td')
          tableData2.innerHTML = voteCount

          tableRow.appendChild(tableHeading)
          tableRow.appendChild(tableData1)
          tableRow.appendChild(tableData2)

          candidatesResults.appendChild(tableRow);
        })
      }
      loader.hide();
      content.show();
      }).catch(function(error) {
        console.warn(error);
      });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });
window.onload = App.init()