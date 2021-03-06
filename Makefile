test:
	cargo test

clean:
	cargo clean
	rm -rf ./build
	rm -rf ./web_ui/build

build-docker:
	docker build -t dim:latest .

run-docker:
	docker run -d -p 8000:8000/tcp -p 3012:3012/tcp --mount source=dim,target="/var/lib/postgresql/" --mount type=bind,source="/media",target=/media dim:latest

cloc:
	cloc ./web_ui/src/ ./migrations/ ./src/auth/src/ ./src/database/src ./src/events/src ./src/routes/ ./src/scanners/ ./src/streaming ./src/tests ./src/*.rs
