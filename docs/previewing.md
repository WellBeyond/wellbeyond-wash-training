###### Demoing/previewing changes

You can use a Firebase preview channel to demo changes that you have made before releasing them for production.
See https://firebase.google.com/docs/hosting/test-preview-deploy?authuser=1#preview-channels for more information.

The preview runs against the production backend (wellbeyond-wash-training), so you should be careful about any 
updates to the data that you make while previewing as those will be affecting the live data.

You will need to run a build before the preview, and if you have written any new rules or functions you will
need to deploy those to the production environment first.

Before deploying the preview, make sure that you are running against the production environment:

`firebase use wellbeyond-wash-training`

To deploy the application to a preview site, you can use this command:

`npm run preview`

which actually runs this Firebase script

`firebase hosting:channel:deploy frontend-preview`

which will deploy from the `/build` directory.  The site that is created will be shown in the output of the
command.  It will look something like `https://wellbeyond-wash-training--frontend-preview-[random string].web.app` and 
should expire after 7 days.
