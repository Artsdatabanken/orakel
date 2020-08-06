cp -r /bitrise/src2/* /bitrise/src/
cd /bitrise/src/
mkdir www
npm install
npm run build
cp -r build/* www/
cordova platform add android
cordova build android --release --buildConfig=/bitrise/src2/build.json -- --packageType=bundle
cp /bitrise/src/platforms/android/app/build/outputs/bundle/release/app.aab /bitrise/src2/