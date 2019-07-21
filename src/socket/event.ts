export type Event = {
	name: string,
	handler: (
		data: any,
		socket: SocketIO.Socket
	) => void
};
