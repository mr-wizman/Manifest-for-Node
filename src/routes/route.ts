import {
	AnyResponse
} from "../io/response/index";

export type Route = {
	url: string,
	methods: {
		get?: AnyResponse,
		post?: AnyResponse,
		put?: AnyResponse,
		delete?: AnyResponse
	}
};
