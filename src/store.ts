import {
	Manifest
} from "./configuration";

import {
	ViewEngine
} from "./view-engines";

type Store = {
	manifest: Manifest
};

var defaultManifest = {
	server: {
		port: 3000,
		staticLocations: [],
		requestHandlers: [],
		routes: [
		{
			url: `*`,
			methods: {
				get: {
					text: "Built with Manifest library 🎉"
				}
			}
		}
		],
		viewEngines: {},
		currentViewEngine: ViewEngine.handlebars
	},
	analytics: []
};

const store: Store = {
	manifest: defaultManifest
};

export const getDefaultManifest: () => Manifest = () => {
	return store.manifest;
}

export const setDefaultManifest: (manifest: Manifest) => void = (manifest) => {
	store.manifest = manifest;
};
