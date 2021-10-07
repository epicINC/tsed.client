export * from './pagination'



export interface ILocalContext {
	account: any
	authorization: string
	user: any
}


export interface IThing {
	id: number
}


export interface IRange<T> {
	start: T
	end: T
}