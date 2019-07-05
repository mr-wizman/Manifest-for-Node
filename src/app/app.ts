import express from "express";

import * as configuration from "../configuration";

import * as io_request from "../io/request";

import * as io_response from "../io/response";

import * as viewEngines from "../view-engines";

import * as expressVendor from "../vendors/express";

var expressHbs = require("express-hbs");

export class App {

	private router: express.Router = express.Router();

	private requestHandlers: Array<io_request.RequestHandler> = [];

	constructor(
		public readonly expressInstance: express.Express = express(),
		public readonly manifest: configuration.Manifest
	) {
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
			expressIO: expressVendor.InputOutput
		) => {
			if (io_response.isCustomResponse(response)) {
				let customResponse = response as io_response.CustomResponse;
				let result = customResponse.handler(
					expressIO.request,
					expressIO.response
				);

				if (result) {
					applyResponse(
						result,
						expressIO
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
				let pageRendering = response as io_response.PageResponse;

				if (pageRendering.status) {
					expressIO.response.status(
						pageRendering.status
					);
				}

				expressIO.response.render(
					pageRendering.path,
					pageRendering.data
				);
			}
		};

		this.manifest.server.routes.forEach((route) => {
			if (route.methods.get) {
				this.router.get(
					route.url,
					(request, response) => {
						applyResponse(
							route.methods.get!,
							new expressVendor.InputOutput(
								request,
								response
							)
						);
					}
				);
			}

			if (route.methods.post) {
				this.router.post(
					route.url,
					(request, response) => {
						applyResponse(
							route.methods.post!,
							new expressVendor.InputOutput(
								request,
								response
							)
						);
					}
				);
			}

			if (route.methods.put) {
				this.router.put(
					route.url,
					(request, response) => {
						applyResponse(
							route.methods.put!,
							new expressVendor.InputOutput(
								request,
								response
							)
						);
					}
				);
			}

			if (route.methods.delete) {
				this.router.delete(
					route.url,
					(request, response) => {
						applyResponse(
							route.methods.delete!,
							new expressVendor.InputOutput(
								request,
								response
							)
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
				let handlebarsConfiguration = this.manifest.server.viewEngines.handlebars;

				if (handlebarsConfiguration) {
					this.expressInstance.engine(
						"hbs",
						expressHbs.express4({
							partialsDir: handlebarsConfiguration.partialsDir
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
