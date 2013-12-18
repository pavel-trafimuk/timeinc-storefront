
STORE DOCS
================================================================================

## Overview: Read this before editing

The `bin/build` file constructs the `index.html` file using `index.html.tmpl`.
If you need to add/remove/reorder the javascript, or templates that are used,
the build script is what you should change.

Each title has...

 - a settings file (`settings/<MAG_CODE>.js`) which is where all
   link URLs, UI text, and other settings should be.

 - a stylesheet (`styles/<MAG_CODE>.scss`) which is responsible 
   for setting the colors, and any other settings necessary before importing
   `styles/_includes/_main.scss` and other shared styles to be used by the 
   app.

 - an images folder (`images/<MAG_CODE>/`) which is adressable from the style
   sheets as `../images`. (e.g., `background: url(../images/background-tile.png);`
   also, `background: url("../images/"+$BRAND_CODE+"/logo.png");` would
   show `images/EW/logo.png`, if the title is EW)

 - a banners folder (`banners/<MAG_CODE>/`) which compiles to just `banners/`.
   Any banners that are dynamic will probably need to import javascript from 
   the libs folder, which will usually be `../../lib/`

 
INCOMPLETE LIST OF TECHNOLOGIES
================================================================================

This is by no means a complete list, but should serve to get you started.

Core Technologies (if anything here is foreign, you should probably check it
out before getting started):

 - jQuery (http://jquery.com)
 - Backbone/Underscore (http://backbonejs.org | http://underscorejs.org)
 - Sass (http://sass-lang.com)
 - Handlebars (http://handlebarsjs.com)
 
Other stuff that's used, but you may not need to know right away:

 - Adobe DPS (http://www.adobe.com/devnet-docs/digitalpublishingsuite/LibraryAndStoreSDK-2.26/docs/index.html)
 - Compass (http://compass-style.org)
 - async.js (https://github.com/caolan/async)
 - moment.js (http://momentjs.com)
 - transit (http://ricostacruz.com/jquery.transit/)


DEPLOYING
================================================================================

The network assets (compiled into `-{BRAND_CODE}-store-deploy`) are on the 
savvis server in:

    /nas01/apps/subs3/content/cmdev/assets/appstorefronts-jq/{BRAND_CODE}/adobe/apple/ipad/v25

There are a couple helpful scripts in `bin/` that can make deployment relatively
easy. This is a simple compile and commit of the EW assets:

    bin/deploy cmdev EW

Which will run `bin/build EW` then checkout the appropriate folder from CVS,
copy in the newly built files, commit and tag them.

**NOTE**: deploying to qa or prod will switch to the qa or prod branch automatically
to ensure the correct code is deployed. cmdev will allow you to deploy whichever branch 
you're currently on.

You may want to add the following to your .bash_profile to ease this process:

    cdv25() {
      cd /nas01/apps/subs3/content/cmdev/assets/appstorefronts-jq/$1/adobe/apple/ipad/v25
    }
    alias gotov25=cdv25

...which allows you to go into the assets folder using just `gotov25 EW` in the 
shell


MAKING ZIP FILES FOR IT TO EMBED
================================================================================

There is a tool in the `bin` folder for generating the necessary zip files for 
IT. Just run the following to generate the zip files,

    bin/mkzipfiles {BRAND_CODE}
    
...which will output the necessary files into `-{BRAND_CODE}-zipfiles`.

IT will also need the following urls

- Online Banner (iPad)
- Online Banner (iPhone)
- Post-subs URL

...which you can get using `bin/get_urls {BRAND_CODE}`. 

IMPORTANT: Make sure you give them the PROD urls.


TIPS ON DEVELOPING ON A DEVICE
================================================================================

There are a few files you might want to edit in iExplorer when developing with a
device. Starting in the root directory of the App in iExplorer:

- Store:
    viewer.app/global/ui-extensions/toolbar-buttons/1/

- Library Banner (Offline)
    viewer.app/en.lproj/banner_offline/

- Library Banner URL (Online)
    viewer.app/Customization.strings
    
- Library Banner Height:
    viewer.app/LibraryConfig.plist
        serviceOptions > entitlement > bannerHeight
        
There are a lot of URLs in Customization.strings... it's a good place to look if 
you want to change something that is set by IT.

Note: Customization.strings is a binary plist. I have confirmed that 
textwrangler can edit the file, but haven't found any other apps that can.
        

CREATING NEW ASSETS FOR FUTURE BRANDS
================================================================================

You can get vector versions of the brands' logos at the following url:

    http://mytime.timeinc.com/TT/msm/content/TI_Logos.html


DEEP LINKS / FEATURED ARTICLES / WELCOME PAGE IMAGES / V2.5 TOOL
================================================================================

Adobe's feed is not very flexible and any changes have to go through IT (and
Adobe). As a result I found myself creating a tool for managing any other data
that requires manual entry.

Also, if you create a new app and the "TCM_FEED" returns a 404, the app will not
successfully load. You'll need to create a new feed for by manually modifying
the querystring, adding an empty issue, and saving (causing the server to create
a new json file).

All this fun stuff requires the "subtester" login, and happens at:

    http://ecom-dev01-app.usdlls2.savvis.net:10400/cgi-bin/v25app/index.py


ERROR LOGGING
================================================================================

Dev Apps may log errors using `console.log()` which will appear at:

    http://ecom-dev01-app.usdlls2.savvis.net:10400/cgi-bin/mobileLogs/logs.py

This method only works when you are on the NYDev wifi. and using a dev build of
the storefront. The "deploy" build assigns an empty function to `console.log`
to ensure nothing breaks, but (as expected) it does nothing.

*Logging in production*:

Any logging or error logging in production should use the `App.log()` and 
`App.error()` functions which log errors into omniture. Omniture is very slow
to show data so debugging in the dev app with `console.log()` is strongly 
preferred.

You can log into omniture at https://my.omniture.com but you'll need someone
from the Omniture team to set up an account for you.


UTILITY SCRIPTS (stuff in the `bin` folder)
================================================================================

Automation saves time and codifies a process so you don't have to remember it.
Pretty much everything that's been automated lives in the `bin/` folder - each
of those files are documented below, roughly in order of importance:

### bin/build {BRAND_CODE}
    
Generates 2 folders in the project root where {BRAND_CODE} is replaced with
whichever brand code you passed to the build script (e.g., "SM" for Real Simple)

1. `-{BRAND_CODE}-store-deploy` -- This is what will be used in production and
  contains the minified/concatenated javascript and CSS

2. `-{BRAND_CODE}-store-dev` -- This is an intermediary version which is useful
  for debugging. This folder contains a version of the store which you can view
  in Desktop Safari (`-{BRAND_CODE}-store-dev/index.mockapi.dev.html`) for a pretty
  good idea of how things are going to work.
  
### bin/deploy {ENVIRONMENT} {BRAND_CODE}

Runs `bin/build {BRAND_CODE}` then commits and tags the files in 
`-{BRAND_CODE}-store-deploy` using the `{ENVIRONMENT}`.

example: deploy Real Simple to our QA environment

    bin/deploy qa SM
    
For the `qa` and `prod` environment the corresponding branch in git is checked
out before running `bin/build`. This is to ensure that what is in our `qa`
branch in git is what ends up in our `qa` environment, and the same for prod.

The deploy script requires a working CVS setup (see the comments at the top
of the `bin/deploy` script for more details.
  
### bin/watch {BRAND_CODE}

Watches the files in `lib` and `store` and triggers `bin/build` when any of 
them are changed. Basically just a way to avoid having to manually run 
`bin/build` every time you save a file.

### bin/allbrands {command} [...arguments]

example:

    bin/allbrands deploy qa

...will run...

    bin/deploy qa {BRAND_CODE}

...replacing `{BRAND_CODE}` with each of the brands in `bin/brands.txt`.

Basically everything you pass to this command will be called once for each 
brand code, adding the brand code to the end. 

As an aside, this is why the brand code is always the last argument to all the 
utility scripts.

