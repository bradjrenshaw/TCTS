import React from 'react';
import ChatPanel from './ChatPanel';
import VoicePanel from './VoicePanel';

class TwitchPanel extends React.Component {
constructor(props) {
super(props);
this.client = this.props.client;
this.speaker = this.props.speaker;
this.handleMessage = this.handleMessage.bind(this);
this.setup();
}

render() {
return (
<div>
<h1>Connected</h1>
<VoicePanel speaker={this.speaker}/>
<br/><ChatPanel client={this.client} speaker={this.speaker}/></div>
);
}

setup() {
this.client.on('message', this.handleMessage);
}

handleMessage(target, context, msg, self) {
console.log(target);
  this.speaker.speak(context['display-name'] + ': ' + msg);
}
}

export default TwitchPanel;