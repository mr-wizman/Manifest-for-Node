import {
	CustomResponse
} from "./custom-response";

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
	| TextResponse
	| JsonResponse
	| PageResponse
	| RedirectResponse;
