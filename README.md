<p align="center">
    <img src="images/logo.png" alt="Manifest" title="Manifest">
</p>

<p align="center">
    <a href="https://http://www.android.com">
        <img src="https://img.shields.io/badge/Created for-Node.js-teal.svg?style=flat">
    </a>
    <a href="https://http://www.android.com">
        <img src="https://img.shields.io/badge/Written in-TypeScript-purple.svg?style=flat">
    </a>
    <a href="https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)">
        <img src="https://img.shields.io/badge/License-Apache 2.0-blue.svg?style=flat">
    </a>
</p>

## At a Glance

`Manifest` is a framework that takes control over Node.js app using a single configuration file. `Manifest` includes `Express` framework and `Handlebars` server-side rendering under the hood.

## How to Get Started

Type in Terminal:

`yarn add @imatyushkin/manifest`

## Requirements

No special requirements.

## Usage

### Launching Server

Import Manifest module in your `index.ts`:

```typescript
import * as mfst from "@imatyushkin/manifest";
```

Then call `listen` method from `App` instance:

```typescript
let app = new mfst.App().listen();
```

That's all! Server is started 🚀

For any personal purposes, you can use `Express` instance by calling

```typescript
app.expressInstance
```

Quite simple, right? 😉

### Manifest declaration

The easiest way to control what `Manifest` framework does is to declare a special manifest file. Let's call it `manifest.ts`:

```typescript
import * as mfst from "@imatyushkin/manifest";

export const manifest: mfst.Manifest = {
	server: {
		port: environment.port,
		staticLocations: [],
		requestHandlers: [],
		routes: [
			{
				url: `/`,
				methods: {
					get: {
						text: `<h1>Hello</h1>`,
					}
				}
			},
			{
				url: `*`,
				methods: {
					get: {
						text: `Page not found`,
						status: 404
					}
				}
			}
		],
		viewEngines: {
		},
		currentViewEngine: mfst.ViewEngine.handlebars
	},
	analytics: [
	]
};
```

Above you can see a very simple configuration that is enough to launch a primitive server which will be able to respond to HTTP requests.

## License

`Manifest` is available under the Apache 2.0 license. See the [LICENSE](./LICENSE) file for more info.
