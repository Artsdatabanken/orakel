Howto build for Android
-----------------------

Via Docker:

Create build config from build.json.sample - include passwords and correct keystore - put in root folder of repo

Start docker image and run android build with:

```
docker run --name androidenv --rm -v your_local_repo_folder\:/bitrise/src2 -it docker.io/bitriseio/docker-android sh /bitrise/src2/build.sh
```

Output signed bundle should then exist in your_local_repo_folder afterwards

Howto build for Iphone/Pad
--------------------------

```
git pull
rm -r "www"
npm install
npm run build
cp -R build/ www/
cordova platform remove ios
cordova platform add ios@6.1.0
cordova build ios --buildFlag="-UseModernBuildSystem=0" --codeSignIdentity="iPhone Developer" --developementTeam="Artsdatabanken" --packageType="app-store"
cordova-icon --icon=public/apple-512x512.png 
open ./platforms/ios/Artsorakel.xcworkspace/
```
  
  Xcode from here......
