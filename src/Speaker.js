class Speaker {

    constructor() {
        this.settings = {};
    }

    getVoices() {
        if (speechSynthesis === undefined) {
            console.error("Error: speechSynthesis object does not exist.");
        }
        return new Promise(resolve => {
            let voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve(voices);
                this.voices = voices;
                return;
            }
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                this.voices = voices;
                if (voices.length <= 0) {
                    console.error("TTS voices not found in voice changed event.");
                }
                resolve(voices);
            };
        });
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
            if (typeof options.voice == "string") {
                this.settings.voice = this.getVoiceByName(options.voice);
                if (this.settings.voice === undefined) {
                    console.error("Error: Voice " + options.voice + " not found; switching to default.");
                    this.settings.voice = this.voices[0];
                }
            } else {
                this.settings.voice = options.voice;
            }
        }
        if (options.lang) this.settings.lang = options.lang;
        if (options.rate) this.settings.rate = options.rate;
        if (options.pitch) this.settings.pitch = options.pitch;
        if (options.volume) this.settings.volume = options.volume;
    }

    async load() {
        let voices = await this.getVoices();
        this.settings = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: voices[0],
            lang: voices[0].lang
        };
    }
}

export default Speaker;