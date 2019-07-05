import express from "express";

import * as request from "../request";

import {
	Manifest
} from "../configuration";

export class App {

	private router: express.Router = express.Router();

	private requestHandlers: Array<request.RequestHandler> = [];

	constructor(
		public readonly expressInstance: express.Express = express(),
		public readonly manifest: Manifest
	) {
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
