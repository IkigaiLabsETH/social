Introducing Ikigai Labs XYZ: Elevate your lifestyle and investment portfolio with our groundbreaking Web3-enabled platform, designed to connect art aficionados and lifestyle travelers like never before.

💎 ArtChannels: Unlock the world of NFTs and digital art. Our community-driven curation ensures you're always ahead of the curve. ROI: A staggering 200%, driven by our efficient CAC to CLTV ratio.

🌍 Travel Circles: Experience the epitome of luxury travel through our decentralized communities. Use $Ikigai tokens for bespoke recommendations and exclusive deals.

💌 Tokenized Interactions: Transform your social engagements with our $Ikigai token. Say goodbye to passive scrolling; every interaction is now a rewarding experience.

📺 Sponsored Channels & Native Advertising: Seamlessly earn $Ikigai tokens through our curated advertising partnerships with iconic brands in the art and travel sectors.

🔐 Privacy and Audience Control: Your data, your rules. Blockchain-verified contracts ensure transparent and secure collaborations.

💰 Financial Metrics: Our robust financial model offers an ROI of 200%, with a CAC of $100 and a CLTV of $300.

📈 Use of Funds & Valuation: We're allocating funds towards development (40%), marketing (30%), and operations (30%). Our valuation is strategically positioned for exponential growth, providing substantial upside for early investors.

# Pepo 2.0

Ambassadors are invited to contribute 30-second videos about art & destinations, and AI agents will curate options, they will also assist to produce content, design and code.

A mobile-only app with "channels" of topics that people can join in and video chat. As it is with any platform, there will be early adopters before the majority starts to come on. It is my hope that more people will join it because it is honestly such a liberating experience to participate in topics of interests and get insider info. Tokens are used in the app to support and thank ambassadors (each “like” automatically transfers a token to the maker), for curation and personalization, and soon for replies and messaging.

It is somewhat similar to Instagram but it focuses on surf travel influencers, those with some authority, expertise and influence. As a travel expert, you can share your photos, locations and tips and tricks with everyone who follows your channel. 

As a follower, you can follow different channels of your interests: gen art, web3 or a travel channel that focuses specifically on a certain travel destination. So if you’re travelling to a new place and you need advice, you can leave a comment or ask a question to the expert. He or she will get back to you soon with answers. How great is that?

> Going ahead, there will be areas where the free app, will monetise, specifically around areas like sponsored channels, and essentially what we now think of as “native advertising.” Users can be paid tokens to watch high quality 30sec ads from the iconic industry brands.

> Specific channels provide a social interaction among like-minded people to be able to share your thoughts, ideas and stories as well as ask ambassadors recommendations. Channels can be private, public or secret allowing you to set the tone and audience for yours.

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
