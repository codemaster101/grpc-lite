echo "----- Running tests -----"
echo "Starting the gRPC server"
npx ts-node ./tests/test.ts &
echo "-------------------------"
echo "Running relevant tests"
npx jest --verbose --config jest.config.js
echo "-------------------------"
