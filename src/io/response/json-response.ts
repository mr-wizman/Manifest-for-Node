export class JsonResponse {

	constructor(
		public json: object,
		public status?: number,
		public readonly timeout?: number | (() => number)
	) {
	}
}

export const isJsonResponse = (object: any): object is JsonResponse => {
	return "json" in object;
};
