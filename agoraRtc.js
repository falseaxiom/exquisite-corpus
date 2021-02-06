let params = window.location.href.split('?');
let ps = params[1].split("&");
let userInfo = ps[0].split("=");
let channelInfo = ps[1].split("=");

// display channel name
document.getElementById("channel").innerHTML = channelInfo[1];

// display your username
document.getElementById("you-label").innerHTML = userInfo[1];

// array of player usernames
let players = [];
players.push(userInfo[1]);

// round and current player
let round = 0;
// let currPlayer = "";
// let currPlayerIndex = 0;
let cpi = 0;

// live character counter
function countChar(val) {
    var len = val.value.length;
    if (len >= 10000) {
        val.value = val.value.substring(50, 10000);
    } else {
        $('#charNum').text(len);
    }
    if(len > 280){
        document.getElementById("charNum").style.color = "red";
    }else{
        document.getElementById("charNum").style.color = "white";
    }
}

/*** videochat things ***/

let handlefail = function(err){
    console.log(err);
}

let appId = "c534f140d98c47a998ca51ba4b256633";
let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail
)

function addVideoStream(streamId){
    console.log();
    let remoteContainer = document.getElementById("otherVidsContainer");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.className = "remoteStream";
    streamDiv.style.width = "300px";
    streamDiv.style.height = "175px";
    streamDiv.style.marginTop = "20px";
    streamDiv.style.borderRadius = "5px";
    streamDiv.style.border = "2px solid #8198ff";
    streamDiv.style.maxWidth = "100%";
    streamDiv.style.textAlign = "left";
    remoteContainer.appendChild(streamDiv);
    let labelDiv = document.createElement("div");
    labelDiv.className = "playerLabel";
    labelDiv.innerHTML = streamId;
    labelDiv.id = streamId;
    remoteContainer.appendChild(labelDiv);
}

function addPlayer(streamId){
    console.log();
    players.push(streamId);
    console.log(players);
    players.sort();
}

function removeMyVideoStream(){
    globalStream.stop();
}

function removeVideoStream(evt){
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}

let channelName = channelInfo[1];
let Username = userInfo[1];

client.init(
    appId,
    () => console.log("AgoraRTC Client Connected"),
    handlefail
);

client.join(
    null,
    channelName,
    Username,
    () =>{
        var localStream = AgoraRTC.createStream({
            video: true,
            audio: true,
        })

        localStream.init(function(){
            localStream.play("SelfStream");
            console.log(`App id: ${appId}\nChannel id: ${channelName}`);
            client.publish(localStream);
        })

        globalStream = localStream;
    }
);

client.on("stream-added", function (evt){
    console.log("Added Stream");
    client.subscribe(evt.stream,handlefail);
});

client.on("stream-subscribed", function(evt){
    console.log("Subscribed Stream");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
    addPlayer(stream.getId());
});

client.on("stream-removed", removeVideoStream)

client.on("peer-leave", function(evt){
    console.log("Peer has left")
    removeVideoStream(evt)
})


document.getElementById("video-mute").onclick = function() {
    if(!isVideoMuted){
        globalStream.muteVideo();
        isVideoMuted = true;
        document.getElementById("video-mute").className = "iconMute";
    }else{
        globalStream.unmuteVideo();
        isVideoMuted = false;
        document.getElementById("video-mute").className = "icon";
    }
}

document.getElementById("audio-mute").onclick = function() {
    if(!isAudioMuted){
        globalStream.muteAudio();
        isAudioMuted = true;
        document.getElementById("audio-mute").className = "iconMute";
    }else{
        globalStream.unmuteAudio();
        isAudioMuted = false;
        document.getElementById("audio-mute").className = "icon";
    }
}

/*** game things (solo ver) ***/

// function startGame() {
//     document.getElementById("gamestuff").className = "flexCol";
//     document.getElementById("start").className = "locked";
    
//     currPlayer = players[currPlayerIndex];
//     round = 1;

//     document.getElementById("roundnum").innerHTML = round;
//     document.getElementById("currplayer").innerHTML = currPlayer;
// }

// let playerInput = "";
// let story = "";
// let storyArr = [];
// let lastWord = "";
// function nextPlayer() {
//     // if input > 280 characters or input is empty, do not submit
//     if (document.getElementById("passage").value == "" || document.getElementById("passage").value.length > 280) return;


//     // add player input to story
//     playerInput = document.getElementById("passage").value;
//     story += " " + playerInput;
//     let playerInputArr = playerInput.split(" ")
//     for (let i = 0; i < playerInputArr.length; i++) {
//         storyArr.push(playerInputArr[i]);
//     }
//     document.getElementById("storyText").innerHTML = story;

//     // change last word
//     lastWord = storyArr[storyArr.length - 1];
//     document.getElementById("last-word").innerHTML = lastWord;

//     // clear input box
//     document.getElementById("passage").value = "";

//     // next player
//     currPlayerIndex++;
//     if (currPlayerIndex == players.length) {
//         if (round == 5) {
//             document.getElementById("gamestuff").className = "locked";
//             document.getElementById("story").className = "flexCol";
//             return;
//         } else {
//             currPlayerIndex = 0;
//             round++;
//             document.getElementById("roundnum").innerHTML = round;
//         }
//     }

//     currPlayer = players[currPlayerIndex];
//     document.getElementById("currplayer").innerHTML = currPlayer;
// }