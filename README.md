# elm-thanks
🌟 Say thanks to everyone who helps build and maintain your Elm dependencies

![Example gif](https://github.com/zwilias/elm-thanks/raw/master/example.gif)

Vaguely inspired by [this The Changelog tweet](https://twitter.com/changelog/status/935549633341853698) (ok, maybe more than just _vaguely inspired_), I figured this type of thing would be nice to have in the Elm world, too.

The idea is to express our gratitude to the creators and maintainers of our dependencies by starring the github repositories. If you're anything like me, actually going to the GitHub repo is asking too much so "here's an app for that".

## Install it

```sh
$ npm i -g elm-thanks
```

## Configure authentication

[Create a github token](https://github.com/settings/tokens/new) with `public_repo` permissions and export it as an environment variable: `export GITHUB_TOKEN=yourtokengoeshere`

## Run it

From any folder containing an `elm-package.json` run

```sh
$ elm-thanks
```

(or even `elm thanks`)

## Caveat

In the interest of getting this hacked together quickly; the code is poor.

---

Made with ❤️ and licensed under BSD3
© 2017 - Ilias Van Peer
