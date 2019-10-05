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
			staticLocations: []
		},
		viewEngines: {
			current: ViewEngine.handlebars
		},
		io: {
			handlers: [],
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
						},
						post: {
							asyncHandler: (request, response, callback) => {
								let firstName = "John";
								let lastName = "Green";
								
								callback({
									json: {
										first_name: firstName,
										last_name: lastName
									}
								});
							}
						}
					}
				}
			],
		}
	};
};
