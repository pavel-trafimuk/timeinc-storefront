
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

However you should always deploy using the `bin/deploy` script. There are a
couple helpful scripts in `bin/` that can make deployment relatively easy. 

This is a simple compile and commit of the EW assets:

    bin/deploy cmdev EW

Which will run `bin/build EW` then checkout the appropriate folder from CVS,
copy in the newly built files, commit and tag them.

See the detailed description of `bin/build` and `bin/deploy` in the Utility
Scripts section below.


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

Note: iOS 5 is the last iOS version that allows this - since we have deprecated
iOS 5, this isn't all that useful. You should be developing with a proxy.

That said, there are a few files you might want to view in iExplorer when 
developing with a device. Starting in the root directory of the App in iExplorer:

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
you want to check something that is set by IT.

Note: Customization.strings is a binary plist. I have confirmed that 
textwrangler can edit the file, but haven't found any other apps that can.


DEVELOPING WITH A PROXY
================================================================================

See Tim's excellent guide to using a charles proxy: 
http://ecom-dev01-app.usdlls2.savvis.net:10400/html/documentation/appstorefronts/proxy.html
        

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

### bin/setup

This documents the dependencies for building the store. If you have gem, and
npm installed and configured properly, you can run this to install the 
dependencies.

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

The data source for this script is `bin/brands.txt` - only brands named in 
that file are used.

### bin/generate_stuff_for_IT

Generates everything IT needs from us to build a new app:

 - Builds the storefronts for all brands
 - Generates the `urls.txt` file for IT
 - Generates zip files which you need to send to IT
   
   Last time we did this it was by copying them to...
    
   mac: (in Finder: "Go" > "Connect to Server" - paste afp url into "Server Address")
     afp://nyctcmmvf1/TCM/HOME/EVERYONE/TABLET ROLLOUT/app submissions/iOS/ZIP files from TCM
    
   windows:
     H:\nyctcmmvf1\TCM\HOME\EVERYONE\TABLET ROLLOUT\app submissions\iOS\ZIP files from TCM
     
On Mac, note that you can't connect to the share drive if you're already 
connected to the Savvis VPN.

### bin/cleanup

Deletes all the generated files from the working directory (anything
like `-XX-store-dev`)

### bin/brandcode_to_brandname {BRAND_CODE}

Takes a brand code and returns the brand name. The data source is 
`bin/brands.txt` - this is mainly used by other scripts.


LIBRARY BANNERS
================================================================================

All reusable code for banners is in the `lib/libBanner.js` file, which depends
on `lib/AdobeLibraryAPI.js`, `lib/jquery.js`, and the brand's 2 settings files,
`store/settings/{BRAND_CODE}.js` and `store/settings/settings_loader.js`.

**Important**: `AdobeLibraryAPI.js` must be in the `<head>` of the document or
it will not work.

`libBanner.js` provides adds one object to the global scope, `window.libBanner`
which exposes the following:

### libBanner.ios_version

An array that looks like `[7, 0, 1]`, representing the current version of iOS.

Usually you don't need this and it's easier to use `libBanner.is_version()`

### libBanner.is_version(versionExpession) -> boolean

Takes one argument (string) and returns true if the current iOS version 
matches.

Example (on a device running iOS 6.0.1):

```javascript
libBanner.is_version("<7") == true
libBanner.is_version("=6") == true
libBanner.is_version("6") == libBanner.is_version("=6")
libBanner.is_version("7") == false
libBanner.is_version("!6") == false
libBanner.is_version("!6.1.1") == true
libBanner.is_version("<=5") == false
libBanner.is_version(">5") == true
libBanner.is_version(">6.0.0") == true
```

### libBanner.api

Provides access to the `adobeDPS` object or the `MockAPI` object depending 
which is loaded. Hopefully you never need to use this.

### libBanner.buy_issue(product_id, dossier_id)

Purchase a folio.

`product_id` is the product id of the folio to purchase. Looks like
`com.timeinc.instyle.ipad.inapp.12112013`.

`dossier_id` (optional) is used for deep linking into a folio. If it's 
provided the user will be sent directly to the page in the folio that 
corresponds to the dossier id.

### libBanner.buy_sub(product_id)

Purchase a Subscription.

`product_id` is the product id of the subscription to purchase. Looks like
`com.timeinc.instyle.ipad.subs.9`.

**Note**: when testing in an appfactory app, you can not trigger a subscription
purchase if you are signed in to a real app store account. You *must* test
purchasing with a test account which is provided by IT when using appfactory
builds.

### libBanner.lucie_register()

Opens the overlay dialog that detects subscriptions and then prompts the user
to register for a lucie account.

### libBanner.track_page_view(page_name)

Track the current banner load in the DPS omniture Suite using Adobe's API
(same method as `libBanner.track_user_action()`).

`page_name` is custom variable 4 (eVar 49, prop 49). Should look like:
  - "Library|Banner|Subscriber"
  - "Library|Banner|Nonsubscriber"
  - "Library|Banner|Allusers"

### libBanner.track_user_action(event_name, page_name)

Trigger an omniture beacon via Adobe's API for the DPS omniture suite.

`event_name` is custom variable 3 (eVar 48, prop 48) and should look like:
  - "banner_taps_subscribe"
  - "banner_taps_buyissue"
  - "banner_taps_downloadfree"
  - "banner_taps_register"

`page_name` is custom variable 4 (eVar 49, prop 49). It should match the 
page_name that was passed to the `libBanner.track_page_view()` function.

### libBanner.SlideshowGallery() -> SlideshowGallery object

Constructor (must be called with `new`). Creates a slider gallery. Expects 
the HTML like the following to be in  the DOM:

```html
<div class="carousel">
  <div class="slides">
    <div class="slide this-is-slide-1"></div>
    <div class="slide this-is-slide-2" data-ios-version="<7"></div>
    <div class="slide this-is-slide-3" data-ios-version=">=7.0.2"></div>
  </div>
</div>
```

Generally you should make a copy of a banner that already has a slideshow 
gallery if you want to use this as there is a fair amount of required CSS as
well.

The `data-ios-version` attribute is fully documented in libBanner, but in
short, `.this-is-slide-2` will only be visible on devices using iOS versions
lower than 7, and `.this-is-slide-3` will be visible on devices using iOS
versions 7.0.2 and up. This functionality is implemented in the 
`SlideshowGallery()` constructor.

Example usage:

```js
var gallery = new libBanner.SlideshowGallery();
gallery.enableTouch().slideEvery(5000);
```

**Note**: the SlideshowGallery does not automatically trigger any 
functionality. You must call `gallery.slideEvery()` to enable the auto-slide 
behavior and `gallery.enableTouch()` to enable swiping between slides.

The SlideshowGallery object has a number of methods, documented below...

### libBanner.SlideshowGallery().slideEvery(slide_delay)

Enables the auto-slide functionality. The Gallery will slide to the next
slide (using `gallery.slideNext()`) every slide_delay milliseconds.

Example:

```js
var gallery = new libBanner.SlideshowGallery();
// automatically move to the next slide every 5 seconds
gallery.slideEvery(5000);
```

### libBanner.SlideshowGallery().cancelAutoSlide()

Disabled the auto-slide functionality. You generally want to use this when
the use has taken an action on one of the slides (like tapping a button)
so that it doesn't automatically move to the next slide while the action is
happening.

Example:

```js
var gallery = new libBanner.SlideshowGallery();
gallery.slideEvery(5000).enableTouch();

...later on...
gallery.cancelAutoSlide();
```

### libBanner.SlideshowGallery().slideNext()

Manually trigger the gallery to move to the next slide.

Example:

```js
var gallery = new libBanner.SlideshowGallery();
// Immediately go to the second slide
gallery.slideNext();
```

### libBanner.SlideshowGallery().slidePrev()

Manually trigger the gallery to move to the previous slide. (Works the same
as the `gallery.slideNext()` method)

### libBanner.SlideshowGallery().enableTouch()

Allows the user to swipe between slides in the gallery.

Example:

```js
var gallery = new libBanner.SlideshowGallery();
gallery.enableTouch();
```

