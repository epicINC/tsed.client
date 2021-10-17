
/**
 * 
 * https://loopback.io/doc/en/lb4/Querying-data.html
 */
export type IQueryParam<T> = {
	fields?: IFieldFilter<T>
	include?: IIncludeFilter
	order?: IOrderFilter[] | IOrderFilter
	where?: IWhereFilter<T>
}

export type IQueryPagingParam<T> = IQueryParam<T> & Partial<IPaingFilter> & {pagination?: boolean}




export type IFieldFilter<T> = Record<keyof T, (0 | 1) | boolean> | (keyof T)[]
export type IIncludeFilter = string[]
export type IPaingFilter = {
	page: number
	size: number

	skip: number
	limit: number
	offset: number
}
export type IOrderFilter = `${string} ${1 | -1 | 'asc' | 'desc' | '' | 0}`
export type IWhereFilter<T> = {
	[K in keyof T]?: OpValue<T[K]> | T[K] | (T[K])[]
} & {
	q?: string | string[]
}



type Op = '$eq' | '$and' | '$or' | '$gt' | '$gte' | '$lt' | '$lte' | '$between' | '$inq' | '$nin' | '$near' | '$neq' | '$like' | '$nlike' | '$ilike' | '$nilike' | '$regexp' | '$any' | '$all' | '$nany' | '$nall'
type OpValue<T> = {
	[K in Op]?: T
}

