#!/usr/bin/env bash
# Build the iOS app for the simulator and install it, without going through `expo run:ios`.
# Used by the E2E iOS workflow and for local testing. Works on Xcode 27, where the Simulator
# app became Device Hub and the Expo CLI can no longer find it.
#
# Usage: scripts/build-ios-sim.sh [SIMULATOR_UDID]   (default: the booted simulator)
# Boot one first with: xcrun simctl boot "iPhone 18 Pro"
set -euo pipefail

DEVICE="${1:-booted}"
BUNDLE_ID="com.rachitp.tokenninja"

cd "$(dirname "$0")/../app"
# CocoaPods (run by prebuild) crashes outside a UTF-8 locale.
export LANG="${LANG:-en_US.UTF-8}"
case "$LANG" in *UTF-8*) ;; *) export LANG=en_US.UTF-8 ;; esac

# prebuild rewrites the ios/android npm scripts in package.json; put the file back as it was.
PKG_BACKUP="$(mktemp)"
cp package.json "$PKG_BACKUP"
trap 'cp "$PKG_BACKUP" package.json; rm -f "$PKG_BACKUP"' EXIT
npx expo prebuild --platform ios --clean --no-install
(cd ios && pod install)

cd ios
WORKSPACE=$(ls -d *.xcworkspace | head -1)
SCHEME=$(basename "$WORKSPACE" .xcworkspace)
echo "Building $SCHEME for the simulator"
# Release embeds the JS bundle, so no Metro server is needed to run it.
xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" \
  -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO -quiet

if [ "$DEVICE" != "booted" ]; then
  xcrun simctl bootstatus "$DEVICE" -b
fi
xcrun simctl install "$DEVICE" "$(ls -d build/Build/Products/Release-iphonesimulator/*.app | head -1)"
echo "Installed $BUNDLE_ID. Launch it with: xcrun simctl launch $DEVICE $BUNDLE_ID"
