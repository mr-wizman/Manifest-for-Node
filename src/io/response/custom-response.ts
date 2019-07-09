import express from "express";

import {
	AnyResponse
} from "./any-response";

export class CustomResponse {

	constructor(
		public readonly handler: (
			request: express.Request,
			response: express.Response
		) => AnyResponse | undefined,
		public readonly timeout?: number
	) {
	}
}

export const isCustomResponse = (object: any): object is CustomResponse => {
	return "handler" in object;
};
