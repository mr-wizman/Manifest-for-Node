import * as server from "../server";

import * as request from "../io/request";

import * as routes from "../routes";

import * as viewEngines from "../view-engines";

import * as handlebars from "../vendors/handlebars";

export type Manifest = {
	readonly server: {
		readonly port: number,
		readonly secure: boolean,
		readonly staticLocations: server.StaticLocation[]
	},
	readonly viewEngines: {
		readonly current: viewEngines.ViewEngine,
		readonly settings?: {
			readonly handlebars?: handlebars.Configuration
		}
	},
	readonly io: {
		readonly handlers: request.RequestHandler[],
		readonly routes: routes.Route[]
	},
	readonly blacklist?: {
		ip: string[]
	}
};
