import { StereoChannelsData, WriteChannelsDataFunction } from "./encodings";

export const writeStereoChannelsData: WriteChannelsDataFunction<
  StereoChannelsData
> = (
  writeChannelSampleData,
  wavDataView,
  channelsData,
  sampleIndex,
  numberOfHeaderBytes,
  numberOfBytesPerInterleavedSample,
  bytesPerSample
) => {
  writeChannelSampleData(
    wavDataView,
    channelsData[0][sampleIndex]!,
    numberOfHeaderBytes + sampleIndex * numberOfBytesPerInterleavedSample
  );
  writeChannelSampleData(
    wavDataView,
    channelsData[1][sampleIndex]!,
    numberOfHeaderBytes +
      sampleIndex * numberOfBytesPerInterleavedSample +
      bytesPerSample
  );
};
