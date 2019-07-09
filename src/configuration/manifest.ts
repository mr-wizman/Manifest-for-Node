import * as server from "../server";

import * as request from "../io/request";

import * as routes from "../routes";

import * as viewEngines from "../view-engines";

import * as handlebars from "../vendors/handlebars";

export type Manifest = {
	readonly server: {
		readonly port: number,
		readonly staticLocations: server.StaticLocation[],
		readonly requestHandlers: request.RequestHandler[],
		readonly routes: routes.Route[],
		readonly viewEngines: {
			readonly handlebars?: handlebars.Configuration
		},
		readonly currentViewEngine: viewEngines.ViewEngine
	},
	readonly analytics: {
		readonly id: string,
		readonly html: string
	}[],
	readonly logEnabled?: boolean
};
