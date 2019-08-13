import express from "express";

import {
	AnyResponse
} from "./any-response";

export class AsyncCustomResponse {

	constructor(
		public readonly asyncHandler: (
			request: express.Request,
			response: express.Response,
			callback: (response?: AnyResponse) => void
		) => void,
		public readonly delay?: number | (() => number)
	) {
	}
}

export const isAsyncCustomResponse = (object: any): object is AsyncCustomResponse => {
	return "asyncHandler" in object;
};
