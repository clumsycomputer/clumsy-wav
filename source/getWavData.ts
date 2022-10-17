import { ChannelsData, WavType } from "./encodings";
import { _getIeeeFloatWavData } from "./getIeeeFloatWavData";
import { _getPcmWavData } from "./getPcmWavData";
import { GetWavDataInternalApi } from "./getWavDataInternal";
import { writeMonoChannelsData } from "./writeMonoChannelsData";
import { writeStereoChannelsData } from "./writeStereoChannelsData";

export function getIeeeWavData(
  sampleRate: _GetWavDataApi["sampleRate"],
  channelsData: _GetWavDataApi["channelsData"]
) {
  return _getWavData({
    sampleRate,
    channelsData,
    wavType: "ieee",
  });
}

export function getPcmWavData(
  sampleRate: _GetWavDataApi["sampleRate"],
  channelsData: _GetWavDataApi["channelsData"]
) {
  return _getWavData({
    sampleRate,
    channelsData,
    wavType: "pcm",
  });
}

export function getWavData(
  sampleRate: _GetWavDataApi["sampleRate"],
  channelsData: _GetWavDataApi["channelsData"],
  wavType: _GetWavDataApi["wavType"]
) {
  return _getWavData({
    sampleRate,
    channelsData,
    wavType,
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
  const { wavType = "ieee", channelsData, sampleRate } = api;
  const getSpecifiedWavData =
    wavType === "ieee" ? _getIeeeFloatWavData : _getPcmWavData;
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
