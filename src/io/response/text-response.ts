export class TextResponse {

	constructor(
		public readonly text: string,
		public readonly status?: number,
		public readonly delay?: number | (() => number)
	) {
	}
}

export const isTextResponse = (object: any): object is TextResponse => {
	return "text" in object;
};
