import * as server from "../server";

import * as request from "../io/request";

import * as routes from "../routes";

import * as viewEngines from "../view-engines";

import * as handlebars from "../vendors/handlebars";

import * as socket from "../socket";

export type Manifest = {
	readonly server: {
		readonly port: number,
		readonly secure: boolean,
		readonly staticLocations: server.StaticLocation[],
		readonly requestHandlers: request.RequestHandler[],
		readonly routes: routes.Route[],
		readonly viewEngines: {
			readonly handlebars?: handlebars.Configuration
		},
		readonly currentViewEngine: viewEngines.ViewEngine
	},
	readonly socket?: {
		readonly onConnected?: (socket: SocketIO.Socket) => void,
		readonly onDisconnected?: (socket: SocketIO.Socket) => void,
		readonly events: socket.EventHandler[]
	},
	readonly analytics: {
		readonly id: string,
		readonly html: string
	}[]
};
