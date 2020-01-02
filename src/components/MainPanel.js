import React from "react";
import tmi from "tmi.js";
import LoginForm from "./LoginForm";
import Instructions from "./Instructions";
import TwitchPanel from "./TwitchPanel";
import Transition from "./Transition";
import Speaker from "../Speaker";
import Config from "../Config";

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {connected: false, error: undefined, connecting: false};
        this.storeSettings = false;
        this.handleLogin = this.handleLogin.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.client = new tmi.client({connection: {secure: true, reconnect: true}});
        this.speaker = new Speaker();
        this.config = new Config({user: {username: "", password: ""}, channels: [], currentChannel: null, voiceSettings: {}, storeSettings: false});
        if (!window.localStorage) {
            alert("Warning: HTML5 storage not available.");
        } else {
            let storage = window.localStorage;
            this.config.load(storage);

        }
        let user = this.config.get("user");
        let channels = this.config.get("channels");
        if (user.username !== "" && user.password !== "" && channels.length > 0) {
            this.state.connecting = true;
            this.handleLogin({username: user.username, password: user.password, channels: channels});
        }
this.config.shouldSave = this.config.get('storeSettings', false);
    }

    handleDisconnect(event) {
        event.preventDefault();
        this.setState({connected: false});
        this.client.disconnect();
    }

    render() {
        if (this.state.connecting) {
            return (<Transition header="Connecting" message="Connecting to Twitch."/>);
        } else if (this.state.connected === false) {
            return (<div><LoginForm completionFunction={this.handleLogin} error={this.state.error} config={this.config}/><br/><Instructions/></div>);
        } else {
            return (<TwitchPanel client={this.client} speaker = {this.speaker} config={this.config} disconnectFunction={this.handleDisconnect}/>);
        }


    }

    async handleLogin(props) {
        this.setAuth(props.username, props.password);
        this.config.shouldSave = props.storeSettings;
        this.config.update({storeSettings: props.storeSettings});
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
            if (this.config.get("storeSettings")) {
                this.config.update({user: this.client.opts.identity, channels: this.client.opts.channels});
            }
        } catch(e) {
            this.setState({error: e, connected: false});
        }
        this.setState({connecting: false});
    }
}

export default MainPanel;
