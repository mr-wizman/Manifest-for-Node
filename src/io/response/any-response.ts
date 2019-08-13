import {
	CustomResponse
} from "./custom-response";

import {
	AsyncCustomResponse
} from "./async-custom-response";

import {
	TextResponse
} from "./text-response";

import {
	JsonResponse
} from "./json-response";

import {
	PageResponse
} from "./page-response";

import {
	RedirectResponse
} from "./redirect-response";

export type AnyResponse = CustomResponse
	| AsyncCustomResponse
	| TextResponse
	| JsonResponse
	| PageResponse
	| RedirectResponse;
