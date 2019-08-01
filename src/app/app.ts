import express from "express";

import http from "http";

import https from "https";

import {
	IApp
} from "./app.interface";

import {
	Manifest
} from "../configuration";

import * as io_request from "../io/request";

import * as io_response from "../io/response";

import * as socketEngine from "../socket";

import * as viewEngines from "../view-engines";

import * as analytics from "../analytics";

import * as expressVendor from "../vendors/express";

import * as store from "../store";

import * as handlebars from "hbs";

export class App implements IApp {

	public static configure(
		manifest: Manifest | null = null
	): App {
		return new App(
			manifest ? manifest : store.getDefaultManifest()
		);
	}

	private readonly expressInstance: express.Express;

	private readonly router: express.Router;

	private readonly requestHandlers: io_request.RequestHandler[];

	private httpServer: http.Server | https.Server;

	private socketIO?: SocketIO.Server;

	private readonly sockets: SocketIO.Socket[];

	private constructor(
		private readonly manifest: Manifest
	) {
		this.expressInstance = express();
		this.router = express.Router();
		this.requestHandlers = [];
		this.httpServer = manifest.server.secure
			? https.createServer(this.expressInstance)
			: http.createServer(this.expressInstance);
		this.sockets = [];

		this.addStaticLocations();
		this.insertRequestHandlers();
		this.mountRoutes();
		this.setupViewEngine();
		this.setupSocket(
			this.expressInstance
		);
	}

	private addStaticLocations() {
		this.manifest.server.staticLocations.forEach((location) => {
			this.expressInstance.use(
				location.alias,
				express.static(
					location.realPath
				)
			);
		});
	}

	private insertRequestHandlers() {
		this.expressInstance.use((request, response, next) => {
			for (let handler of this.manifest.server.requestHandlers) {
				handler(request);
			}

			next();
		});
	}

	private mountRoutes() {
		let applyResponse = (
			response: io_response.AnyResponse,
			expressIO: expressVendor.InputOutput,
			ignoreDelay: boolean
		) => {
			// Wait for delay if needed

			if (!ignoreDelay && response.delay) {
				let delay = response.delay instanceof Function
					? response.delay() as number
					: response.delay;

				setTimeout(
					function() {
						applyResponse(
							response,
							expressIO,
							true
						);
					},
					delay
				);
				return;
			}

			// Check response type and handle it appropriately

			if (io_response.isCustomResponse(response)) {
				let customResponse = response as io_response.CustomResponse;
				let result = customResponse.handler(
					expressIO.request,
					expressIO.response
				);

				if (result) {
					applyResponse(
						result,
						expressIO,
						true
					);
				}
			} else if (io_response.isTextResponse(response)) {
				let textResponse = response as io_response.TextResponse;

				if (textResponse.status) {
					expressIO.response.status(
						textResponse.status
					);
				}

				expressIO.response.send(
					textResponse.text
				);
			} else if (io_response.isJsonResponse(response)) {
				let jsonResponse = response as io_response.JsonResponse;

				if (jsonResponse.status) {
					expressIO.response.status(
						jsonResponse.status
					);
				}

				expressIO.response.json(
					jsonResponse.json
				);
			} else if (io_response.isPageResponse(response)) {
				let pageResponse = response as io_response.PageResponse;

				if (pageResponse.data) {
					pageResponse.data.analyticsHtml = pageResponse.data.analyticsId
						.map((id) => {
							return new analytics.AnalyticsRenderer()
								.getHtmlForSingleAnalytics(id)
						});
				}

				if (pageResponse.status) {
					expressIO.response.status(
						pageResponse.status
					);
				}

				expressIO.response.render(
					pageResponse.path,
					pageResponse.data
				);
			} else if (io_response.isRedirectResponse(response)) {
				let redirectResponse = response as io_response.RedirectResponse;

				expressIO.response.redirect(
					redirectResponse.redirectTo
				);
			}
		};

		this.manifest.server.routes.forEach((route) => {
			if (route.methods.get) {
				this.router.get(
					route.url,
					(request, response) => {
						let methodHandler = route.methods.get!;
						applyResponse(
							route.methods.get!,
							new expressVendor.InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.post) {
				this.router.post(
					route.url,
					(request, response) => {
						let methodHandler = route.methods.post!;
						applyResponse(
							methodHandler,
							new expressVendor.InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.put) {
				this.router.put(
					route.url,
					(request, response) => {
						let methodHandler = route.methods.put!;
						applyResponse(
							methodHandler,
							new expressVendor.InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.delete) {
				this.router.delete(
					route.url,
					(request, response) => {
						let methodHandler = route.methods.delete!;
						applyResponse(
							methodHandler,
							new expressVendor.InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}
		});

		this.expressInstance.use(
			express.json()
		);
		this.expressInstance.use(
			express.urlencoded({
				extended: false
			})
		);
		this.expressInstance.use(
			`/`,
			this.router
		);
	}

	private setupViewEngine() {
		switch (this.manifest.server.currentViewEngine) {
			case viewEngines.ViewEngine.handlebars: {
				let configuration = this.manifest.server.viewEngines.handlebars;

				if (configuration) {
					let {partialsDir} = configuration;
					var expressHbs = require("express-hbs");
					this.expressInstance.engine(
						"hbs",
						expressHbs.express4({
							partialsDir: partialsDir
						})
					);
				}

				this.expressInstance.set(
					"view engine",
					"hbs"
				);
				break;
			}
			case viewEngines.ViewEngine.none: {
				break;
			}
		}
	}

	public start(
		callback?: (port: number) => void
	): this {
		let {port} = this.manifest.server;
		this.httpServer.listen(
			port,
			() => {
				if (callback) {
					callback(
						port
					);
				}
			}
		);
		return this;
	}

	private setupSocket(
		expressInstance: express.Express
	) {
		if (!this.manifest.socket) {
			return;
		}

		this.socketIO = require("socket.io")(
			this.httpServer
		);

		this.socketIO!.on(
			"connection",
			(socket: SocketIO.Socket) => {
				this.sockets.push(
					socket
				);

				socket.on(
					"disconnect",
					() => {
						let index = this.sockets.indexOf(socket);
						
						if (index >= 0) {
							this.sockets.splice(index, 1);
						}
					}
				);

				this.manifest.socket!.events.forEach((event) => {
					socket.on(
						event.name,
						(data) => {
							event.handler(
								data,
								socket.id
							);
						}
					);
				});
			}
		);
	}

	public getSocketIDs(): string[] {
		return this.sockets
			.map((socket) => {
				return socket.id;
			});
	}

	public getSocketById(id: string): SocketIO.Socket | null {
		let index = this.sockets.findIndex((socket) => {
			return socket.id === id;
		});
		return index >= 0 ? this.sockets[index] : null;
	}

	public sendSocketMessage(message: socketEngine.Message) {
		if (message.recipients) {
			let sockets = message.recipients
				.map((recipient) => {
					return this.getSocketById(recipient);
				})
				.filter((socket) => {
					return socket != null;
				});
			sockets.forEach((socket) => {
				socket!.emit(
					message.event,
					message.data
				);
			})
		} else {
			if (this.socketIO) {
				this.socketIO.emit(
					message.event,
					message.data
				);
			}
		}
	}

	public disconnectSocketWithId(id: string) {
		let socket = this.getSocketById(id);

		if (socket) {
			socket.disconnect(true);
		}
	}
}
