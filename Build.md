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
  
  425  git pull
  427  rm -r "www"
  428  npm install
  429  npm run build
  430  cp -R build/ www/
  433  cordova platform remove ios
  434  cordova platform add ios@6.1.0
  435  cordova build ios --buildFlag="-UseModernBuildSystem=0" --codeSignIdentity="iPhone Developer" --developementTeam="Artsdatabanken" --packageType="app-store"
  437  cordova-icon --icon=public/apple-512x512.png 
  438  open ./platforms/ios/Artsorakel.xcworkspace/
  
  Xcode from here......