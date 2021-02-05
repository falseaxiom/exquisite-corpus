let clientM = AgoraRTM.createInstance(appId, { enableLogUpload: false });
let channel = clientM.createChannel(channelName);

clientM.login({uid: Username})
    .then(() => {
        channel.join(appId);
    }).catch(err => {handlefail(err)})
;

function messageAll() {
    let content = document.getElementById("chat-input").value;
    if (!content) return;
    channel.sendMessage({text: content}).then(() => {
        console.log("message sent successfully");
        let chatcontent = document.getElementById("chatcontent");

        // put sender first
        let sender = document.createElement("b");
        sender.innerHTML = Username + ": ";

        // put actual message
        let message = document.createElement("span");
        message.innerHTML = content;

        // put in chatbox
        chatcontent.appendChild(sender);
        chatcontent.appendChild(message);
        chatcontent.appendChild(document.createElement("br"));

        // clear input
        document.getElementById("chat-input").value = "";

    }).catch(err => {handlefail(err)});
};

channel.on("ChannelMessage", async (m, id) => {

    console.log("received message successfully");
    let chatcontent = document.getElementById("chatcontent");

    // put sender first
    let sender = document.createElement("b");
    sender.innerHTML = id + ": ";

    // put actual message
    let message = document.createElement("span");
    message.innerHTML = m.text;

    // put in chatbox
    chatcontent.appendChild(sender);
    chatcontent.appendChild(message);
    chatcontent.appendChild(document.createElement("br"));
});