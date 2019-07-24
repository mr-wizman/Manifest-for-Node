import * as analytics from "../analytics";

export type ViewData = {
	readonly model: object,
	readonly analyticsId: string[],
	analyticsHtml?: string[]
};
