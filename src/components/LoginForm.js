import React from 'react';

class LoginForm extends React.Component {
constructor(props) {
super(props);
this.state = {username: '', password: '', channels:[]};
this.handleUsernameChange = this.handleUsernameChange.bind(this);
this.handlePasswordChange = this.handlePasswordChange.bind(this);
this.handleChannelsChange = this.handleChannelsChange.bind(this);
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
<input type="submit" value="login"/>
</form><br/>
{this.props.error}
</div>
);
}

}

export default LoginForm;