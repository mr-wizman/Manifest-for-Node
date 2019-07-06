export type Configuration = {
	partialsDir?: string,
	helpers?: ({
		name: string,
		function: ((...args: any[]) => string)
	})[]
};
