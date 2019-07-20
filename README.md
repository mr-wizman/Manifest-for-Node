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

### Manifest Declaration

The easiest way to control what `Manifest` framework does is to declare a special manifest file. Let's call it `manifest.ts`:

```typescript
import * as mfst from "@imatyushkin/manifest";

export const manifest: mfst.Manifest = {
	server: {
		port: 3000,
		staticLocations: [],
		requestHandlers: [],
		routes: [
			{
				url: `/`,
				methods: {
					get: {
						text: `<h1>This page is under construction</h1>`,
					}
				}
			},
			{
				url: `*`,
				methods: {
					get: {
						text: `<h1>Page not found</h1>`,
						status: 404,
						timeout: 20000
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

Above you can see a very simple configuration that is enough to launch a primitive server which will be able to respond to HTTP requests. Now it's time to pass the configuration to `Manifest` app:

```typescript
import * as mfst from "@imatyushkin/manifest";

import {
	manifest
} from "./manifest";

mfst.setDefaultManifest(
	manifest
);

new mfst.App().listen();
```

Please note that `setDefaultManifest` method **should be called first** before you create new `App` instance.

### Manifest Sections

#### `server.port`

Port number that server will be listen to.

#### `server.staticLocations`

Array of objects. Each object describes an Express static location.

Example:

```typescript
{
	staticLocations: [
		{
			alias: `/views`,
			realPath: `${__dirname}/frontend`
		}
	]
}
```

#### `server.requestHandlers`

Array of lambda functions. Each function has `request` parameter and handles request before it's processed by `Manifest` framework. You can use handlers for any purpose. For example, sending request information to the console output:

```typescript
requestHandlers: [
	(request) => {
		console.log("Request:", `"${request.url}"`);
	}
]
```

#### `server.routes`

Array of objects. Each object represents a different route. Example:

```typescript
{
	routes: [
		{
			url: `/`,
			methods: {
				get: {
					text: "Hello!"
				}
			}
		}
	]
}
```

#### `server.routes[0].methods`

The `methods` object can include any of these HTTP methods:

- `get`
- `post`
- `put`
- `delete`

Each HTTP method describes the response to client's request. There are 5 types of response:

- Text (returns simple text)
- JSON (returns JSON object or array)
- Page (returns page and data for server-side rendering)
- Redirect (sends command for redirection to another URL)
- Custom (arrow function that is implemented by developer and returns any of the 4 types above)

#### `server.viewEngines`

Documentation will be added soon.

#### `server.currentViewEngine`

Documentation will be added soon.

#### `analytics`

Documentation will be added soon.

## License

`Manifest` is available under the Apache 2.0 license. See the [LICENSE](./LICENSE) file for more info.
