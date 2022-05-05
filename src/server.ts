import grpc, {
    UntypedServiceImplementation,
    loadPackageDefinition,
    Server,
    ServerCredentials,
  } from '@grpc/grpc-js';
  import { loadSync, PackageDefinition } from '@grpc/proto-loader';
  import { IServiceInformation } from './interfaces';
  
  export class GrpcServer {
    private packageName: string;
  
    private serviceName: string;
  
    private protoPath: string;
  
    private packageDefinition: PackageDefinition;
  
    private routeGuide: grpc.GrpcObject;
  
    private server: grpc.Server;
  
    constructor(
      packageName: string,
      serviceName: string,
      protoSource: string,
      serviceInformation: IServiceInformation,
      functionList: UntypedServiceImplementation
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
  
      this.routeGuide = <grpc.GrpcObject>loadPackageDefinition(
        this.packageDefinition,
      )[packageName];
  
      this.server = new Server();
  
      this.addRoutes(functionList);
  
      if (
        serviceInformation.isSecure
        && typeof serviceInformation.rootCertificates !== 'undefined'
        && typeof serviceInformation.keyCertificatePairs !== 'undefined'
      ) {
        this.server.bindAsync(
          `${serviceInformation.host}:${serviceInformation.port}`, ServerCredentials.createSsl(
            serviceInformation.rootCertificates,
            serviceInformation.keyCertificatePairs,
            serviceInformation.checkClientCertificate,
          ), () => {
            this.server.start();
          }
        );
      } else {
        this.server.bindAsync(
            `${serviceInformation.host}:${serviceInformation.port}`, ServerCredentials.createInsecure(),
            () => {
              this.server.start();
            }
        );
      }
    }
  
    private addRoutes(
      functionList: grpc.UntypedServiceImplementation,
    ) {
      // @ts-ignore
      this.server.addService(this.routeGuide[this.serviceName].service, functionList);
    }
  
    public static startServer(
      packageName: string,
      serviceName: string,
      serviceInformation: IServiceInformation,
      protoSource: string,
      functionList: UntypedServiceImplementation
    ): GrpcServer {
      const grpcInstance = new GrpcServer(
        packageName,
        serviceName,
        protoSource,
        serviceInformation,
        functionList,
      ); 
  
      return grpcInstance;
    }
  
    public getServer(): grpc.Server {
      return this.server;
    }
  
    public getPackageName(): string {
      return this.packageName;
    }
  
    public getServiceName(): string {
      return this.serviceName;
    }
  
    public getProtoSource(): string {
      return this.protoPath;
    }
  }
  
  export default GrpcServer;
  