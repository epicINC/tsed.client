
export class ArrayImpl {
	partition<T>(data: T[], predicate: Predicate<[T, number?]>) {
		return data.reduce<[T[], T[]]>((r, e, i) => {
			r[predicate(e, i) ? 0 : 1].push(e)
			return r
		}, [[], []])
	}

}


export const Arrays = new ArrayImpl
