# TimeTracker - Jira integrated time tracking Chrome Extension

I designed this Chrome extension to assist me in keeping my Timesheets up to date in the workplace.

![TimeTracker](https://imgur.com/V49WvEX.jpg)
## Features

 - Actively track time taken on issues
 - Automatically assign tickets & move to "In Development"
 - Automatically scrape Jira ticket ID from current webpage & get ticket info
 - 
 - Edit time taken & move time between issues
 - Submit log of day to Jira Tempo timetracking plugin
 - Track progress of working day - how long until day finished, what time day started, what time day ends
 - Change length of working day 
 - Track length of meetings & break time

## Installation

```bash
# clone it
$ git clone https://github.com/chalkyjoe/TimeTracker.git

# Install dependencies
$ npm install
```

> Please note it is also required for an instance of [cors-everywhere-master](https://github.com/Rob--W/cors-anywhere/) to be running to bypass CORS interface with Jira.

## Development

* Run script
```bash
# build files to './dev'
# start webpack development server
$ npm run dev
```
* If you're developing Inject page, please allow `https://localhost:3000` connections. (Because `injectpage` injected GitHub (https) pages, so webpack server procotol must be https.)
* [Load unpacked extensions](https://developer.chrome.com/extensions/getstarted#unpacked) with `./dev` folder.

#### React/Redux hot reload

This boilerplate uses `Webpack` and `react-transform`, and use `Redux`. You can hot reload by editing related files of Popup & Window & Inject page.

#### Using Redux DevTools Extension

You can use [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) on development mode.

## Build

```bash
# build files to './build'
$ npm run build
```

## Compress

```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

#### Options

If you want to build `crx` file (auto update), please provide options, and add `update.xml` file url in [manifest.json](https://developer.chrome.com/extensions/autoupdate#update_url manifest.json).

* --app-id: your extension id (can be get it when you first release extension)
* --key: your private key path (default: './key.pem')  
  you can use `npm run compress-keygen` to generate private key `./key.pem`
* --codebase: your `crx` file url

See [autoupdate guide](https://developer.chrome.com/extensions/autoupdate) for more information.

## Test

* `test/app`: React components, Redux actions & reducers tests
* `test/e2e`: E2E tests (use [chromedriver](https://www.npmjs.com/package/chromedriver), [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver))

```bash
# lint
$ npm run lint
# test/app
$ npm test
$ npm test -- --watch  # watch files
# test/e2e
$ npm run build
$ npm run test-e2e
```

## LICENSE

[MIT](LICENSE)
