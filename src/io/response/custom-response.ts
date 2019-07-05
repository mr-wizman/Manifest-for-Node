import express from "express";

import {
	AnyResponse
} from "./any-response";

export class CustomResponse {

	constructor(
		public handler: (
			request: express.Request,
			response: express.Response
		) => AnyResponse | undefined
	) {
	}
}

export const isCustomResponse = (object: any): object is CustomResponse => {
	return "handler" in object;
};
