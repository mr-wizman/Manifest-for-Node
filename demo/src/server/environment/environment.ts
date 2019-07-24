import dotenv from "dotenv";

import {
	EnvironmentVariable
} from "./environment-variable";

class Environment {

	constructor() {
		dotenv.config();
	}

	private readValue(
		key: string,
		defaultValue: any = undefined
	): any {
		let value = process.env[key];

		if (value) {
			return value;
		} else {
			return defaultValue;
		}
	}

	private read(
		variable: EnvironmentVariable
	): any {
		let value = process.env[variable.key];

		if (value) {
			return value;
		} else {
			return variable.defaultValue;
		}
	}

	get port(): number {
		let stringValue = this.read(
			variables.port
		);
		return Number(stringValue);
	}

	get isProduction(): boolean {
		let stringValue = this.read(
			variables.production
		);
		return Boolean(
			JSON.parse(
				stringValue
			)
		);
	}
}

const variables = {
	port: new EnvironmentVariable(
		"PORT",
		3000
	),
	production: new EnvironmentVariable(
		"PRODUCTION",
		false
	)
};

export default new Environment();
