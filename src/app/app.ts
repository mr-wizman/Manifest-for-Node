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

import * as viewEngines from "../view-engines";

import * as expressVendor from "../vendors/express";

import * as store from "../store";

import cors from "cors";

export class App implements IApp {

	public static create(
		manifest: Manifest | null = null
	): App {
		return new App(
			manifest ? manifest : store.getDefaultManifest()
		);
	}

	private readonly expressInstance: express.Express;

	private readonly router: express.Router;

	private readonly requestHandlers: io_request.RequestHandler[];

	private server: http.Server | https.Server;

	private constructor(
		private readonly manifest: Manifest
	) {
		this.expressInstance = express();
		this.router = express.Router();
		this.requestHandlers = [];
		this.server = manifest.server.secure
			? https.createServer(this.expressInstance)
			: http.createServer(this.expressInstance);

		this.addStaticLocations();
		this.insertRequestHandlers();
		this.mountRoutes();
		this.setupViewEngine();
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
			for (let handler of this.manifest.io.handlers) {
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
					function () {
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
				let result = response.handler(
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
			} else if (io_response.isAsyncCustomResponse(response)) {
				response.asyncHandler(
					expressIO.request,
					expressIO.response,
					(result) => {
						if (result) {
							applyResponse(
								result,
								expressIO,
								true
							);
						}
					}
				);
			} else if (io_response.isTextResponse(response)) {
				if (response.status) {
					expressIO.response.status(
						response.status
					);
				}

				expressIO.response.send(
					response.text
				);
			} else if (io_response.isJsonResponse(response)) {
				if (response.status) {
					expressIO.response.status(
						response.status
					);
				}

				expressIO.response.json(
					response.json
				);
			} else if (io_response.isPageResponse(response)) {
				if (response.status) {
					expressIO.response.status(
						response.status
					);
				}

				expressIO.response.render(
					response.path,
					response.data
				);
			} else if (io_response.isRedirectResponse(response)) {
				expressIO.response.redirect(
					response.redirectTo
				);
			}
		};

		const emptyHandler = (request: express.Request, response: any, next: any) => {
			next();
		};

		this.manifest.io.routes.forEach((route) => {
			if (route.methods.get) {
				this.router.get(
					route.url,
					route.corsEnabled ? cors() : emptyHandler,
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
					route.corsEnabled ? cors() : emptyHandler,
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
					route.corsEnabled ? cors() : emptyHandler,
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
					route.corsEnabled ? cors() : emptyHandler,
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
		switch (this.manifest.viewEngines.current) {
			case viewEngines.ViewEngine.handlebars: {
				let configuration = this.manifest.viewEngines.settings
					&& this.manifest.viewEngines.settings.handlebars;

				if (configuration) {
					var expressHbs = require("express-hbs");
					this.expressInstance.engine(
						"hbs",
						expressHbs.express4({
							partialsDir: configuration.partialsDir
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
		let { port } = this.manifest.server;
		this.server.listen(
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

	public getServer(): http.Server | https.Server {
		return this.server;
	}
}
