import express from "express";

export class InputOutput {

	constructor(
		public readonly request: express.Request,
		public readonly response: express.Response
	) {
	}
}
