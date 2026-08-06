#!/bin/sh
# Marketing Brain v1.1 LTS — container healthcheck
set -e

if ! command -v node >/dev/null 2>&1; then
  echo "FAIL: node not found" >&2
  exit 1
fi

if [ ! -f VERSION ]; then
  echo "FAIL: VERSION missing" >&2
  exit 1
fi

node -e "const fs=require('fs'); const v=fs.readFileSync('VERSION','utf8').trim(); if(!v) process.exit(1); console.log('OK:', v);"
exit 0
