import express from "express";

export class CustomResponse {

	constructor(
		public handler: (
			request: express.Request,
			response: express.Response
		) => Response | undefined
	) {
	}
}

export const isCustomResponse = (object: any): object is CustomResponse => {
	return "handler" in object;
};
