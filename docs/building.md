#### Build Instructions

Remember to translate any new text before building.

`npm run translate`

Building for the web application is pretty simple and is done on your
local machine.  Building for Android or IOS (including live updates) is
more complicated and is done using the Ionic Appflow dashboard.  

##### Web Application Build Instructions

`npm run build`

This will create the optimized build in the /build directory, which can be tested by running:

`serve -s build`

Note that this will run with the NODE_ENV environment variable set to 'production', so it will point at 
the production Firebase instance. This is controlled in the file:

`/src/FIREBASE_CONFIG.ts`

It is a good idea to run a few simple tests using the built application running against the production 
environment before deploying it.  In particular, you will want to make sure that any of the new Firestore 
rules have been deployed successfully to the production environment before you deploy the code.

#### General Deployment Instructions

Before deploying a new version, you should update the version number in the
`package.json` file.

Before you deploy the application to any environment, you will need to 
make sure that the Firestore security rules and any Firebase functions are
up to date.

If you have created any new resources, remember that you will have to deploy the access rules before 
you deploy the application.  The firestore.rules gives unfettered access to system admin users, but new 
rules need to be created to allow client admins to access data for their organizations.  The rules are
maintained in the wellbeyond-wash-training project (since they apply to both applications).  You run them
from that project by first making sure that you are running against the correct environment:

`firebase use wellbeyond-wash-training`

and then deploying them:

`npm run deploy-rules`

Similarly, if you have created any new Firebase functions, you need to
deploy them by running:

`npm run deploy-functions`

#### Web Application Deployment Instructions

To deploy the application to `https://app.wellbeyondwater.com`, you can use this command:

`npm run deploy`

which actually runs this Firebase script

`firebase deploy --only hosting:wellbeyond-wash-training`

#### Deploy Live Updates

Most of the time, you will only be changing the javascript portion of the
application (as opposed to changing any of the native code in the Cordova
or Capacitor plugins).  In those cases, the application is set to take
live updates via the Ionic servers.  Basically, the application has been
written to check and see if it has updated javascript code when it starts
so that we don't have to go through the Google Play Store or Apple App Store
to push out small changes.  There are license limits on how many live updates 
can be done in a month, but the number of users is currently very small,
so there's no need to worry about that.

To build and deploy a live update, go to the Ionic Dashboard (https://dashboard.ionicframework.com)
and select the application, then Builds and click the New Build button.  You
select the commit that you want to build from, Web for the Target platform,
the latest Linux build stack, and enable Live Update to the Master and Production
channels.  Assuming that the build is successful, the new code will be available
the next time any user of the Android or IOS app opens it.

#### Deploy to Google Play Store

If you add or update a plugin, you will need to deploy to the play store. 
You may also want to do this after deploying a live update, especially one
where the major or minor version number is bumped.

Before deploying to the Play Store, you need to update the version numbers in
the android.defaultConfig section of  `android/app/build.gradle`.  There are two different values that need to be 
updated:

-  **versionCode** is a numeric version that should be incremented by 1 with
each deployment.  This is what the Play Store actually uses to enforce which
   build is the latest.
   
-  **versionName** is the text string that will show up to users as the version
in the Play Store.  It should match the version from `package.json`.
   
To build and deploy a new Android build, go to the Ionic Dashboard (https://dashboard.ionicframework.com)
and select the application, then Builds and click the New Build button.  You
select the commit that you want to build from, Android for the Target platform,
the latest Linux build stack, Build type of Release, the Signing Certificate
WellBeyondProd, check to enable distribution to the Google play store, and
a destination of WellBeyond WASH.  Assuming that the build is successful, it
should show up after 10-15 minutes in the Play Store Console - https://play.google.com/console/.

Inside of the Play Store Console, select the app WellBeyond WASH, go to
Releases - Production and Create new release.

#### Deploy to Apple App Store

This app is not currently approved for the App Store because of failure
to cite sources for the COVID 19 information.  
