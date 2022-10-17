# clumsy-wav

a function for generating .wav file data 🔉

## tl;dr

generate a three-second wav file of a sine wave at 440hz

```typescript
import { getWavData } from "clumsy-wav";

const lengthOfAudioInSeconds = 3;

const sampleRate: SampleRate = 44100;

const channelsData: MonoChannelsData = [
  new Array(lengthOfAudioInSeconds * sampleRate)
    .fill(undefined)
    .map((_, sampleIndex) => {
      const sampleAngle = ((2 * Math.PI) / sampleRate) * sampleIndex;
      return Math.sin(440 * sampleAngle);
    }),
];

const wavData = getWavData({
  sampleRate,
  channelsData,
});
```

## installation

```bash
yarn add clumsy-wav
```

## resources

- [Wav File Spec](http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html)
- [Wav Notes](https://gist.github.com/endolith/e8597a58bcd11a6462f33fa8eb75c43d)
- [Wav Reference Implementation](https://github.com/Jam3/audiobuffer-to-wav/blob/2272eb09bd46a05e50a6d684d908aa6f13c58f63/index.js#L18)
