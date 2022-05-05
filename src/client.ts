import grpc, {
  Client,
  credentials,
  loadPackageDefinition,
} from '@grpc/grpc-js';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { loadSync, PackageDefinition } from '@grpc/proto-loader';

import { IServiceInformation } from './interfaces';

export class GrpcClient {
  private client: Client;
  
  private packageName: string;

  private serviceName: string;

  private protoPath: string;

  // Name of package in example
  private routeGuide: ServiceClientConstructor; // grpc.GrpcObject;

  private packageDefinition: PackageDefinition;

  constructor(
    packageName: string,
    serviceName: string,
    protoSource: string,
    serviceInformation: IServiceInformation,
  ) {
    this.protoPath = protoSource;
    this.packageDefinition = loadSync(
      this.protoPath,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: ['../tests/.']
      }
    );

    this.packageName = packageName;

    this.serviceName = serviceName;

    this.routeGuide = <ServiceClientConstructor>loadPackageDefinition(
      this.packageDefinition,
    )[this.packageName];

    if (serviceInformation.isSecure
      && typeof serviceInformation.rootCertificates !== 'undefined'
      && typeof serviceInformation.keyCertificatePairs !== 'undefined') {
      // @ts-ignore
      this.client = new this.routeGuide[this.serviceName](
        `${serviceInformation.host}:${serviceInformation.port}`, credentials.createSsl(
          serviceInformation.rootCertificates,
          serviceInformation.keyCertificatePairs[0].private_key,
        )
      );
    } else {
      // @ts-ignore
      this.client = new this.routeGuide[this.serviceName](
        `${serviceInformation.host}:${serviceInformation.port}`, credentials.createInsecure()
      );
    }
  }

  public async simpleRpc(rpcName: string, message?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.client[rpcName](message, (err: any, data: any) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}

export default GrpcClient;
