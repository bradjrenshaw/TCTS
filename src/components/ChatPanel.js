import React from 'react';

class ChatPanel extends React.Component {
constructor(props) {
super(props);
this.client = props.client;
this.speaker = props.speaker;
this.state = {chatText: undefined, currentChannel: this.client.opts.channels[0]};
this.handleChannelChange = this.handleChannelChange.bind(this);
this.handleChatTextChange = this.handleChatTextChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
}

handleChannelChange(event) {
this.setState({currentChannel: event.target.value});
}

handleChatTextChange(event) {
this.setState({chatText: event.target.value});
}

handleSubmit(event) {
event.preventDefault();
if (!this.client.opts.channels.find((s) => s === this.state.currentChannel)) {
this.speaker.speak("Invalid channel.");
} else {
let text = this.state.chatText;
if (text !== '') {
console.log(this.state);
this.client.say(this.state.currentChannel, text);
}
}
}

render() {
return (
<div>
<h2>Chat</h2>
<form onSubmit={this.handleSubmit}>
<label>
Send to channel<input type="text" onChange={this.handleChannelChange} value={this.state.currentChannel}/></label><br/>
<label>
text<input type="text" onChange={this.handleChatTextChange} value={this.state.chatText}/></label>
<input type="Submit" value="Send"/>
</form>
</div>
);
}
}
export default ChatPanel;