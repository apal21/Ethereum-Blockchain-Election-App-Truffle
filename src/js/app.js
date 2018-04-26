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

      App.listenForEvents();

      return App.render();
    })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
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
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty()
      var dropdown = $("#candidatesSelect")
      dropdown.empty()
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Filling up the table
          // var tableRow = document.createElement('tr')
          // var tableHeading = document.createElement('th')
          // tableHeading.innerHTML = id
          // var tableData1 = document.createElement('td')
          // tableData1.innerHTML = name
          // var tableData2 = document.createElement('td')
          // tableData2.innerHTML = voteCount

          // tableRow.appendChild(tableHeading)
          // tableRow.appendChild(tableData1)
          // tableRow.appendChild(tableData2)

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Filling up the dropdown
          // var option = document.createElement('option')
          // option.setAttribute('value', id)
          // option.innerHTML = name
          var option = "<option value=" + id + ">" + name + "</option>"
          dropdown.append(option)
        })
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
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
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }

};

// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });
window.onload = App.init()
