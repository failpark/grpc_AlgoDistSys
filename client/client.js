const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/fileservice.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});

const fileservice = grpc.loadPackageDefinition(packageDefinition).fileservice;

function main() {
	const client = new fileservice.FileService('localhost:50051', grpc.credentials.createInsecure());

	const directoryPath = process.argv[2] || '.';

	client.listDirectory({ path: directoryPath }, (error, response) => {
		if (error) {
			console.error('Error:', error.details);
			return;
		}

		console.log(`Files in directory '${directoryPath}':`);
		response.filenames.forEach(filename => {
			console.log(`	${filename}`);
		});
	});
}

main();