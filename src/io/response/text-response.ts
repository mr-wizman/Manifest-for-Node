export class TextResponse {

	constructor(
		public text: string,
		public status?: number
	) {
	}
}

export const isTextResponse = (object: any): object is TextResponse => {
	return "text" in object;
};
