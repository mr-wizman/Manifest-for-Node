export class JsonResponse {

	constructor(
		public json: object,
		public status?: number,
		public readonly delay?: number | (() => number)
	) {
	}
}

export const isJsonResponse = (object: any): object is JsonResponse => {
	return "json" in object;
};
