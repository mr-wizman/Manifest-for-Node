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

export type AnyResponse = CustomResponse
	| TextResponse
	| JsonResponse
	| PageResponse;
