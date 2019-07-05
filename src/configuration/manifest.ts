import * as server from "../server";

import * as request from "../io/request";

import * as routes from "../routes";

import * as viewEngines from "../view-engines";

import * as yandexMetrika from "../vendors/yandex/metrika";

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
