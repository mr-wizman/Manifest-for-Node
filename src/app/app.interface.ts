export interface IApp {
	start(
		callback?: (port: number) => void
	): this
}
