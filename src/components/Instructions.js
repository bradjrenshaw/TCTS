import React from 'react';

const Instructions = () => {
return (<div><h1>Instructions for Use</h1>
To set up with twitch:
<ul>
<li>The app requires an auth token in order to log in. It uses Twitch's IRC chat and does not have access to any other areas of your account. If you are worried about security though, you are allowed to make another Twitch account.</li>
    <li>go to the <a href="https://twitchapps.com/tmi/">Twitch Chat Password Generator</a> application and authorize it. Copy the auth token, you'll need it whenever you wish to log in with this app.</li>
<li>Enter the auth token into the password field above. Note that the auth: prefix is required.</li>
<li>Enter a number of channels to connect to. This is a list of comma separated values. If you want to only listen to a single channel, just enter that one channel with no commas.</li>
<li>Hit login. If a probem occurs, an error will appear momentarily below the login button (it may take a second).</li>
</ul></div>);}

export default Instructions;