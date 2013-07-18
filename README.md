
STORE DOCS
================================================================================

## Overview: Read this before editing

The `bin/build` file constructs the `index.html` file using `index.html.tmpl`.
If you need to add/remove/reorder the javascript, or templates that are used,
the build script is what you should change.

Each title has…

 - a settings file (`settings/<MAG_CODE>.js`) which is where all
   link URLs, UI text, and other settings should be.

 - a stylesheet (`styles/<MAG_CODE>.scss`) which is responsible 
   for setting the colors, and any other settings necessary before importing
   `styles/_includes/_main.scss` and other shared styles to be used by the 
   app.

 - an images folder (`images/<MAG_CODE>/`) which is adressable from the style
   sheets as `../images`. (e.g., `background: url(../images/logo.png);`
   also, `background: url("../images/"+$BRAND_CODE+"/logo.png");` would
   show `images/EW/logo.png`, if the title is EW)

 - a banners folder (`banners/<MAG_CODE>/`) which compiles to just `banners/`.
   Any banners that are dynamic will probably need to import javascript from 
   the libs folder, which will usually be `../../lib/`
 

DEPLOYING
================================================================================

As of now, you just zip up the "index.html" file in the *-deploy folder and send
that to IT. All assets are loaded over the network. (see next section)

The network assets are on the savvis server in:

    /nas01/apps/subs3/content/cmdev/assets/appstorefronts-jq/{BRAND_CODE}/adobe/apple/ipad/v25


MAKING ZIP FILES FOR IT TO EMBED
================================================================================

Zip files should only contain the HTML file as of now. the file MUST be renamed
to "index.html" if that is not the filename in the source dir.


Store Tab:
    {BRAND_CODE}-store-deploy/embed_index.html
    
Info Tab:
    {BRAND_CODE}-store-deploy/info/embed_index.html
    
My Account Tab:
    {BRAND_CODE}-store-deploy/myaccount/embed_index.html


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
        
There are a lot of URLs in Customization.strings… it's a good place to look if 
you want to change something that is set by IT.

Note: Customization.strings is a binary plist. I have confirmed that 
textwrangler can edit the file, but haven't found any other apps that can.
        

CREATING NEW ASSETS FOR FUTURE BRANDS
================================================================================

You can get vector versions of the brands' logos at the following url:

http://mytime.timeinc.com/TT/msm/content/TI_Logos.html
    

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

