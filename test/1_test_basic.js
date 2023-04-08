const PollManager = artifacts.require("./PollManager.sol");

contract("PollManager", accounts => {
  it("** Should add a new Poll **", async () => {
    const instance = await PollManager.deployed();

    // 1. Data for the new Poll
    const testAccountPollCreator = accounts[0];
    const question = "Who will win the next US presidential election?";
    const testOptions = ["Joe Biden", "Donaldt Trump"];//.forEach(x => web3.utils.asciiToHex(x));
    const testOptionsVotes = [0, 0];//.forEach(x => web3.utils.asciiToHex(x));
    const testLiveDays = 2;
    const multiVote = 1;
    //
    // 1.1. Set new poll with 2 options and UniVote
    var success = await instance.setNewPoll.call(question, testOptions, testLiveDays, multiVote);
    assert.equal(success, true, "1.1. setNewPoll() did not executed successfully");
  });
});

contract("PollManager", accounts => {
  it("** Should add a new Poll and get the data **", async () => {
    const instance = await PollManager.deployed();

    // 1. Data for the new Poll
    const testAccountPollCreator = accounts[0];
    const question = "Who will win the next US presidential election?";
    const testOptions = ["Joe Biden", "Donaldt Trump"];//.forEach(x => web3.utils.asciiToHex(x));
    const testOptionsVotes = [0, 0];//.forEach(x => web3.utils.asciiToHex(x));
    const testLength = 2;
    const testNVotes1 = 0;
    const testNVotes2 = 0;
    const testTotalVotes = 0;
    const testLiveDays = 2;
    const multiVote = 1;
    //
    const pollId = 0;
    // 1.1. Set new poll with 2 options and UniVote
    const success = await instance.setNewPoll(question, testOptions, testLiveDays, multiVote);
    //assert.equal(success, true, "1.1. setNewPoll() did not executed successfully");
    
    // 2. Get stored values
    // 2.1. Total polls count
    const totalPollsCount = await instance.getTotalPollsCounter.call();
    assert.equal(totalPollsCount.toNumber(), 1, "2.1. Incorrect total polls");
    // 2.2. Live polls count
    const livePollsCount = await instance.getLivePollsCounter.call();
    assert.equal(livePollsCount, 1, "2.2. Incorrect live polls");
    // 2.3. Get owner
    var owner = await instance.getOwner.call();
    assert.equal(owner, testAccountPollCreator, "2.3. Incorrect owner");
    // 2.4. Poll exist
    var exist = await instance.getPollExist.call(pollId);
    assert.equal(exist, true, "2.4. Incorrect exist value");
    // 2.5. Poll live
    var live = await instance.getPollLive.call(pollId);
    assert.equal(live, true, "2.5. Incorrect live value");
    // 2.6. Poll question
    var returnQuestion = await instance.getQuestion.call(pollId);
    assert.equal(returnQuestion, question, "2.6. Incorrect question");
    // 2.7.(1,2). Poll options Votes (array)
    var returnOptionsVotes = await instance.getPollOptionsVotes.call(pollId);
    assert.equal(returnOptionsVotes.length, testLength, "2.7.1 Incorrect length of options array");
    returnOptionsVotes.forEach((element, idx) => {
      assert.equal(element.toString(), testOptionsVotes[idx], "2.7.2 Incorrect options votes");
    });
    // 2.7.(3,4). Poll options string (array)
    var returnOptionsString = await instance.getPollOptions.call(pollId);
    assert.equal(returnOptionsString.length, 2, "2.7.3 Incorrect length of options string array");
    returnOptionsString.forEach((element, idx) => {
      assert.equal(element.toString(), testOptions[idx], "2.7.4 Incorrect string option");
    });
    // 2.8.1. Poll option 1 Votes (uint)
    var returnOption1 = await instance.getPollOptionVotes.call(pollId, 0);
    assert.equal(returnOption1, testNVotes1, "2.8.1. Incorrect option 1 vote");
    // 2.8.2. Poll option 2 Votes (uint)
    var returnOption2 = await instance.getPollOptionVotes.call(pollId, 1);
    assert.equal(returnOption2.toNumber(), testNVotes2, "2.8.2. Incorrect option 2 vote");
    // 2.9. Poll total votes
    var totalVotes = await instance.getPollTotalVotes.call(pollId);
    assert.equal(totalVotes, testTotalVotes, "2.9. Incorrect total votes");
    // 2.10. Poll creation date
    var creationDate = await instance.getCreationDate.call(pollId);
    assert.notEqual(creationDate, 0, "2.10. Incorrect creationDate");
    // 2.11. Poll close date
    var closeDate = await instance.getCloseDate.call(pollId);
    assert.equal(closeDate, 0, "2.11. Incorrect close date");
    // 2.12. Poll live days
    var liveDays = await instance.getLiveDays.call(pollId);
    assert.equal(liveDays, testLiveDays, "2.12. Incorrect live days");
    // 2.13. Check poll is live
    var checkLive = await instance.checkPollLive.call(pollId);
    assert.equal(checkLive, true, "2.13. Incorrect check live");
    // 2.14. Check poll voted by Voter
    var checkVoted1 = await instance.checkVoted.call(testAccountPollCreator, 0);
    assert.equal(checkVoted1, false, "2.14.1. Incorrect check voted");
  });
});


contract("PollManager", accounts => {
  it("** Should add a new Poll and set a vote**", async () => {
    const instance = await PollManager.deployed();

    // 3.0 Data for the new Poll
    const testAccountPollCreator = accounts[0];
    const testAccountPollVoter = accounts[1];
    const question = "Who will win the next US presidential election?";
    const testOptions = ["Joe Biden", "Hillary Clinton", "Donaldt Trump"];
    const testOptionsVotes = [0, 1, 0];//.forEach(x => web3.utils.asciiToHex(x));
    const testLength = 3;
    const testLiveDays = 2;
    const multiVote = 1;
    //
    const pollId = 0;
    const testOptionVotedId = 1;
    const testNVotes1 = 0;
    const testNVotes2 = 1;
    const testNVotes3 = 0;
    const testTotalVotes = 1;
    var accountsTest = await web3.eth.getAccounts();
    //
    // 3.1. Set new poll with 2 options and UniVote
    web3.eth.defaultAccount = testAccountPollCreator;
    //const success = await instance.setNewPoll.call(question, testOptions, testLiveDays, multiVote);
    const success = await instance.setNewPoll(question, testOptions, testLiveDays, multiVote);
    //assert.equal(success, true, "1.1. setNewPoll() did not executed successfully");
    // 3.2 Set vote from voter
    // 3.2.1. Set one vote
    //var status = await instance.setUniVote.call(pollId, testOptionVotedId);
    //var status = await instance.setUniVote(pollId, testOptionVotedId);
    //var status = await instance.setUniVote(pollId, testOptionVotedId).call({from: testAccountPollVoter});
    web3.eth.defaultAccount = testAccountPollVoter;
    var status = await instance.setUniVote(testAccountPollVoter, pollId, testOptionVotedId, {from: testAccountPollVoter});
    assert.equal(Boolean(status), true, "3.2.1. Incorrect total polls");
    // 3. Get stored values
    // 2.1. Total polls count
    const totalPollsCount = await instance.getTotalPollsCounter.call();
    assert.equal(totalPollsCount.toNumber(), 1, "2.1. Incorrect total polls");
    // 2.2. Live polls count
    const livePollsCount = await instance.getLivePollsCounter.call();
    assert.equal(livePollsCount, 1, "2.2. Incorrect live polls");
    // 2.3. Get owner
    var owner = await instance.getOwner.call();
    assert.equal(owner, testAccountPollCreator, "2.3. Incorrect owner");
    // 2.4. Poll exist
    var exist = await instance.getPollExist.call(pollId);
    assert.equal(exist, true, "2.4. Incorrect exist value");
    // 2.5. Poll live
    var live = await instance.getPollLive.call(pollId);
    assert.equal(live, true, "2.5. Incorrect live value");
    // 2.6. Poll question
    var returnQuestion = await instance.getQuestion.call(pollId);
    assert.equal(returnQuestion, question, "2.6. Incorrect question");
    // 2.7.(1,2). Poll options Votes (array)
    var returnOptionsVotes = await instance.getPollOptionsVotes.call(pollId);
    assert.equal(returnOptionsVotes.length, testLength, "2.7.1 Incorrect length of options array");
    returnOptionsVotes.forEach((element, idx) => {
      assert.equal(element.toNumber(), testOptionsVotes[idx], "2.7.2 Incorrect options votes at index " + idx.toString());
    });
    // 2.7.(3,4). Poll options string (array)
    var returnOptionsString = await instance.getPollOptions.call(pollId);
    assert.equal(returnOptionsString.length, testLength, "2.7.3 Incorrect length of options string array");
    returnOptionsString.forEach((element, idx) => {
      assert.equal(element.toString(), testOptions[idx], "2.7.4 Incorrect string option at index " + idx.toString());
    });
    // 2.8.(1,2,3). Poll option (1,2,3) Votes (uint)
    var returnOption1 = await instance.getPollOptionVotes.call(pollId, 0);
    assert.equal(returnOption1.toNumber(), testNVotes1, "2.8.1. Incorrect option 1 vote");
    var returnOption2 = await instance.getPollOptionVotes.call(pollId, 1);
    assert.equal(returnOption2.toNumber(), testNVotes2, "2.8.2. Incorrect option 2 vote");
    var returnOption3 = await instance.getPollOptionVotes.call(pollId, 0);
    assert.equal(returnOption3.toNumber(), testNVotes3, "2.8.3. Incorrect option 3 vote");
    // 2.9. Poll total votes
    var totalVotes = await instance.getPollTotalVotes.call(pollId);
    assert.equal(totalVotes, testTotalVotes, "2.9. Incorrect total votes");
    // 2.10. Poll creation date
    var creationDate = await instance.getCreationDate.call(pollId);
    assert.notEqual(creationDate, 0, "2.10. Incorrect creationDate");
    // 2.11. Poll close date
    var closeDate = await instance.getCloseDate.call(pollId);
    assert.equal(closeDate, 0, "2.11. Incorrect close date");
    // 2.12. Poll live days
    var liveDays = await instance.getLiveDays.call(pollId);
    assert.equal(liveDays, testLiveDays, "2.12. Incorrect live days");
    // 2.13. Check poll is live
    var checkLive = await instance.checkPollLive.call(pollId);
    assert.equal(checkLive, true, "2.13. Incorrect check live");
    // 3.2.14. Check poll voted by Voter
    var checkVoted1 = await instance.checkVoted.call(testAccountPollCreator, 0);
    assert.equal(checkVoted1, false, "Incorrect 3.2.14.1 Incorrect check voted 1");
    var checkVoted2 = await instance.checkVoted.call(testAccountPollVoter, 0);
    assert.equal(checkVoted2, true, "3.2.14.2. Incorrect check voted 2");
  });
});
