Howto build for Android
-----------------------

Via Docker:

Create build config from build.json.sample - include passwords and correct keystore - put in root folder of repo

Start docker image and run android build with:

```
docker run --name androidenv --rm -v your_local_repo_folder\:/bitrise/src2 -it docker.io/bitriseio/docker-android sh /bitrise/src2/build.sh
```

Output signed bundle should then exist in your_local_repo_folder afterwards
