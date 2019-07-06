import * as analytics from "../analytics";

export type ViewData = {
	readonly model: object,
	readonly analyticsIdentifiers: string[],
	analyticsHtml: string[]
};
