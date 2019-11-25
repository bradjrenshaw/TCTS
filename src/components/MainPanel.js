import React from 'react';
import tmi from 'tmi.js';
import LoginForm from './LoginForm';
import Instructions from './Instructions';
import TwitchPanel from './TwitchPanel';
import Speaker from '../Speaker';

class MainPanel extends React.Component {
constructor(props) {
super(props);
this.state = {connected: false, error: undefined};
this.handleLogin = this.handleLogin.bind(this);
this.client = new tmi.client({connection: {secure: true}});
this.speaker = new Speaker();
}

render() {
let PrimaryPanel = null;
if (this.state.connected === false) {
PrimaryPanel = () => (<LoginForm completionFunction={this.handleLogin} error={this.state.error} />);
} else {
PrimaryPanel = () => (<TwitchPanel client={this.client} speaker = {this.speaker} />);
}

return (
<div><PrimaryPanel /><br/><br/><Instructions/></div>);
}

async handleLogin(props) {
this.setAuth(props.username, props.password);
this.client.opts.channels = props.channels;
await this.connect();
}

setAuth(username, password) {
let identity = this.client.opts.identity;
identity.username = username;
identity.password = password;
}

async connect() {
try {
await this.client.connect();
this.setState({error: undefined, connected: true});
} catch(e) {
this.setState({error: e, connected: false});
}
}
};

export default MainPanel;
