import { ChannelsData } from "./encodings";
import {
  getWavDataInternal,
  GetWavDataInternalApi,
} from "./getWavDataInternal";

export interface _GetPcmWavDataApi<SomeChannelsData extends ChannelsData>
  extends Pick<
    GetWavDataInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}

export function _getPcmWavData<SomeChannelsData extends ChannelsData>(
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
