export class RedirectResponse {

	constructor(
		public readonly redirectTo: string,
		public readonly delay?: number | (() => number)
	) {
	}
}

export const isRedirectResponse = (object: any): object is RedirectResponse => {
	return "redirectTo" in object;
};
