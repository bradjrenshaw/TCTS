export default class SpeechSettings {
    provider: string;
    voice: string;
    rate: number;
    volume: number;

    constructor(provider: string, voice: string, rate: number, volume: number) {
        this.provider = provider;
        this.voice = voice;
        this.rate = rate;
        this.volume = volume;
    }

    static deserialize(data: any): SpeechSettings {
        return new SpeechSettings(
            data.provider,
            data.voice,
            data.rate,
            data.volume,
        );
    }

    serialize(): object {
        return {
            provider: this.provider,
            voice: this.voice,
            rate: this.rate,
            volume: this.volume,
        };
    }
}
