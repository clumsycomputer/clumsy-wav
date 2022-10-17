export type WavType = "ieee" | "pcm";

export type SampleRate = 44100 | 48000 | 192000;

export type ChannelsData = MonoChannelsData | StereoChannelsData;

export type MonoChannelsData = [Array<number>];

export type StereoChannelsData = [Array<number>, Array<number>];

export type WriteChannelsDataFunction<SomeChannelsData extends ChannelsData> = (
  writeChannelSampleData: WriteChannelSampleDataFunction,
  wavDataView: DataView,
  channelsData: SomeChannelsData,
  sampleIndex: number,
  numberOfHeaderBytes: number,
  numberOfBytesPerInterleavedSample: number,
  bytesPerSample: number
) => void;

export type WriteChannelSampleDataFunction = (
  wavDataView: DataView,
  someChannelSample: number,
  wavByteIndex: number
) => void;
