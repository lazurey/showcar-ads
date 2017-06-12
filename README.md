# showcar-ads

This library provides a unified solution for integrating advertisements (ads) on all AS24 Tatsu web pages.

## Features

  * Cookie Consent - Ads are not served if a user consent for third party cookies is required.
  * Dealer recognition - Ads are not served for dealers.
  * Responsive ads - Supports serving ads for specific resolution ranges if required.
  * Targeting - Supports setting of custom targeting if required.
  * Uses Google Publisher Tags - Ads are loaded asynchronously in a non blocking fashion.

## Prerequisites:

This library uses custom-elements which come with the showcar-ui library. In order to use showcar-ads you need to include showcar-ui on your web page OR a polyfill for `document.registerElement` e.g. [WebReflection/document-register-element](https://github.com/WebReflection/document-register-element).

## How to include:

To include the showcar-ads library you can use our jigsaw fragment:

```html
    <!--#include virtual="/assets/external/showcar-ads/showcar-ads-fragment.html" -->
```

Like in the showcar-ui library there are two versions of the "showcar-ads" library: "master" and "develop".

  * master => production version (must be stable)
  * develop => latest development version (might be broken)

By using URL parameters we can compare these two for any page that uses the ads library. So we can be sure that our changes won't break your page.

## Disable ads

In case you want to disable all ads in order to e.g. do performance tests you can do so by providing the "ads-off" parameter in the page URL like so:

    https://www.autoscout24.com?ads-off=true

### Integration in Scala template

In order to integrate the library using SSI, just use following snippet in your Scala template:

```html
    <!--#include virtual="/assets/external/showcar-ads/showcar-ads-fragment.html?sc_ads_master_ver=@sc_ads_master_ver&sc_ads_develop=@sc_ads_develop&sc_ads_develop_ver=@sc_ads_develop_ver" -->
```

Note: Please, integrate the following URL parameters in your application sc_ads_master_ver, sc_ads_develop, sc_ads_develop_ver.
=> Get these url parameters in your Scala controller and pass them to the virtual include template

## Usage:

To integrate an ad slot on your page you need to define an "as24-ad-slot" element in your HTML like this:

```html
    <as24-ad-slot
        ad-unit="/1234/path-to-some/ad-unit"
        size-map-0x0="300x50, 320x100">
    </as24-ad-slot>
```

### Size mapping

The possible sizes of an ad slot must be defined as a mapping between min-resolution and possible sizes: e.g. `size-map-728x300="728x90, 728x300"` - which means if the window resolution is greater or equals 728x300 then we let Doubleclick choose ads with a format of 728x90 or 728x300 pixels.

*Please note: pixels are always CSS pixels.*

#### Some size mapping examples

```html
<as24-ad-slot
    ad-unit="/1234/path-to-some/ad-unit"
    size-map-0x0="300x50, 320x100">
</as24-ad-slot>

<as24-ad-slot
    ad-unit="/1234/path-to-some/ad-unit"
    size-map-0x0="300x50, 320x100"
    size-map-728x300="728x90, 728x300"
    size-map-1400x0="970x250, 728x90, 728x300">
</as24-ad-slot>

If size-map-0x0 is omitted then an empty mapping is assumed.
In the following example ads are only displayed when screen resolution equals or is higher than 728x300 pixels.

<as24-ad-slot
    ad-unit="/1234/path-to-some/ad-unit"
    size-map-728x300="728x90, 728x300">
</as24-ad-slot>
```

### Ad-Targeting

For Ad-Targeting integration you can use the "as24-ad-targeting" element like so:
```html
<as24-ad-targeting style="display:none;">
    {
        "make":13,
        "model":[18482,37],
        "ad":"private",
        "price":3,
        "fr":"8",
        "miles":"6",
        "art":6,
        "zip":"F95130",
        "zip2":"F95130",
        "did":"15621140",
        "seal":[],
        "hp":"7",
        "acc":"U",
        "fuel":"D",
        "gear":"A",
        "ECO":"YES",
        "equi":[1,2,3,17,30,38,41,42],
        "age":"7",
        "seg":["de_oem","mass_oem","compact","low_price","mid_fr","high_hp","high_miles"],
        "type":"U"
    }
</as24-ad-targeting>
```

### Cookie consent

There are some countries in which the loading of ads is prohibited without having the user's consent
for accepting third party cookies. Usually it is wished that the ads are loaded as soon as the user
agrees with this. In this case a "cookie-consent-given" event has to be triggered OR the `cookieConsent=1` cookie needs to be set before.
```javascript
window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }))
```

### Events

* `ad-slot-empty`: is fired when there is no ad to show in the slot
* `ad-slot-loaded`: is fired when an ad is loaded in the slot

### Other attributes on as24-ad-slot tags

##### preload
The ad will be loaded when it nears the viewport (and not just after being in the viewport). The value of the attribute defines the distance how near the ad should be to the viewport to start loading it.

```html
<as24-ad-slot
        ad-label="Anzeige"
        ad-unit="/1234/path-to-some/adunit"
        size-map-0x0="300x50, 320x100"
        preload="300">
</as24-ad-slot>

##### collapse-empty
If no ad can be delivered the slot is collapsed. This can cause the page to jump so use it sparingly. It can be acceptable in some cases.

##### immediate
The is loaded immediately. We do not wait until the user scrolls to them.

##### openx-ignore
The ad slot is not included in the OpenX bidding.

##### out-of-page
Defines an out of page ad

```html
<as24-ad-slot
        ad-unit="/1234/path-to-some/adunit"
        out-of-page
        size-map-728x300="1x1"
        size-map-0x0="">
</as24-ad-slot>
```

##### ad-label
Adds an extra label next to the ad slot to explicitely mark it as an ad. Mostly used on German pages when ads are inside content. By law we are required to visually mark ads as ads.
 
```html
<as24-ad-slot
        ad-label="Anzeige"
        ad-unit="/1234/path-to-some/adunit"
        size-map-0x0="300x50, 320x100">
</as24-ad-slot>
```

### Refreshing ads

Each adslot defines a custom `refresh()` method. Refresh calls among multiple adslots are collected and called together in a time frame of ca. 50 milliseconds.

```js
document.querySelector('as24-ad-slot').refresh();
```

### Placeholders

Each ad slot automatically receives an AutoScout24 logo as placeholder. This can be overridden by adding one of these classes:
- .sc-ads-silent-placeholder - Instead of logo the adslot gets a border
- .sc-ads-no-placeholder - no placeholder

```html
<as24-ad-slot
        class="sc-ads-silent-placeholder"
        ad-unit="/1234/path-to-some/adunit"
        size-map-0x0="300x50, 320x100">
</as24-ad-slot>

<as24-ad-slot
        class="sc-ads-no-placeholder"
        ad-unit="/1234/path-to-some/adunit"
        size-map-0x0="300x50, 320x100">
</as24-ad-slot>
```
