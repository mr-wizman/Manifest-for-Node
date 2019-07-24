import * as mfst from "../../../dist";

import express from "express";

import environment from "./environment";

const pageNotFound: () => mfst.TextResponse = () => {
	return {
		text: `<h1>Page not found</h1>`,
		status: 404
	}
};

const getAnalyticsIdentifiers = () => {
	if (environment.isProduction) {
		return [
			"yandex-metrika"
		];
	} else {
		return [];
	}
};

export const manifest: mfst.Manifest = {
	server: {
		port: environment.port,
		staticLocations: [
			{
				alias: `/client`,
				realPath: `${__dirname}/../client`
			}
		],
		requestHandlers: [
			(request) => {
				console.log("Request:", `"${request.url}"`);
			}
		],
		routes: [
			{
				url: `/`,
				methods: {
					get: {
						path: `${__dirname}/../client/views/home/index`,
						data: {
							model: {
							},
							analyticsId: getAnalyticsIdentifiers()
						},
						status: 200
					}
				}
			},
			{
				url: `*`,
				methods: {
					get: pageNotFound()
				}
			}
		],
		viewEngines: {
			handlebars: {
				partialsDir: `${__dirname}/../client/fragments`
			}
		},
		currentViewEngine: mfst.ViewEngine.handlebars
	},
	analytics: [
	]
};
