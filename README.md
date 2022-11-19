# clumsy-wav

functions for generating .wav file data 🔉

## tl;dr

generate a three-second wav file of a 440hz sine wave at 48000 samples per second

```typescript
import { getWavBuffer } from "clumsy-wav";

const lengthOfAudioInSeconds = 3;
const sampleRate: SampleRate = 48000;
const sampleCount = lengthOfAudioInSeconds * sampleRate;
const channelsData: MonoChannelsData = [
  new Array(sampleCount).fill(undefined).map((_, sampleIndex) => {
    const waveFrequency = 440;
    const frequencySampleRateScalar = sampleCount / sampleRate;
    const angleStep = (2 * Math.PI) / sampleRate;
    const sampleAngle = sampleIndex * angleStep;
    return Math.sin(waveFrequency * frequencySampleRateScalar * sampleAngle);
  }),
];
const wavBuffer = getWavBuffer(sampleRate, channelsData);
```

### play wav file

```typescript
// within some async onClick handler
const audioContext = new AudioContext({
  sampleRate,
});
const audioSourceNode = new AudioBufferSourceNode(currentAudioContext);
audioSourceNode.buffer = await audioContext.decodeAudioData(wavBuffer.slice(0));
audioSourceNode.connect(audioContext.destination);
audioSourceNode.start();
```

### download wav file

```typescript
// within some onClick handler
const wavFile = new Blob([wavBuffer], {
  type: "audio/wav",
});
const wavUrl = URL.createObjectURL(wavFile);
const tempAnchor = document.createElement("a");
tempAnchor.href = wavUrl;
tempAnchor.download = "sine440.wav";
tempAnchor.click();
URL.revokeObjectURL(wavUrl);
```

## installation

```bash
yarn add clumsy-wav
```

## resources

- [Wav File Spec](http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html)

- [Wav Notes](https://gist.github.com/endolith/e8597a58bcd11a6462f33fa8eb75c43d)

- [Wav Reference Implementation](https://github.com/Jam3/audiobuffer-to-wav/blob/2272eb09bd46a05e50a6d684d908aa6f13c58f63/index.js#L18)

- [PCM and Wav Relation](https://stackoverflow.com/a/21159699)
