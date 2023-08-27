import { useState } from "react";
import OutputServiceProvider from "../outputServiceProvider/outputServiceProvider";
import OutputMessageAction from "../../outputActions/OutputMessageAction";


export default class WebSpeechOutputServiceProvider extends OutputServiceProvider {

    public readonly name = "Web Speech";

    //voices should be the same regardless of the instance, so may as well make this static and only initialize once
    static voices: {[key: string]: SpeechSynthesisVoice} = {};

    constructor(outputSettings: any = null) {
        super(outputSettings);
        let defaultVoice = this.getDefaultVoice();
        if (!defaultVoice) {
            throw new Error("Tried to initialize WebSpeechOutputServiceProvider with no voices loaded.");
        }
        if (!outputSettings) {
            this.outputSettings = {
                pitch: 1.0,
                rate: 1.0,
                voice: defaultVoice,
                volume: 1.0
            }
        }
    }

    private getDefaultVoice(): string | null {
     let voices = Object.keys(WebSpeechOutputServiceProvider.voices);

     //This should be impossible, but just in case
     if (!voices.length) return null;

     //This isn't ideal, since often the first voice won't match the language of the user. this may need to be updated in future.
        return voices[0];
    }

    static async initialize(): Promise<void> {
        const getVoices = (): Promise<Array<SpeechSynthesisVoice>> => {
            return new Promise(resolve => {
                let voices = window.speechSynthesis.getVoices();
                if (voices.length) {
                    resolve(voices);
                    return;
                }
                const voiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                    resolve(voices);
                }
                speechSynthesis.onvoiceschanged = voiceschanged;
            });
                    }

                    let voices = await getVoices();
                    for (let voice of voices) {
                        WebSpeechOutputServiceProvider.voices[voice.name] = voice;
                    }
                }

    deserialize(data: any): OutputServiceProvider {
        return new WebSpeechOutputServiceProvider(data.outputSettings);
    }

    serialize(): any {
        return {
            name: this.name,
            outputSettings: this.outputSettings
        };
    }

    output(action: OutputMessageAction): void {
        let outputSettings = action.profile.outputSettings;
        let utterence = new SpeechSynthesisUtterance(action.event.variables.text);
        utterence.voice = WebSpeechOutputServiceProvider.voices[outputSettings.voice];
        utterence.volume = outputSettings.volume;
        utterence.rate = outputSettings.rate;
        utterence.pitch = outputSettings.pitch;
        window.speechSynthesis.speak(utterence);
                utterence.onend = () => {
            action.complete();
        }
    }

    getUIErrors(): Array<string> {
        return [];
    }

    ServiceSettingsComponent(): any {
        return <p>No service connection settings available; see settings tab for speech output settings.</p>;
    }

    OutputSettingsComponent({settings}: {settings: any}): any {
        let [voice, setVoice] = useState(settings.voice);
        let [ volume, setVolume ] = useState(settings.volume);
        let [ rate, setRate ] = useState(settings.rate);
        let [ pitch, setPitch ] = useState(settings.pitch);

        const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setPitch(event.target.value);
            settings.pitch = event.target.value;
        };

        const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setRate(event.target.value);
            settings.rate = event.target.value;
        };

        const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setVoice(event.target.value);
            settings.voice = event.target.value;
        };

        const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setVolume(event.target.value);
            settings.volume = event.target.value;
        };

        return <form>
            <label htmlFor="selectVoice">Voice</label>
            <select id="selectVoice" value={voice} onChange={handleVoiceChange}>
        {Object.keys(WebSpeechOutputServiceProvider.voices).map((name: string) => <option key={name} value={name}>{name}</option>)}
            </select><br />
            <label htmlFor="inputRate">Rate</label>
            <input type="range" min="0.1" max="10.0" value={rate} step="0.1" id="inputRate" onChange={handleRateChange} /><br />
            <label htmlFor="inputVolume">Volume</label>
            <input type="range" min="0.0" max="1.0" value={volume} step="0.1" id="inputVolume" onChange={handleVolumeChange} /><br />
            <label htmlFor="inputPitch">Pitch</label>
            <input type="range" min="0.0" max="2.0" value={pitch} step="0.1" id="inputPitch" onChange={handlePitchChange} /><br />
        </form>
    }
};
