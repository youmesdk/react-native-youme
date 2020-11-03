require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RCTYoume"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['repository']['url']
  s.platform     = :ios, "9.0"
  s.ios.deployment_target = '9.0'
  s.tvos.deployment_target = '10.0'

  s.source       = { :git => "git+http://jenkins:youme418888@code.nxit.us:9889/RTC-C/react-native-youme.git#stable", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m}"

  s.pod_target_xcconfig    = { # Ensures ccache is used if installed on the users machine
  # Header search paths are prefixes to the path specified in #include macros
    'HEADER_SEARCH_PATHS' => [
      '"$(PODS_TARGET_SRCROOT)/ios/RCTYoume/libs/include/"',
    ].join(' ')
  }
  s.ios.vendored_libraries = 'ios/RCTYoume/libs/libffmpeg3.3.a', 'ios/RCTYoume/libs/libyoume_voice_engine.a', 'ios/RCTYoume/libs/libYouMeCommon.a'

  s.dependency 'React'
end
