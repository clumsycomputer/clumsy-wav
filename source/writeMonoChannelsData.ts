import { MonoChannelsData, WriteChannelsDataFunction } from "./encodings";

export const writeMonoChannelsData: WriteChannelsDataFunction<
  MonoChannelsData
> = (
  writeChannelSampleData,
  wavDataView,
  channelsData,
  sampleIndex,
  numberOfHeaderBytes,
  numberOfBytesPerInterleavedSample
) => {
  writeChannelSampleData(
    wavDataView,
    channelsData[0][sampleIndex]!,
    numberOfHeaderBytes + sampleIndex * numberOfBytesPerInterleavedSample
  );
};
