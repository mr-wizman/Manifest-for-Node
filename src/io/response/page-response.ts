import {
	ViewData
} from "../../views";

export class PageResponse {

	constructor(
		public readonly path: string,
		public readonly data?: ViewData,
		public readonly status?: number,
		public readonly timeout?: number | (() => number)
	) {
	}
}

export const isPageResponse = (object: any): object is PageResponse => {
	return "path" in object;
};
