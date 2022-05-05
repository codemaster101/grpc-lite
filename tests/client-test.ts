import Client from '../src/client';

const data = {
    host: '0.0.0.0',
    port: 3000,
    isSecure: false,
};
const point = {"latitude": 5, "longitude": 10};

async function main() {
    const client = new Client(  'routeguide',
        'RouteGuide',
        `${__dirname}/feature.proto`,
        data,
    );

    const d = await client.simpleRpc('GetTimestamp', point);

    console.log(d);
}

main();
