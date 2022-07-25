
import WebClient, { AxiosInstance } from 'axios'
import { IQueryPagingParam, IQueryParam, IThing, IWhereFilter } from '../components'
import { ArgumentNull, NotFound, StatusCodeException } from '../errors'
import { Arrays, ContextStorages, Strings } from '../utils'


const clients: AxiosInstance[] = []

export function Authorization(token: string) {
	clients.forEach(e => {
		if (token)
			// @ts-expect-error
			e.defaults.headers.Authorization = `Bearer ${token}`
		else
			Reflect.deleteProperty(e.defaults.headers, 'Authorization')
	})
}

export interface IProvider<T> {

	exists(filter: IWhereFilter<T>): Promise<boolean>


	find<R = T>(id: string | number): Promise<R | null>
	find<R = T>(query: IQueryParam<T>): Promise<R | null>

	findOrFail<R = T>(id: string | number): Promise<R>
	findOrFail<R = T>(query: IQueryParam<T>): Promise<R>

	query<R = T>(query: IQueryPagingParam<T>): Promise<R[]>
	paging<R = T>(query: IQueryPagingParam<T>): Promise<[R[], number]>

	insert(data: Partial<T>): Promise<T>
	insert(data: Partial<T>[]): Promise<T[]>

	update(data: Partial<T>): Promise<T>
	update(data: Partial<T>[]): Promise<T[]>

	save(data: Partial<T>): Promise<T>
	save(data: Partial<T>[]): Promise<T[]>

	remove(key: number | string): Promise<T>
	remove(filter: IWhereFilter<T>[]): Promise<T[]>
}

export class RESTfulClient<T> {
	protected readonly http: AxiosInstance

	constructor(baseURL: string) {

		if (!baseURL.startsWith('http') && !baseURL.startsWith('/'))
			baseURL = Strings.urlCombine('/api/v4', baseURL)
		this.http = WebClient.create({
			baseURL,
		})
		if (ContextStorages.get()?.authorization)
			// @ts-ignore
			this.http.defaults.headers.Authorization = `Bearer ${ContextStorages.get()?.authorization}`
		clients.push(this.http)

		this.http.interceptors.response.use(response => {
			if (response.status > 199 && response.status < 300) return response

			throw new StatusCodeException(response.data.status, response.data.name + ':' + response.data.message)
		}, error => {
			if (!error.response.data) return Promise.reject(new StatusCodeException(error.response.status, error.response.statusText))
			return Promise.reject(new StatusCodeException(error.response.data.status, error.response.data.name + ':' + error.response.data.message))
		})
	}

	



	async head(path: string, query?: object) {
		try {
			await this.http.head<boolean>(path, {
				data: query
			})
			return true
		} catch {
			return false
		}
	}


	async get<R = T>(path: string, params?: object): Promise<R> {
		const result = await this.http.get<R>(path, { params })
		return result.data
	}

	post<R = T>(path: string, data: object): Promise<R>
	post<R = T>(path: string, data: object[]): Promise<R[]>
	async post<R = T>(path: string, data: object | object[]): Promise<R | R[]> {
		if (data === null || data === undefined) throw new ArgumentNull('post')
		if (Array.isArray(data) && data.length === 0) return Promise.resolve([])
		const result = await this.http.post<R>(path, data)
		return result.data
	}

	patch<R = T>(path: string, data: object): Promise<R>
	patch<R = T>(path: string, data: object[]): Promise<R[]>
	async patch<R = T>(path: string, data: object | object[]): Promise<R | R[]> {
		if (data === null || data === undefined) throw new ArgumentNull('patch')
		if (Array.isArray(data) && data.length === 0) return Promise.resolve([])
		const result = await this.http.patch<R>(path, data)
		return result.data
	}


	/** upsert */
	async put<R = T>(path: string, data: object | object[] | FormData) {
		const result = await this.http.put<R>(path, data)
		return result.data
	}


	async delete<R = T>(path: string, params?: object): Promise<R> {
		const result = await this.http.delete<R>(path, { params })
		return result.data
	}



	async downloadData(url: string, params?: any, paramsSerializer?: (e: any) => string) : Promise<{name: string, data: Blob}> {
		const response = await this.http.get(url, {
			responseType: 'blob',
			params,
			paramsSerializer
		})


		return {
			// @ts-ignore
			name: response.headers['content-disposition'] && response.headers['content-disposition'].match(/"(.+)"/)[1],
			// contentType: response.headers['content-type'],
			data: response.data
		}
	}


}



export abstract class ProviderBase<T extends IThing> implements IProvider<T> {

	public readonly name: string
	protected readonly client: RESTfulClient<T>

	constructor(url?: string) {
		if (url && (url.startsWith('http') || url.startsWith('/'))) {
			this.name = Strings.normalizeProviderName(this.constructor.name)
			this.client = new RESTfulClient(url)
			return
		}

		this.name = url ?? Strings.normalizeProviderName(this.constructor.name)
		this.client = new RESTfulClient(this.name)
	}

	exists(filter: IWhereFilter<T>) {
		return this.client.head('/', filter)
	}


	find<R = T>(id: number | string): Promise<R | null>
	find<R = T>(query: IQueryParam<T>): Promise<R | null>
	find<R = T>(query: any): Promise<R | null> {
		if (query === null || query === undefined) throw new ArgumentNull('query')

		try {
			switch (typeof query) {
				case 'string':
				case 'number':
					return this.client.get<R>(`/${query}`)
				default:
					query.limit = 1
					return this.client.get<R[]>('/', query).then(e => e[0])
			}
		} catch (e) {
			if (e instanceof StatusCodeException) {
				if (e.statusCode === 404) return Promise.resolve(null)
			}
			throw e
		}
	}

	findOrFail<R = T>(id: number | string): Promise<R>
	findOrFail<R = T>(query: IQueryParam<T>): Promise<R>
	findOrFail<R = T>(query: any): Promise<R> {
		return this.find<R>(query).then(e => {
			if (e !== undefined && e !== null) return e
			return Promise.reject(new NotFound(this.name))
		})
	}

	query<R = T>(query: IQueryPagingParam<T>) {
		return this.client.get<R[]>('/', query)
	}


	paging<R = T>(query: IQueryPagingParam<T>) {
		(<any>query).pagination = true
		return this.client.get<[R[], number]>('/', query)
	}

	async insert(data: Partial<T>): Promise<T>
	async insert(data: Partial<T>[]): Promise<T[]>
	async insert(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
		return this.client.post('/', data as any)
	}

	async update(data: Partial<T>): Promise<T>
	async update(data: Partial<T>[]): Promise<T[]>
	async update(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
		return this.client.patch('/', data as any)
	}

	async save(data: Partial<T>): Promise<T>
	async save(data: Partial<T>[]): Promise<T[]>
	async save(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
		return await this.client.put('/', data)
	}


	remove(key: number | string): Promise<T>
	remove(filter: IWhereFilter<T>[]): Promise<T[]>
	remove(query: string | number | any): Promise<T | T[]> {

		switch (typeof query) {
			case 'string':
			case 'number':
				return this.client.delete(`/${query}`)
			default:
				return this.client.delete('/', query)
		}
	}





}
