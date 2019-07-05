export class RedirectResponse {

	constructor(
		public readonly redirectTo: string
	) {
	}
}

export const isRedirectResponse = (object: any): object is RedirectResponse => {
	return "redirectTo" in object;
};
