
import WebClient, { AxiosInstance } from 'axios'
import { IQueryPagingParam, IQueryParam, IThing, IWhereFilter } from '../components'
import { ArgumentNull, NotFound, StatusCodeException } from '../errors'
import { Arrays, ContextStorages, Strings } from '../utils'


const clients: AxiosInstance[] = []

export function Authorization(token: string) {
	clients.forEach(e => {
		if (token)
			e.defaults.headers.Authorization = `Bearer ${ContextStorages.get()?.authorization}`
		else
			Reflect.deleteProperty(e.defaults.headers, 'Authorization')
	})
}

export interface IProvider<T> {

	exists(filter: IWhereFilter<T>) : Promise<boolean>

	
	find<R = T>(id: string | number) : Promise<R | null>
	find<R = T>(query: IQueryParam<T>) : Promise<R | null>

	findOrFail<R = T>(id: string | number) : Promise<R>
	findOrFail<R = T>(query: IQueryParam<T>) : Promise<R>

	query<R = T>(query: IQueryPagingParam<T>) : Promise<R[]>
	paging<R = T>(query: IQueryPagingParam<T>) : Promise<[R[], number]>

	insert(data: Partial<T>) : Promise<T>
	insert(data: Partial<T>[]) : Promise<T[]>

	update(data: Partial<T>) : Promise<T>
	update(data: Partial<T>[]) : Promise<T[]>

	save(data: Partial<T>) : Promise<T>
	save(data: Partial<T>[]) : Promise<T[]>

	remove(key: number | string) : Promise<T>
	remove(filter: IWhereFilter<T>[]) : Promise<T[]>
}

class RESTfulClient<T> {
	protected readonly http: AxiosInstance

	constructor(baseURL: string ) {

		if (!baseURL.startsWith('http'))
			baseURL = Strings.urlCombine('http://0.0.0.0:8083/api/v1', baseURL)
		console.log('baseURL', baseURL)
		this.http = WebClient.create({
			baseURL,
		})
		if (ContextStorages.get()?.authorization)
			this.http.defaults.headers.Authorization = `Bearer ${ContextStorages.get()?.authorization}`
		clients.push(this.http)

		this.http.interceptors.response.use(response => {
			if (response.status > 199 && response.status < 300) return response.data
			
		}, error => {
			return Promise.reject(new StatusCodeException(error.response.status, error.response.statusText))
		})
	}



	async head(path: string, query: Record<string, unknown>) {
		try {
			await this.http.head<boolean>(path, {
				data: query
			})
			return true
		} catch {
			return false
		}
	}


	get<R = T>(path: string, params?: Record<string, unknown>) : Promise<R> {
		return this.http.get<R, R>(path, { params })
	}

	post<R = T>(path: string, data: Partial<T>) : Promise<R>
	post<R = T>(path: string, data: Partial<T>[]) : Promise<R[]>
	post<R = T>(path: string, data: Partial<T> | Partial<T>[]) : Promise<R | R[]> {
		if (data === null || data === undefined) throw new ArgumentNull('post')
		if (Array.isArray(data) && data.length === 0) return Promise.resolve([])
		return this.http.post<R, R>(path, data)
	}

	patch<R = T>(path: string, data: Partial<T>) : Promise<R>
	patch<R = T>(path: string, data: Partial<T>[]) : Promise<R[]>
	patch<R = T>(path: string, data: Partial<T> | Partial<T>[]) : Promise<R | R[]> {
		if (data === null || data === undefined) throw new ArgumentNull('patch')
		if (Array.isArray(data) && data.length === 0) return Promise.resolve([])
		return this.http.patch<R,R>(path, data)
	}


	/** upsert */
	put<R = T>(path: string, data: Partial<T>) {
		return this.http.put<R,R>(path, data)
	}


	delete<R = T>(path: string, params?: Record<string, unknown>) : Promise<R> {
		return this.http.delete<R, R>(path, { params })
	}



}



export abstract class ProviderBase<T extends IThing> implements IProvider<T> {

	public readonly name: string
	protected readonly client: RESTfulClient<T>

	constructor(url?: string) {
		if (url && url.startsWith('http')) {
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


	find<R = T>(id: number | string) : Promise<R | null>
	find<R = T>(query: IQueryParam<T>) : Promise<R | null>
	find<R = T>(query: any) : Promise<R | null> {
		try {
			switch(typeof query) {
				case 'string':
				case 'number':
					return this.client.get<R>(`/${query}`)
				default:
					query.limit = 1
					return this.client.get<R[]>('/', query).then(e => e[0])
			}
		} catch(e) {
			if (e instanceof StatusCodeException) {
				if (e.statusCode === 404) return Promise.resolve(null)
			}
			throw e
		}
	}

	findOrFail<R = T>(id: number | string) : Promise<R>
	findOrFail<R = T>(query: IQueryParam<T>) : Promise<R>
	findOrFail<R = T>(query: any) : Promise<R> {
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

	async insert(data: Partial<T>) : Promise<T>
	async insert(data: Partial<T>[]) : Promise<T[]>
	async insert(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		return this.client.post('/', data as any)
	}

	async update(data: Partial<T>) : Promise<T>
	async update(data: Partial<T>[]) : Promise<T[]>
	async update(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		return this.client.patch('/', data as any)
	}

	async save(data: Partial<T>) : Promise<T>
	async save(data: Partial<T>[]) : Promise<T[]>
	async save(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		if (!Array.isArray(data)) return data.id ? this.update(data) : this.insert(data)

		const result = Arrays.partition(data, e => !!e.id)

		return [...await this.insert(result[1]), ...await this.update(result[0])]
	}


	remove(key: number | string) : Promise<T>
	remove(filter: IWhereFilter<T>[]) : Promise<T[]>
	remove(query: string | number | any) : Promise<T | T[]> {
		return this.client.delete(query)
	}

}