
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
   sheets as `../images`. (e.g., `background: url(../images/logo.png);` would
   show `images/EW/logo.png`, if the title is EW)


DEPLOYING
================================================================================

As of now, you just zip up the "index.html" file in the *-deploy folder and send
that to IT. All assets are loaded over the network.


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
        
There are a lot of URLs in Customization.strings… it's a good place to look if you want to
change something that is set by IT.

Note: Customization.strings is a binary plist. I have confirmed that textwrangler can edit
the file, but haven't found any other apps that can.
        

    

