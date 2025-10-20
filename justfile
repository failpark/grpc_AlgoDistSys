[private]
default:
	just --list

start:
	npm run server

run *path:
	npm run client "{{path}}"

run-go:
	go run client/main.go

compile:
	protoc --go_out=. --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative --go-grpc_out=. proto/fileservice.proto
