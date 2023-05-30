
export class ArrayImpl {
	partition<T>(data: T[], predicate: (e: T, i?: number) => boolean) {
		return data.reduce<[T[], T[]]>((r, e, i) => {
			r[predicate(e, i) ? 0 : 1].push(e)
			return r
		}, [[], []])
	}



	group<K, T>(data: T[], keySelector: Func<[T], K>) {
		if (!data.length) return []
		const result = data.reduce((r, e) => {
			const key = keySelector(e), item = r.get(key)
			if (!item) return r.set(key, [e])
			item.push(e)
			return r
		}, new Map<K, T[]>())
		
		return Array.from(result.entries())
	}

	sum(data: number[]) {
		return data.reduce((r, e) => r+= e, 0)
	}

}


export const Arrays = new ArrayImpl
