const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
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

function listDirectory(call, callback) {
	const requestPath = call.request.path;

	if (!requestPath) {
		return callback({
			code: grpc.status.INVALID_ARGUMENT,
			details: 'Path is required'
		});
	}

	try {
		const files = fs.readdirSync(requestPath);
		callback(null, { filenames: files });
	} catch (error) {
		callback({
			code: grpc.status.NOT_FOUND,
			details: `Error reading directory: ${error.message}`
		});
	}
}

function main() {
	const server = new grpc.Server();

	server.addService(fileservice.FileService.service, {
		listDirectory: listDirectory
	});

	const port = '50051';
	server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
		if (err) {
			console.error('Failed to bind server:', err);
			return;
		}
		console.log(`Server started on localhost:${boundPort}`);
		server.start();
	});
}

main();