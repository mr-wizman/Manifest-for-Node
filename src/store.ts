import {
	Manifest
} from "./configuration";

import {
	ViewEngine
} from "./view-engines";

export const getDefaultManifest: () => Manifest = () => {
	return {
		server: {
			port: 3000,
			secure: false,
			corsEnabled: true,
			staticLocations: [],
			requestHandlers: [],
			routes: [
				{
					url: `*`,
					methods: {
						get: {
							text: `
								<h1>
									Built with <a href="https://github.com/igormatyushkin014/Manifest-for-Node">Manifest</a> framework 🎉
								</h1>
							`
						}
					}
				}
			],
			viewEngines: {},
			currentViewEngine: ViewEngine.handlebars
		},
		analytics: []
	};
};
