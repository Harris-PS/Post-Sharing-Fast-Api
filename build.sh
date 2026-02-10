#!/usr/bin/env bash
# Build script for Render.com

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Building React frontend..."
cd client
npm install
npm run build
cd ..

echo "Build complete!"
