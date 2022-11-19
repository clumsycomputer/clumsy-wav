import {
  ChannelsData,
  MonoChannelsData,
  SampleRate,
  StereoChannelsData,
  WavType,
  WriteChannelsDataFunction,
} from "./encodings";
import {
  getWavBufferInternal,
  GetWavBufferInternalApi,
} from "./getWavBufferInternal";

export function getWavBuffer(
  sampleRate: SampleRate,
  channelsData: ChannelsData,
  wavType?: WavType
) {
  return _getWavBuffer({
    sampleRate,
    channelsData,
    wavType,
  });
}

export function getFloatWavBuffer(
  sampleRate: SampleRate,
  channelsData: ChannelsData
) {
  return _getWavBuffer({
    channelsData,
    sampleRate,
    wavType: "float",
  });
}

export function getPcmWavBuffer(
  sampleRate: SampleRate,
  channelsData: ChannelsData
) {
  return _getWavBuffer({
    channelsData,
    sampleRate,
    wavType: "pcm",
  });
}

export interface _GetWavBufferApi
  extends Pick<
    GetWavBufferInternalApi<ChannelsData>,
    "sampleRate" | "channelsData"
  > {
  wavType?: WavType;
}

export function _getWavBuffer(api: _GetWavBufferApi) {
  const { wavType, channelsData, sampleRate } = api;
  const _wavType: WavType = wavType ?? "float";
  const getSpecifiedWavData =
    _wavType === "float" ? _getFloatWavBuffer : _getPcmWavBuffer;
  return channelsData.length === 1
    ? getSpecifiedWavData({
        channelsData,
        sampleRate,
        writeChannelsData: writeMonoChannelsData,
      })
    : getSpecifiedWavData({
        channelsData,
        sampleRate,
        writeChannelsData: writeStereoChannelsData,
      });
}

interface _GetFloatWavDataApi<SomeChannelsData extends ChannelsData>
  extends Pick<
    GetWavBufferInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}

function _getFloatWavBuffer<SomeChannelsData extends ChannelsData>(
  api: _GetFloatWavDataApi<SomeChannelsData>
) {
  const { writeChannelsData, channelsData, sampleRate } = api;
  return getWavBufferInternal({
    writeChannelsData,
    channelsData,
    sampleRate,
    sampleFormat: 0x0003,
    bitDepth: 32,
    writeChannelSampleData: (wavDataView, someChannelSample, wavByteIndex) => {
      wavDataView.setFloat32(wavByteIndex, someChannelSample, true);
    },
  });
}

interface _GetPcmWavDataApi<SomeChannelsData extends ChannelsData>
  extends Pick<
    GetWavBufferInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}

function _getPcmWavBuffer<SomeChannelsData extends ChannelsData>(
  api: _GetPcmWavDataApi<SomeChannelsData>
) {
  const { writeChannelsData, channelsData, sampleRate } = api;
  return getWavBufferInternal({
    writeChannelsData,
    channelsData,
    sampleRate,
    sampleFormat: 0x0001,
    bitDepth: 16,
    writeChannelSampleData: (wavDataView, someChannelSample, wavByteIndex) => {
      const someWavSample = someChannelSample * 0x7fff;
      wavDataView.setUint16(wavByteIndex, someWavSample, true);
    },
  });
}

const writeMonoChannelsData: WriteChannelsDataFunction<MonoChannelsData> = (
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

const writeStereoChannelsData: WriteChannelsDataFunction<StereoChannelsData> = (
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
