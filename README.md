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

### Launch Server

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

### Declare manifest

The easiest way to control

## License

`Manifest` is available under the Apache 2.0 license. See the [LICENSE](./LICENSE) file for more info.
