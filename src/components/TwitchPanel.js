import React from "react";
import ChatPanel from "./ChatPanel";
import VoicePanel from "./VoicePanel";

class TwitchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.client = this.props.client;
        this.speaker = this.props.speaker;
        this.config = this.props.config;
        this.events = {};
        this.triggers = {};
this.addEvent('message', this.handleMessage);
this.addEvent('cheer', this.handleCheer);
this.addEvent('hosted', this.handleHosted);
this.addEvent('raided', this.handleRaided);
        this.setup();
    }

    render() {
        return (
            <div>
                <h1>Connected</h1>
                <button value="disconnect" onClick={this.props.disconnectFunction} >Disconnect</button><br />
                <VoicePanel speaker={this.speaker} config={this.config}/>
                <br/><ChatPanel client={this.client} speaker={this.speaker}/></div>
        );
    }

    setup() {
this.client.removeAllListeners();
for (const [name, callbacks] of Object.entries(this.events)) {
for (let callback of callbacks) {
let newCallback = callback.bind(this);
this.client.on(name, newCallback);
}
}
    }

    componentWillUnmount() {
this.client.removeAllListeners();
    }

handleNotice(channel, msgid, msg) {
console.log('Notice event: ' + channel + ', ' + msgid + ': ' + msg);
}


handleHosted(channel, name, viewers) {
let message = '';
if (viewers > 0) {
message = name + ' is now hosting you with ' + viewers + ' viewers.';
} else {
message = name + ' is now hosting you.';
}
let event = {channel: channel, name: name, viewers: viewers, message: message};
this.pushEvent(event);
}

handleRaided(channel, name, viewers) {
let message = name + ' has raided you with ' + viewers + ' viewers.';
let event = {channel: channel, name: name, viewers: viewers, message: message};
this.pushEvent(event);
}

    handleMessage(target, context, msg, self) {
        let message = context["display-name"] + ": " + msg;
let event = {target: target, context: context, raw_message: msg, message: message, self: self};
this.pushEvent(event);
    }

    handleCheer(target, context, msg) {
        let message = context["display-name"] + ": " + msg;
        let event = {target: target, context: context, raw_message: msg, message: message};
this.pushEvent(event);
    }

    addEvent(name, callback) {
        if (name in this.events) {
this.events[name].push(callback);
    } else {
this.events[name] = [callback];
}
    }

pushEvent(e) {
this.speaker.speak(e.message);
}
}

export default TwitchPanel;