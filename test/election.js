var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
    var electionInstance
    it("initializes with two candidates", () => {
        return Election.deployed().then((instace) =>{
            return instace.candidatesCount()
        }).then((count) => {
            assert.equal(count, 2)
        })
    })

    it("initializes candidates with the correct values", () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance
            return electionInstance.candidates(1)
        }).then((candidate1) => {
            assert.equal(candidate1[0], 1, "id")
            assert.equal(candidate1[1], "Candidate 1", "Name")
            assert.equal(candidate1[2], 0, "Votes Count")
            return electionInstance.candidates(2)
        }).then((candidate2) => {
            assert.equal(candidate2[0], 2, "id")
            assert.equal(candidate2[1], "Candidate 2", "Name")
            assert.equal(candidate2[2], 0, "Votes Count")
        })
    })
})