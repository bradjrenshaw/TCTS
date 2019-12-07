import React from 'react';

class LoginForm extends React.Component {
constructor(props) {
super(props);
this.config = props.config;
this.state = {username: this.config.get('user').username, password: this.config.get('user').password, channels:this.config.get('channels'), storeSettings: this.config.get('storeSettings')};
this.handleUsernameChange = this.handleUsernameChange.bind(this);
this.handlePasswordChange = this.handlePasswordChange.bind(this);
this.handleChannelsChange = this.handleChannelsChange.bind(this);
this.handleStoreChange = this.handleStoreChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
}

handleUsernameChange(event) {
this.setState({username: event.target.value});
}

handlePasswordChange(event) {
this.setState({password: event.target.value});
}

handleChannelsChange(event) {
let channels = event.target.value.split(',').map((s) => s.trim());
this.setState({channels: channels});
}

handleStoreChange(event) {
this.setState({storeSettings: event.target.value});
}

handleSubmit(event) {
event.preventDefault();
this.props.completionFunction(this.state);
}

render() {
return (
<div>
<form onSubmit={this.handleSubmit}>
<h1>Twitch Login</h1>
<label>
IRC Nickname (use normal Twitch username if unsure)<input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
</label>
<label>
OAuth password<input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
</label>
<br/>
<label>
Channels (comma-separated)<input type="text" onChange={this.handleChannelsChange}/></label><br/>
<label>
Remember Settings (stores settings locally) <input type="checkbox" value={this.state.storeSettings} onChange={this.handleStoreChange} /></label><br/>
<input type="submit" value="login"/>
</form><br/>
{this.props.error}
</div>
);
}

}

export default LoginForm;