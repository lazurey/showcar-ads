# showcar-ads

This library provides a unified solution for integrating advertisements (ads) on all AS24 Tatsu web pages.

## Features

  * Cookie Consent - Ads are not served if a user consent for third party cookies is required.
  * Dealer recognition - Ads are not served for dealers.
  * Responsive ads - Supports serving ads for specific resolution ranges if required.
  * Targeting - Supports setting of custom targeting if required.
  * Uses Google Publisher Tags - Ads are loaded asynchroneously in a non blocking fashion.

## Prerequisites:

This library uses custom-elements which come with the showcar-ui library. In order to use showcar-ads you need to include showcar-ui on your web page.

## How to include:

To include the showcar-ads library you can use our jigsaw fragment:

    <!--#include virtual="/assets/external/showcar-ads/showcar-ads-fragment.html" -->

Like in the showcar-ui library there are two versions of the "showcar-ads" library: "master" and "develop".

  * master => production version (must be stable)
  * develop => latest development version (might be broken)

By using URL parameters we can compare these two for any page that uses the ads library. So we can be sure that our changes won't break your page.

## Disable ads

In case you want to disable all ads in order to e.g. do performance tests you can do so by providing the "ads-off" parameter in the page URL like so:

    https://www.autoscout24.com?ads-off

### Integration in Scala template

In order to integrate the library using SSI, just use following snippet in your Scala template:

    <!--#include virtual="/assets/external/showcar-ads/showcar-ads-fragment.html?sc_ads_master_ver=@sc_ads_master_ver&sc_ads_develop=@sc_ads_develop&sc_ads_develop_ver=@sc_ads_develop_ver" -->

Note: Please, integrate the following URL parameters in your application sc_ads_master_ver, sc_ads_develop, sc_ads_develop_ver.
=> Get these url parameters in your Scala controller and pass them to the virtual include template


## Usage:

To integrate an ad slot on your page you need to define an "as24-ad-slot" element in your HTML like this:

    <as24-ad-slot
        type="doubleclick"
        slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2"
        sizes="[[300,100],[728,90]]"
        size-mapping="[[[1100,400],[728,90]],[[0,0],[[300,100],[300,50],[320,50],[320,100]]]]"
        min-x-resolution="768"
        max-x-resolution="1200"
        min-y-resolution="300"
        max-y-resolution="600"
        resolution-ranges="[[320,512],[768]]">
    </as24-ad-slot>

This is just an example. You don't have to provide all the attributes. Mandatory attributes are 'slot-id' and 'size-mappings'.

The following attributes can be specified in an ad-slot:

* type: Specifies the ad-server for the ad-slot (currently only doubleclick is supported).
* slot-id*: The id of the ad-slot. This will be provided by the ad-technology team.
* sizes: Supported ad sizes for this slot.
* size-mappings*: Sets an array of mappings from a minimum viewport size to slot size for this slot.
  Example values: [[0,0],[[300,100],[300,50],[320,50],[320,100]]].
  This mapping says that if the viewport size is at least 0px wide and 0px high, the ads with the following sizes are supported - 300x100, 300x50, 320x50, 320x100.
* min-x-resolution: Minimum viewport width in pixels. Ads are only shown if the viewport width > min-x-resolution value.
* max-x-resolution: Maximum viewport width in pixels. Ads are only shown if the viewport width < max-x-resolution value.
* min-y-resolution: Minimum viewport height in pixels. Ads are only shown if the viewport height > min-y-resolution value.
* max-y-resolution: Maximum viewport height in pixels. Ads are only shown if the viewport height < max-y-resolution value.
* resolution-ranges: Ad is only visible for specific viewport ranges.
  Example values: [[320,512],[768]].
  This means that the ad is only shown if the viewport is >= 320 AND <= 512 OR >= 768.


*These attributes are mandatory.

### Ad-Targeting

For Ad-Targeting integration you can use the "as24-ad-targeting" element like so:

    <as24-ad-targeting>
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


## Changelog / History

See [History.md](History.md)