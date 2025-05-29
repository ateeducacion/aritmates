#!/bin/bash

# Crear el bundle de tests
npm run testbuild

# Ejecutar los tests
npx mocha dist/testBundle.js
