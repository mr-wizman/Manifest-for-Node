import {
	Manifest
} from "../configuration";

import * as store from "../store";

export class AnalyticsRenderer {

	constructor() {
	}

	public getHtmlForSingleAnalytics(
		identifier: string
	) {
		let analytics = store.getDefaultManifest().analytics
			.find((analytics) => {
				return analytics.id === identifier;
			});
		return analytics ? analytics.html : "";
	}

	public getHtmlForMultipleAnalytics(
		identifiers: string[]
	): string {
		return store.getDefaultManifest().analytics
			.filter((analytics) => {
				return identifiers.includes(
					analytics.id
				);
			})
			.map((analytics) => {
				return analytics.html;
			})
			.join();
	}
}
