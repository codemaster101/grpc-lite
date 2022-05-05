import grpc from '@grpc/grpc-js';

export type TDataType = 'string' | 'number' | 'boolean';
export type TGrpcCallback = 
  grpc.requestCallback<string> 
  | grpc.requestCallback<boolean> 
  | grpc.requestCallback<number> 
  | grpc.requestCallback<Array<string>>
  | grpc.requestCallback<Array<number>>
  | grpc.requestCallback<Array<boolean>>
  | grpc.requestCallback<JSON>;


export interface IProtobufMessageProperties {
  type: TDataType;
  fieldName: string;
  index: bigint;
}

export interface IServiceInformation {
  host: string,
  port: number,
  isSecure: boolean,
  rootCertificates?: Buffer | null,
  privateKey?: Buffer | null | undefined,
  keyCertificatePairs?: grpc.KeyCertPair[],
  checkClientCertificate?: boolean,
}
