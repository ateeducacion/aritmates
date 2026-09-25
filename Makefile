# Use four spaces as recipe prefix instead of a tab
.RECIPEPREFIX =	

.PHONY: up build lint fix test test-all package help clean

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

## Run the unit suite
test:
	npm test

## Alias of test
test-all:
	npm test

## Clean dist
clean:
	npm run clean

## Build and zip dist/ as dist/<name>-<version>.zip (from package.json)
package: ZIP = $(shell node -p "p=require('./package.json');p.name+'-'+p.version").zip
package:
	npm run build
	cd dist && zip -qr ../$(ZIP) . && mv ../$(ZIP) .

## Display this help
help:
	@grep -E '^[a-zA-Z_-]+:.*?##' Makefile \
		| awk 'BEGIN {FS = ":.*?##"}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
