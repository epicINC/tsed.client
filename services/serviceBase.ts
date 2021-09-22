import { IQueryPagingParam, IQueryParam, IThing, IWhereFilter } from '../components'
import { IProvider } from '../providers/providerBase'



export interface IService<T> {


	exists(query: IWhereFilter<T>) : Promise<boolean>

	
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
	remove(data: IWhereFilter<T>[]) : Promise<T[]>

}



export abstract class ServiceBase<T extends IThing> implements IService<T> {


	protected abstract provider: IProvider<T>


	exists(filter: IWhereFilter<T>) {
		return this.provider.exists(filter)
	}


	find<R = T>(id: number | string) : Promise<R | null>
	find<R = T>(query: IQueryParam<T>) : Promise<R | null>
	find<R = T>(query: any) : Promise<R | null> {
		return this.provider.find<R>(query)

	}

	findOrFail<R = T>(id: number | string) : Promise<R>
	findOrFail<R = T>(query: IQueryParam<T>) : Promise<R>
	findOrFail<R = T>(query: any) : Promise<R> {
		return this.provider.findOrFail(query)
	}

	query<R = T>(query: IQueryPagingParam<T>) {
		return this.provider.query<R>(query)
	}


	paging<R = T>(query: IQueryPagingParam<T>) {
		return this.provider.paging<R>(query)
	}


	protected onInsert(data: Partial<T>) {
		return data
	}

	async insert(data: Partial<T>) : Promise<T>
	async insert(data: Partial<T>[]) : Promise<T[]>
	async insert(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		if (!Array.isArray(data)) return this.provider.insert(await this.onInsert(data))
		return this.provider.insert(await Promise.all(data.map(async e => await this.onInsert(e))))
	}


	protected onUpdate(data: Partial<T>) {
		return data
	}

	async update(data: Partial<T>) : Promise<T>
	async update(data: Partial<T>[]) : Promise<T[]>
	async update(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		if (!Array.isArray(data)) return this.provider.update(await this.onUpdate(data))
		return this.provider.update(await Promise.all(data.map(e => this.onUpdate(e))))
	}

	async save(data: Partial<T>) : Promise<T>
	async save(data: Partial<T>[]) : Promise<T[]>
	async save(data: Partial<T> | Partial<T>[]) : Promise<T | T[]> {
		if (!Array.isArray(data)) return this.provider.save(data)
		return this.provider.save(await Promise.all(data.map(e => e.id ? this.update(e) : this.insert(e))))
	}


	remove(key: number | string) : Promise<T>
	remove(filter: IWhereFilter<T>[]) : Promise<T[]>
	remove(query: string | number | any) : Promise<T | T[]> {
		return this.provider.remove(query)
	}

}