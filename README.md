# android
# create release apk
cd android && ./gradlew assembleRelease
# install release apk
cd android && ./gradlew installRelease


# ios
bundle
react-native bundle --platform=ios --dev=false --entry-file=index.ios.js --bundle-output=./ios/RNFeatureList/react.jsbundle --minify=true