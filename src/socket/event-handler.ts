export type EventHandler = {
	readonly name: string,
	readonly handler: (
		data: any,
		senderId: string
	) => void
};
