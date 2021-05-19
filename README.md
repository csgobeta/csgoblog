# CS:GO BLOG 2.0
![image](https://user-images.githubusercontent.com/14220088/118892666-e9020500-b909-11eb-87c4-bb6f6d798f14.png)

CS:GO Blog 2.0 is an unofficial fan-made recreation/remaster of [blog.counter-strike.net](https://blog.counter-strike.net).

It was created to give the official blog website a fresher, more responsive look in “Panorama UI”-esque style while preserving all the useful content.

Please note, that CS:GO Blog 2.0 is not Official in any shape or form and is not affiliated with [Valve and/or Valve Software®](https://www.valvesoftware.com/en/).

Animated Agent Models, Background Videos, CS:GO Logo, and all the Blogposts are made and owned by [Valve and/or Valve Software®](https://www.valvesoftware.com/en/).

## Developers:
- [Λquαꝛɪuᵴ](https://github.com/abitmoony)
- [Doruk](https://github.com/DorukSega)

## Localisation Credits:
- German, Romanian - Her Sauben - 100%
- Portuguese-Brazil - Nishiyama - 100%
- Portuguese - João Rodrigues - 100%
- Polish - Rowleto - 100%
- Italian - Matitone - 100%
- Ukranian - Ivan - 100%
- French - Agarose - 100%

*You can contact us if you want to help us with the localisation*

## FAQ
**I switched to X language and while blogposts are localised, the site is not localised?**
- This is because We couldn't find a native person to help us. If you are interested in helping, please contact.

**I am using Internet Explorer for some reason and website doesn't work?**
- Sadly Internet Explorer is not supported.

**I am using Mozilla Firefox and it doesn't look like CS:GO Panorama?**
- Gecko Engine (ie Firefox) doesn't support `backdrop-filter: blur()`. We used a transparent gray color to mimick this in a way.

**Some posts on languages other than english does not exist?**
- Some posts are not translated or not uploaded by Valve.

## Guidelines
Simple guidlines for people who want to dive in to the details of the site or us developers who want to remember.
### Parameters
- id = spesific post id, will display just the spesific post  
- c = pages or tabs, based on what is written it will start with that page (when empty it will display M)
- p = page number, it will directly display that page, used only on blogposts and patchnotes tabs/pages (also search)
- l = changes the language for displayed info, cached as well (when empty it will return english or last cached)
- s = search text, it will return the results on a tab
### Cookies
- Language(l) = last picked language
- Not Firsttime(not_firsttime) = checks if it is user's first time or not
- Volume(v) = volume setting
- Background(b) = background video setting
- Model(m) = selected agent setting
- Model Toggle(mtoggle) = model is visible or not 
