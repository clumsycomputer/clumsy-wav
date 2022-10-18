import {
  ChannelsData,
  MonoChannelsData,
  SampleRate,
  StereoChannelsData,
  WavType,
  WriteChannelsDataFunction,
} from "./encodings";
import {
  getWavDataInternal,
  GetWavDataInternalApi,
} from "./getWavDataInternal";

export function getWavData(
  sampleRate: SampleRate,
  channelsData: ChannelsData,
  wavType?: WavType
) {
  return _getWavData({
    sampleRate,
    channelsData,
    wavType,
  });
}

export function getFloatWavData(
  sampleRate: SampleRate,
  channelsData: ChannelsData
) {
  return _getWavData({
    channelsData,
    sampleRate,
    wavType: "float",
  });
}

export function getPcmWavData(
  sampleRate: SampleRate,
  channelsData: ChannelsData
) {
  return _getWavData({
    channelsData,
    sampleRate,
    wavType: "pcm",
  });
}

export interface _GetWavDataApi
  extends Pick<
    GetWavDataInternalApi<ChannelsData>,
    "sampleRate" | "channelsData"
  > {
  wavType?: WavType;
}

export function _getWavData(api: _GetWavDataApi) {
  const { wavType, channelsData, sampleRate } = api;
  const _wavType: WavType = wavType || "float";
  const getSpecifiedWavData =
    _wavType === "float" ? _getFloatWavData : _getPcmWavData;
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
    GetWavDataInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}

function _getFloatWavData<SomeChannelsData extends ChannelsData>(
  api: _GetFloatWavDataApi<SomeChannelsData>
) {
  const { writeChannelsData, channelsData, sampleRate } = api;
  return getWavDataInternal({
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
    GetWavDataInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}
function _getPcmWavData<SomeChannelsData extends ChannelsData>(
  api: _GetPcmWavDataApi<SomeChannelsData>
) {
  const { writeChannelsData, channelsData, sampleRate } = api;
  return getWavDataInternal({
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
