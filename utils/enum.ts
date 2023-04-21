

type Enumeration = Record<string, string | number>

export class EnumImpl {


	combine<T1, T2>(target: T1, source: T2) {
		return Object.assign({}, target, source) as T1 & T2
	}

	pureEntries<T extends Record<string, string | number>>(data: T) {
		return Object.entries(data).filter(([key]) => !Number.isInteger(Number(key)))
	}

	pure<T extends Record<string, string | number>>(data: T) {
		return this.pureEntries(data)
	}


	keys<T extends Enumeration>(data: T) : (keyof T)[] {
		return Object.keys(data).filter(e => !Number.isInteger(Number(e))) as (keyof T)[]
	}

	values<T extends Enumeration>(data: T) {
		return Object.entries(data).reduce<(string | number)[]>((r, [key, val]) => {
			if (!Number.isInteger(Number(key))) r.push(val)
			return r
		}, [])
	}

	

}


export class EnumFlagImpl {


	all(dest: number, source: number) {
		return (dest & source) === source
	}

	any(dest: number, source: number) {
		return (dest & source) !== 0
	}


	allKeys<T extends Enumeration>(data: T, value: number) {
		return this.allValues(data, value).map(e => data[e])
	}

	keys<T extends Enumeration>(data: T, value: number) {
		return this.values(data, value).map(e => data[e])
	}


	private fetchValues(data: number[], value: number) {

		return data.reduce<number[]>((r, e) => {
			if (this.all(value, e)) {
				r.push(e)
				if (value !== e)
					r.push(...this.fetchValues(data, e))
			}
			return r
		}, [])


	}


	allValues<T extends Enumeration>(data: T, value: number) {
		return ((<number[]>Enums.values(data))).filter(e => (value & e) === e)
	}


	values<T extends Enumeration>(data: T, value: number) {
		if (data[value] !== undefined) return [value]
		const values = (<number[]>Enums.values(data)).sort((x, y) => y - x)
		const set = new Set<number>()
		return values.reduce<number[]>((r, e, i, array) => {
			if (!set.has(e) && this.all(value, e)) {
				r.push(e)
				this.fetchValues(array, e).forEach(e => set.add(e))
			}
			return r
		}, [])

	}



	translate<T>(data: number, map: Record<number, T>) {
		if (map[data]) return map[data]
		const keys = Object.keys(map).map(e => Number(e)).sort((x, y) => x === y ? 0 : (x > y ? -1 : 1))
		for(let item of keys)
			if (data & item) return map[item]
		
		return map[0]
	}


}


export const Enums = new EnumImpl
export const Flags = new EnumFlagImpl

