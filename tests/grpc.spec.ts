import HexGrpc from '../src/server';

describe('Testing out HexGrpcFramework',() => {
  let GetFeature: any;
  let GetTimestamp: any;

  let featureList: Array<any> = [];
  // Start server
  beforeAll(() => {
    function checkFeature (point: any) {
      let feature;
      // Check if there is already a feature object for the given point
      for (var i = 0; i < featureList.length; i++) {
        feature = featureList[i];
        if (feature.location.latitude === point.latitude &&
            feature.location.longitude === point.longitude) {
          return feature;
        }
      }
      let name = '';
      feature = {
        name: name,
        location: point
      };
      return feature;
    }

    GetFeature = ((call: any, callback: any) => {
      callback(null, checkFeature(call.request));
    });

    function getTimestamp() {
      return Date.now();
    }

    GetTimestamp = ((_call: any, callback: any) => {
      callback(null, getTimestamp());
    });

    const data = {
      host: '0.0.0.0',
      port: 3000,
      isSecure: false,
    };

    const grpcServer = HexGrpc.startServer(
      'routeguide',
      'RouteGuide',
      data,
      `${__dirname}/feature.proto`,
      {
        GetFeature: GetFeature,
      }
    );
  });

  it('Should be able to Respond to GetFeature', async () => {
    
  })
});