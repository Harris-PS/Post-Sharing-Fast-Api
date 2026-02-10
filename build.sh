#!/usr/bin/env bash
# Build script for Render.com

set -o errexit  # Exit on error

echo "===== Starting build process ====="

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Building React frontend..."
cd client

echo "Installing npm dependencies..."
npm ci --verbose

echo "Running production build..."
npm run build

echo "Checking build output..."
ls -la dist/
ls -la dist/assets/ || echo "Warning: assets directory not found"

cd ..

echo "===== Build complete! ====="
