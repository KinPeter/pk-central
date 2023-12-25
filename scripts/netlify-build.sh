#!/usr/bin/env sh

# Steps to run before the Netlify deploy
npm run lint
npm run format:check
npm run test
