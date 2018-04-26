pragma solidity^0.4.23;

contract Election {
    
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Store Candidates
    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    event votedEvent(
        uint indexed _candidateId
    );

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // Check whether the voter has already voted
        require(!voters[msg.sender]);

        // Valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;
        // Increase Vote Count
        candidates[_candidateId].voteCount++;
        
        // Trigger Event
        emit votedEvent(_candidateId);
    } 
}