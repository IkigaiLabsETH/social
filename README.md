# Pepo 2.0

Ambassadors are invited to contribute 30-second videos about surf destinations, using the hashtag #surftravel — and host Affif will select his favorites, he will also post snippets of podcast interviews & webtv series from iconic storytellers. Ambassadors will reply on booking requests.

A mobile-only app with "channels" of topics that people can join in and video chat. As it is with any platform, there will be early adopters before the majority starts to come on. It is my hope that more people will join it because it is honestly such a liberating experience to participate in topics of interests and get insider info. Tokens are used in the app to support and thank ambassadors (each “like” automatically transfers a token to the maker), for curation and personalization, and soon for replies and messaging.

The platform connects you with experts in surf travel. Ask questions: If I’m going to a surf destination and I can connect to someone there and ask tips on “where are the best places to stay?”, or ”where are the best spots?” or “what’s the best time to visit a certain surf area?”

Pepo is somewhat similar to Instagram but it focuses on surf travel influencers, those with some authority, expertise and influence. As a travel expert, you can share your photos, locations and tips and tricks with everyone who follows your channel. 

As a follower, you can follow different channels of your interests: surfing, healthy lifestyle or a travel channel that focuses specifically on a certain travel destination. So if you’re travelling to a new place and you need advice, you can leave a comment or ask a question to the expert. He or she will get back to you soon with answers. How great is that?

> Going ahead, there will be areas where the free app, will monetise, specifically around areas like sponsored channels, and essentially what we now think of as “native advertising.” Users can be paid tokens to watch high quality 30sec ads from the iconic surf industry brands.

> Specific channels provide a social interaction among like-minded people to be able to share your thoughts, ideas and stories as well as ask ambassadors about surf spots, restaurant recommendations. Channels can be private, public or secret allowing you to set the tone and audience for yours.

The encouragement of sending videos to interact with one another creates a more personal experience for the user by breaking the anonymity the internet can often create.

### Check-points for build

#### API / Endpoints `(src/constants/index.js)`
1. API endpoint
2. Platform endpoint
3. Tracker endpoint

#### Economy / Wallet config `(src/constants/index.js)`
1. Token ID
2. Session key expiry time
3. Spending limit
4. High key session key expiry time

#### Keys / Certificates
1. Twitter Key, Twitter Secret `(src/constants/index.js)`
    1. Twitter Key in iOS `info.plist` - `twitterkit-<secret>`
2. Firebase
    1. iOS: `ios/GoogleService-Info.plist`
    2. Android: `android/app/google-services.json`
    3. In case of iOS, the APN certificate needs to be uploaded to Firebase.
3. Crashlytics: No specific set-up needed as same keys used in all environments.
4. Certificates (for SSL pinning) for API endpoints to be added
    1. iOS: `ios/Pepo2/AppDelegate.m`
    2. Android: `android/app/src/main/res/xml/network_security_config.xml`

#### Universal linking
1. In website (`pepo-web`), make sure the universal links config is updated
2. Within app, update capabilites / manifest:
    1. iOS: `ios/Pepo2/Pepo2.entitlements`
    2. Android: `android/app/src/main/AndroidManifest.xml`

#### Dynamic linking
1. Within app, update capabilites / manifest with deeplinking domain:
    1. iOS: `ios/Pepo2/Info.plist` and `ios/Pepo2/Pepo2.entitlements` 
    2. Android: `android/app/src/main/AndroidManifest.xml`

### Build Instructions (for iOS)

- [ios-publish_app_production.md](iOS_production.md)

### Build Instructions (for Android)

- [android/publish_app_production.md](android/publish_app_production.md)
- [android/publish_app_sandbox.md](android/publish_app_sandbox.md)

### Manual installations needed (for iOS)

#### FFmpeg 

1. Download the frameworks from: https://github.com/tanersener/mobile-ffmpeg/releases/download/v4.2.2.LTS/mobile-ffmpeg-min-gpl-4.2.2.LTS-ios-framework.zip
2. Move the unzipped folder to `pepo-react/ios/ReactNativeFFmpeg`

#### Fabric Crashlytics

1. Download the frameworks from: https://s3.amazonaws.com/kits-crashlytics-com/ios/com.twitter.crashlytics.ios/3.13.4/com.crashlytics.ios-manual.zip.
2. Move the unzipped folder to `pepo-react/ios/Crashlytics`
 
You can also use https://fabric.io/kits/ios/crashlytics/manual-install?step=0 to get updated download links if needed.

#### Firebase

1. Download the frameworks from: http://sdk.stagingost.com.s3.amazonaws.com/ThirdPartyFrameworks/Firebase.zip
2. Move the unzipped folder to `pepo-react/ios/Firebase` (all unzipped files and folders should be inside `pepo-react/ios/Firebase`)

You can also use https://github.com/firebase/firebase-ios-sdk/releases/ to get updated download links if needed.
