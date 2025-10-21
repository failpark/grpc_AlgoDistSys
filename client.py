#!/usr/bin/env python3

import argparse
import grpc
import sys
from proto import fileservice_pb2, fileservice_pb2_grpc


def main():
	parser = argparse.ArgumentParser(description="gRPC file service client")
	parser.add_argument("path", nargs="?", default=".", help="Path to list (default: current directory)")
	args = parser.parse_args()

	try:
		with grpc.insecure_channel("localhost:50051") as channel:
			stub = fileservice_pb2_grpc.file_serviceStub(channel)

			request = fileservice_pb2.path(path = args.path)
			response = stub.list_dir(request)

			for filename in response.filenames:
				print(filename)

	except grpc.RpcError as e:
		print(f"gRPC error: {e}", file=sys.stderr)
		sys.exit(1)
	except Exception as e:
		print(f"Error: {e}", file=sys.stderr)
		sys.exit(1)


if __name__ == "__main__":
	main()
