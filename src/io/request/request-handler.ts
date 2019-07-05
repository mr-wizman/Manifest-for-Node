import express from "express";

export type RequestHandler = (
	request: express.Request
) => void;
