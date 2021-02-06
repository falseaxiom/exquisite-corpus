let gameChannelName = channelName + "game";
let clientG = AgoraRTM.createInstance(appId, { enableLogUpload: false });
let gameChannel = clientG.createChannel(gameChannelName);
let gameName = Username + "G";

clientG.login({uid: gameName})
    .then(() => {
        gameChannel.join(appId);
    }).catch(err => {handlefail(err)})
;

// // gather player list, put in lex order
// let players = gameChannel.getMembers();
// players.sort();

// will contain "cpi###round###story###lastWord"
let turnInfo = "";

let playerInput = "";
let story = "";
let lastWord = "";

function startGame() {
    // unlock player console
    document.getElementById("gamestuff").className = "flexCol";
    document.getElementById("start").className = "locked";
    
    // update player and round
    cpi = 0;
    round = 1;

    // if you're not the first player, wait your turn
    if (players[cpi] != Username) {
        document.getElementById("currplayerstuff").className = "locked";
        document.getElementById("notyourturn").className = "desc";
    }

    // update stats
    document.getElementById("roundnum").innerHTML = round;
    document.getElementById("currplayer").innerHTML = players[cpi];

    // send to everyone
    turnInfo = cpi + "###" + round + "######-----";
    console.log(turnInfo);
    gameChannel.sendMessage({text: turnInfo}).then(() => {
        console.log("game updated successfully");
    }).catch(err => {handlefail(err)});
}

function nextPlayer() {
    // if input > 280 characters or input is empty, do not submit
    if (document.getElementById("passage").value == "" || document.getElementById("passage").value.length > 280) return;

    // add player input to story
    playerInput = document.getElementById("passage").value;
    story += " " + playerInput;
    document.getElementById("storyText").innerHTML = story;

    // change last word
    let playerInputArr = playerInput.split(" ");
    lastWord = playerInputArr[playerInputArr.length - 1];

    // clear input box
    document.getElementById("passage").value = "";

    // reset character counter
    document.getElementById("charNum").innerHTML = 0;

    // next player
    cpi++;
    console.log(players);
    if (cpi == players.length) {
        round++;
        if (round == 6) {
            document.getElementById("gamestuff").className = "locked";
            document.getElementById("story").className = "flexCol";
        } else {
            cpi = 0;
            document.getElementById("roundnum").innerHTML = round;
        }
    }
    document.getElementById("currplayer").innerHTML = players[cpi];

    // if not playing solo, lock input
    if (players.length != 1) {
        document.getElementById("currplayerstuff").className = "locked";
        document.getElementById("notyourturn").className = "desc";
    }

    // send to everyone
    turnInfo = cpi + "###" + round + "###" + story + "###" + lastWord;
    console.log(turnInfo);
    gameChannel.sendMessage({text: turnInfo}).then(() => {
        console.log("game updated successfully");
    }).catch(err => {handlefail(err)});
}

gameChannel.on("ChannelMessage", async (m) => {
    console.log("received game update successfully");

    // get current player, round, story, last word
    mData = m.text.split("###");
    console.log(mData);
    cpi = mData[0];
    round = mData[1];
    story = mData[2];
    lastWord = mData[3];

    // update stats
    document.getElementById("roundnum").innerHTML = round;
    document.getElementById("currplayer").innerHTML = players[cpi];
    document.getElementById("storyText").innerHTML = story;
    document.getElementById("last-word").innerHTML = lastWord;

    // if game is over, update for everyone
    if (round == 6) {
        document.getElementById("gamestuff").className = "locked";
        document.getElementById("story").className = "flexCol";
        return;
    }

    // if game just started, unlock player console
    if (document.getElementById("gamestuff").className == "locked") {
        document.getElementById("gamestuff").className = "flexCol";
        document.getElementById("start").className = "locked";

    }
    
    // if you're the current player, unlock input & update; otherwise wait your turn
    if (players[cpi] == Username) {
        document.getElementById("currplayerstuff").className = "flexCol";
        document.getElementById("notyourturn").className = "locked";

    } else {
        document.getElementById("currplayerstuff").className = "locked";
        document.getElementById("notyourturn").className = "desc";
    }
});