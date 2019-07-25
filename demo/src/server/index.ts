import * as mfst from "../../../dist";

import express from "express";

import {
	app
} from "./app";

app.start(
	(port: number) => {
		console.log(
			`Server is listening on ${port} port`
		);
	}
);
