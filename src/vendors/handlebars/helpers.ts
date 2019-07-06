import * as handlebars from "hbs";

import * as analytics from "../../analytics";

export const registerHelpers = () => {
	handlebars.registerHelper(
		"renderAnalytics",
		(id: string) => {
			return new analytics.AnalyticsRenderer()
				.getHtmlForSingleAnalytics(
					id
				);
		}
	);
};
