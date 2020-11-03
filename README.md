# 游密实时通话 React native 插件

## 运行 example

1. 安装依赖

   `npm install`

   or

   `yarn`

   RN >= 0.60

   安装 CocoaPods 依赖（iOS Only）

   iOS: `npx pod-install` or `cd ios && pod install`

   RN <= 0.59

   `react-native link`

2. 编译运行

   Android: `react-native run-android`

   iOS: `react-native run-ios`

3. 打包 Android APK

   `pushd android && ./gradlew clean && ./gradlew assembleRelease && popd`

   打包输出路径: example/android/app/build/outputs/apk/release/
