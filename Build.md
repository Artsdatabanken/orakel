Howto build for Android
-----------------------

Via Docker:

Create build config from build.json.sample - include passwords and correct keystore

Start docker image with interactive session:

```
docker run --name androidenv --rm -v your_local_folder:/bitrise/src2 -it docker.io/bitriseio/docker-android bash
```

```
git clone https://github.com/Artsdatabanken/orakel.git
cd orakel/
mkdir www
npm install
npm run build
cp -r build/* www/
cordova platform add android
cordova build android --release --buildConfig=/bitrise/src2/build.json -- --packageType=bundle
cp /bitrise/src/orakel/platforms/android/app/build/outputs/bundle/release/app.aab /bitrise/src2/
```

Output signed bundle should then exist in your_local_folder
