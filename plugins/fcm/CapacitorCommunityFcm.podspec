
  Pod::Spec.new do |s|
    s.name = 'CapacitorCommunityFcm'
    s.version = '1.1.1'
    s.summary = 'Enable Firebase Cloud Messaging features for Capacitor apps'
    s.license = 'MIT'
    s.homepage = 'https://github.com/capacitor-community/fcm'
    s.author = 'Stewan Silva'
    s.source = { :git => 'https://github.com/capacitor-community/fcm', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
    s.dependency 'FirebaseMessaging'
    s.static_framework = true
  end
