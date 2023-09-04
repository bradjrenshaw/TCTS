# TCTS
A web app that allows for automatic reading of stream chat for both streamers and audiences. This will support Youtube chat in future, but is currently limited to Twitch Chat while app features are still in development. Note that this app is still a fairly early prototype and there may be significant changes before full release.

The app can be found [here](https://www.bradleyrenshaw.com/tcts).

## Getting Started
To get started, add a chat profile from the main ap page. The chat settings interface is divided into three tabs.

The general tab currently only allows you to name a profile. The name doesn't matter; it is just for your use. Note that each profile does need a unique name.

The Chat tab allows you to configure the chat service you want to use for that profile (IE Twitch, Youtube, etc). Select the chat service you want to use and enter your credentials as instructed on the page below the services list. Different profiles can share the same service and credentials allowing you to have individual profiles for different Twitch streamers for example. Note that Twitch is the only option currently available; more will be added later in development.

The output settings tab allows you to configure output from the application. This will often be speech configuration, but other output services may become available (for example braille output). Select the output service you want to use and then configure the settings for that service as desired. Output services can be set up by you (as described below), but a Web TTS service is preconfigured by default. Make sure to check your output settings though as Chrome can choose speech voices by default that don't match your system language.

Once done, click on Save to return to the main page. You can connect a profile by clicking the profile's corresponding connect button. If everything is set up correctly, you should be receiving output from your chosen chat service. You can also read and send chat messages by switching to the tab corresponding to the connected profile.

## Output Services
An output service is a configuration of an output service provider (such as Web TTS or Google Cloud Speech), any settings specific to that service provider (such as auth credentials for Cloud speech), and any output settings (such as voice, speech rate, etc). Currently the only available service provider is Web TTS, though more will be added later in development. Output services are intentionally separated from individual profiles, as this allows for easier configuration of more complicated services in future (such as Google Cloud Speech). Multiple profiles can safely use the same output service.


## Known Issues

* The voice list may not always show all available voices in Chrome.
* Focus may jump unpredictably around poppup dialogs, such as the profile settings tabs.