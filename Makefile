# Use four spaces as recipe prefix instead of a tab
.RECIPEPREFIX =	

.PHONY: up build lint fix test package help clean

## Start the development server (build + serve)
up:
	npm run dev

## Compile the project into the dist folder
build:
	npm run build

## Check JavaScript code style
lint:
	npm run lint

## Automatically fix lint issues
fix:
	npm run lint -- --fix

## Run the test suite
test:
	npm test

## Clean dist
clean:
	npm run clean

## Build and zip the project using its version from package.json
package:
	VERSION=$(shell node -p "require('./package.json').version")
	mkdir -p dist/package
	npm run build
	cp -R dist/* dist/package/
	zip -r dist/$(shell basename $(CURDIR))-$$VERSION.zip dist/package
	rm -rf dist/package

## Display this help
help:
	@grep -E '^[a-zA-Z_-]+:.*?##' Makefile \
		| awk 'BEGIN {FS = ":.*?##"}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
