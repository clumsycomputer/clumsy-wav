import { ChannelsData } from "./encodings";
import {
  getWavDataInternal,
  GetWavDataInternalApi,
} from "./getWavDataInternal";

export interface _GetIeeeFloatWavDataApi<SomeChannelsData extends ChannelsData>
  extends Pick<
    GetWavDataInternalApi<SomeChannelsData>,
    "sampleRate" | "channelsData" | "writeChannelsData"
  > {}

export function _getIeeeFloatWavData<SomeChannelsData extends ChannelsData>(
  api: _GetIeeeFloatWavDataApi<SomeChannelsData>
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
