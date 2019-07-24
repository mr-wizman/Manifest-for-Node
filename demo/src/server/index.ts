import * as mfst from "../../../dist";

import express from "express";

import {
	manifest
} from "./manifest";

mfst.setDefaultManifest(
	manifest
);

let app = mfst.ExpressApp.getInstance()
	.start(
		(port: number) => {
			console.log(
				`Server is listening on ${port} port`
			);
		}
	);
