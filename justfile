default:
	just --list

start:
	npm run server &

run *path:
	npm run client "{{path}}"
