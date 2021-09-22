
export class ArrayImpl {
	partition<T>(data: T[], predicate: (e: T, i?: number) => boolean) {
		return data.reduce<[T[], T[]]>((r, e, i) => {
			r[predicate(e, i) ? 0 : 1].push(e)
			return r
		}, [[], []])
	}

}


export const Arrays = new ArrayImpl
