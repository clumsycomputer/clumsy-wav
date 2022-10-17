import {
  ChannelsData,
  SampleRate,
  WriteChannelSampleDataFunction,
  WriteChannelsDataFunction,
} from "./encodings";

export interface GetWavDataInternalApi<SomeChannelsData extends ChannelsData> {
  sampleFormat: number;
  bitDepth: number;
  sampleRate: SampleRate;
  channelsData: SomeChannelsData;
  writeChannelsData: WriteChannelsDataFunction<SomeChannelsData>;
  writeChannelSampleData: WriteChannelSampleDataFunction;
}

export function getWavDataInternal<SomeChannelsData extends ChannelsData>(
  api: GetWavDataInternalApi<SomeChannelsData>
): ArrayBuffer {
  const {
    bitDepth,
    channelsData,
    sampleFormat,
    sampleRate,
    writeChannelsData,
    writeChannelSampleData,
  } = api;
  const numberOfChannels = channelsData.length;
  const numberOfSamplesPerChannel = channelsData[0].length;
  const numberOfSamples = numberOfChannels * numberOfSamplesPerChannel;
  const bytesPerSample = bitDepth / 8;
  const numberOfInterleavedSampleBytes = numberOfSamples * bytesPerSample;
  const numberOfFormatBytes = 16;
  const numberOfBytesPerInterleavedSample = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * numberOfBytesPerInterleavedSample;
  const numberOfHeaderBytes = 44;
  const wavDataView = new DataView(
    new ArrayBuffer(numberOfHeaderBytes + numberOfInterleavedSampleBytes)
  );
  writeUnsignedBytesToDataView({
    targetDataView: wavDataView,
    startingByteIndex: 0,
    flipBytesOnWrite: true,
    writeInstructions: [
      {
        unsignedData: getBigEndianDataAsNumber({
          fourCharacterMaxAsciiString: "RIFF",
        }),
        numberOfBytes: 4,
        flipBytes: false,
      },
      {
        unsignedData: numberOfHeaderBytes - 8 + numberOfInterleavedSampleBytes,
        numberOfBytes: 4,
      },
      {
        unsignedData: getBigEndianDataAsNumber({
          fourCharacterMaxAsciiString: "WAVE",
        }),
        numberOfBytes: 4,
        flipBytes: false,
      },
      {
        unsignedData: getBigEndianDataAsNumber({
          fourCharacterMaxAsciiString: "fmt ",
        }),
        numberOfBytes: 4,
        flipBytes: false,
      },
      {
        unsignedData: numberOfFormatBytes,
        numberOfBytes: 4,
      },
      {
        unsignedData: sampleFormat,
        numberOfBytes: 2,
      },
      {
        unsignedData: numberOfChannels,
        numberOfBytes: 2,
      },
      {
        unsignedData: sampleRate,
        numberOfBytes: 4,
      },
      {
        unsignedData: byteRate,
        numberOfBytes: 4,
      },
      {
        unsignedData: numberOfBytesPerInterleavedSample,
        numberOfBytes: 2,
      },
      {
        unsignedData: bitDepth,
        numberOfBytes: 2,
      },
      {
        unsignedData: getBigEndianDataAsNumber({
          fourCharacterMaxAsciiString: "data",
        }),
        numberOfBytes: 4,
        flipBytes: false,
      },
      {
        unsignedData: numberOfInterleavedSampleBytes,
        numberOfBytes: 4,
      },
    ],
  });
  for (
    let sampleIndex = 0;
    sampleIndex < numberOfSamplesPerChannel;
    sampleIndex++
  ) {
    writeChannelsData(
      writeChannelSampleData,
      wavDataView,
      channelsData,
      sampleIndex,
      numberOfHeaderBytes,
      numberOfBytesPerInterleavedSample,
      bytesPerSample
    );
  }
  return wavDataView.buffer;
}

interface BigEndianDataAsNumberApi {
  fourCharacterMaxAsciiString: string;
}

const getBigEndianDataAsNumber = (api: BigEndianDataAsNumberApi): number => {
  const { fourCharacterMaxAsciiString } = api;
  return fourCharacterMaxAsciiString
    .split("")
    .reduce<number>(
      (result, someChar) => (result << 8) | someChar.charCodeAt(0),
      0
    );
};

interface WriteUnsignedBytesToDataViewApi {
  targetDataView: DataView;
  writeInstructions: WriteInstruction[];
  startingByteIndex: number;
  flipBytesOnWrite?: boolean;
}

interface WriteInstruction {
  numberOfBytes: 1 | 2 | 4;
  unsignedData: number;
  flipBytes?: boolean;
}

const writeUnsignedBytesToDataView = (
  api: WriteUnsignedBytesToDataViewApi
): void => {
  const {
    startingByteIndex,
    writeInstructions,
    targetDataView,
    flipBytesOnWrite = false,
  } = api;
  let currentByteIndex = startingByteIndex;
  writeInstructions.forEach((someWriteInstruction) => {
    someWriteInstruction.flipBytes =
      someWriteInstruction.flipBytes ?? flipBytesOnWrite;
    if (someWriteInstruction.numberOfBytes === 1) {
      targetDataView.setUint8(
        currentByteIndex,
        someWriteInstruction.unsignedData
      );
    } else if (someWriteInstruction.numberOfBytes === 2) {
      targetDataView.setUint16(
        currentByteIndex,
        someWriteInstruction.unsignedData,
        someWriteInstruction.flipBytes
      );
    } else if (someWriteInstruction.numberOfBytes === 4) {
      targetDataView.setUint32(
        currentByteIndex,
        someWriteInstruction.unsignedData,
        someWriteInstruction.flipBytes
      );
    } else {
      throw new Error("invalid path reached: writeUnsignedBytesToDataView");
    }
    currentByteIndex = currentByteIndex + someWriteInstruction.numberOfBytes;
  });
};
