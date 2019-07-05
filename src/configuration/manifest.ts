import * as server from "../server/index";

import * as request from "../io/request/index";

import * as routes from "../routes/index";

import * as viewEngines from "../view-engines/index";

import * as yandexMetrika from "../vendors/yandex/metrika/index";

export type Manifest = {
	readonly server: {
		readonly port: number,
		readonly staticLocations: server.StaticLocation[],
		readonly requestHandlers: request.RequestHandler[],
		readonly routes: routes.Route[],
		readonly viewEngines: {
			readonly handlebars?: viewEngines.HandlebarsConfiguration
		},
		readonly currentViewEngine: viewEngines.ViewEngine
	},
	readonly analytics: {
		readonly yandexMetrika?: yandexMetrika.Configuration
	}
};
