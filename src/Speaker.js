class Speaker {

constructor() {
this.settings = {}
this.setup();
}


getVoices() {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
this.voices = voices;
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
this.voices = voices;
      resolve(voices);
    }
  })
}

getVoiceByName(name) {
return this.voices.find((s) => s.name === name);
}

speak(text) {
  let settings = this.settings;
  let u = new SpeechSynthesisUtterance(text);
if (settings.rate) u.rate = settings.rate;
if (settings.pitch) u.pitch = settings.pitch;
if (settings.volume) u.volume = settings.volume;
if (settings.voice) u.voice = settings.voice;
speechSynthesis.speak(u);
}

stop() {
speechSynthesis.cancel();
}

set(options) {
if (options.voice) {
if (typeof options.voice == 'string') {
this.settings.voice = this.getVoiceByName(options.voice);
console.log(this.settings.voice);
} else {
this.settings.voice = options.voice;
}
}
if (options.lang) this.settings.lang = options.lang;
if (options.rate) this.settings.rate = options.rate;
if (options.pitch) this.settings.pitch = options.pitch;
if (options.volume) this.settings.volume = options.volume;
}

async setup() {
let voices = await this.getVoices();
this.settings = {
rate: 1.0,
pitch: 1.0,
volume: 1.0,
voice: voices[0],
lang: voices[0].lang
}
}
}

export default Speaker;