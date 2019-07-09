import express from "express";

import * as configuration from "../configuration";

import * as io_request from "../io/request";

import * as io_response from "../io/response";

import * as viewEngines from "../view-engines";

import * as analytics from "../analytics";

import * as expressVendor from "../vendors/express";

import * as store from "../store";

import * as handlebars from "hbs";

var expressHbs = require("express-hbs");

export class App {

	public readonly expressInstance: express.Express = express();

	private router: express.Router = express.Router();

	private requestHandlers: Array<io_request.RequestHandler> = [];

	private manifest: configuration.Manifest = store.getDefaultManifest();

	constructor() {
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
			ignoreTimeout: boolean
		) => {
			// Output request information

			if (this.manifest.logEnabled) {
				console.log(
					`${expressIO.request.method.toUpperCase()} ${expressIO.request.originalUrl}\n`,
					`Query: ${expressIO.request.query}\n`,
					`Body: ${expressIO.request.body}`
				);
			}

			// Wait for timeout if needed

			if (!ignoreTimeout && response.timeout) {
				let timeout = response.timeout instanceof Function
					? response.timeout() as number
					: response.timeout;

				if (this.manifest.logEnabled) {
					console.log(
						`Waiting timeout: ${timeout / 1000} seconds`
					);
				}

				setTimeout(
					function() {
						applyResponse(
							response,
							expressIO,
							true
						);
					},
					timeout
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
					pageResponse.data.analyticsHtml = pageResponse.data.analyticsIdentifiers
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
							!methodHandler.timeout
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
							!methodHandler.timeout
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
							!methodHandler.timeout
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
							!methodHandler.timeout
						);
					}
				);
			}
		});

		this.expressInstance.use(`/`, this.router);
	}

	private setupViewEngine() {
		switch (this.manifest.server.currentViewEngine) {
			case viewEngines.ViewEngine.handlebars: {
				let configuration = this.manifest.server.viewEngines.handlebars;

				if (configuration) {
					let {partialsDir} = configuration;

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

	public listen(
		callback?: (port: number) => void
	): App {
		let {port} = this.manifest.server;
		this.expressInstance.listen(
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
}
