import * as mfst from "../../../dist";

import express from "express";

import {
	manifest
} from "./manifest";

export const app = mfst.ExpressApp.configure();
