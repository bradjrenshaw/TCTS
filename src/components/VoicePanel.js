import React from 'react';
import merge from 'lodash.merge';


class VoicePanel extends React.Component {
constructor(props) {
super(props);
this.speaker = props.speaker;
this.config = props.config;
this.speaker.set(this.config.get('voiceSettings'));
this.state = {voice: this.speaker.settings.voice, volume: this.speaker.settings.volume, rate: this.speaker.settings.rate, pitch: this.speaker.settings.pitch};
this.handleVoiceChange = this.handleVoiceChange.bind(this);
this.handleVolumeChange = this.handleVolumeChange.bind(this);
this.handleRateChange = this.handleRateChange.bind(this);
this.handlePitchChange = this.handlePitchChange.bind(this);
this.handleVoiceTest = this.handleVoiceTest.bind(this);
this.handleVoiceStop = this.handleVoiceStop.bind(this);
}

handleVoiceStop(event) {
this.speaker.stop();
}

handleVoiceTest(event) {
this.speaker.speak('This is a test of your tts settings.');
}

handleVoiceChange(event) {
	let voice = this.speaker.voices[event.target.selectedIndex];
let s = {voice: voice};
this.setState(s);
this.speaker.set(s);
this.config.update({voiceSettings: {voice: voice.name}});
}

handleVolumeChange(event) {
let s = {volume: event.target.valueAsNumber};
this.setState(s);
this.speaker.set(s);
this.config.update({voiceSettings: {volume: event.target.valueAsNumber}});
}

handlePitchChange(event) {
let s = {pitch: event.target.valueAsNumber};
this.setState(s);
this.speaker.set(s);
this.config.update({voiceSettings: {pitch: event.target.valueAsNumber}});
}

handleRateChange(event) {
let s = {rate: event.target.valueAsNumber};
this.setState(s);
this.speaker.set(s);
this.config.update({voiceSettings: {rate: event.target.valueAsNumber}});
}

render() {
return (
<div>
<button onClick={this.handleVoiceStop}>Stop Speech</button><br/>
<select onChange={this.handleVoiceChange} value={this.state.voice.name}>{this.speaker.voices.map((s) => <option key={s.name}>{s.name}</option>)}</select><br/>
<label>Volume<input type="range" min="0" max="1" step="0.05" onChange={this.handleVolumeChange} value={this.state.volume} /></label><br/>
<label>Rate<input type="range" min="0" max="10" step="0.1" onChange={this.handleRateChange} value={this.state.rate}/></label><br/>
<label>Pitch<input type="range" min="0" max="2" step="0.1" onChange={this.handlePitchChange} value={this.state.pitch} /></label><br/>
<button onClick={this.handleVoiceTest}>Test TTS Settings</button>
</div>
);
}
}

export default VoicePanel;