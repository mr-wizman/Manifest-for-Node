export type Message = {
	event: string,
	data: any,
	recipients?: string[],
};
