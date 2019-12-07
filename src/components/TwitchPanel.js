import React from 'react';
import ChatPanel from './ChatPanel';
import VoicePanel from './VoicePanel';

class TwitchPanel extends React.Component {
constructor(props) {
super(props);
this.client = this.props.client;
this.speaker = this.props.speaker;
this.config = this.props.config;
this.handleMessage = this.handleMessage.bind(this);
this.handleCheer = this.handleCheer.bind(this);
this.handleNotice = this.handleNotice.bind(this);
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
this.client.on('message', this.handleMessage);
this.client.on('cheer', this.handleCheer);
this.client.on('notice', this.handleNotice);
}

componentWillUnmount() {
this.client.removeListener('message', this.handleMessage);
this.client.removeListener('cheer', this.handleCheer);
this.client.removeListener('notice', this.handleNotice);
}


handleMessage(target, context, msg, self) {
  this.speaker.speak(context['display-name'] + ': ' + msg);
}

handleCheer(target, context, msg) {
  this.speaker.speak(context['display-name'] + ': ' + msg);
}

handleNotice(channel, msgid, msg) {
this.speaker.speak('notice: ' + msgid + ': ' + msg);
}

}

export default TwitchPanel;