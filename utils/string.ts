
export class StringImpl {
	plural(data: string) {
		if (!data.endsWith('y')) return data +'s'
		return data.substr(0, data.length -1) +'ies'
	}


	pascal(data: string) {
		return data.charAt(0).toUpperCase() + data.substr(1)
	}

	camel(data: string) {
		return data.charAt(0).toLowerCase() + data.substr(1)
	}

	normalizeControllerName(data: string) {
		return this.plural(this.camel(data)).toLowerCase()
	}

	normalizeProviderName(data: string) {
		return this.plural(this.trimEnd(this.camel(data), 'Provider').toLowerCase())
	}
	
	trimStart(data: string, replace: string) {
		if (!replace || !replace.length || replace.length > data.length) return data
		if (Array.prototype.some.call(replace, (e: string, i: number) => e !== data[i])) return data
		return data.substring(replace.length)
	}


	trimEnd(data: string, word: string) {
		if (word.length > data.length) return data

		do {
			for(let i = -1; i >= -word.length; i--) {
				if (word.at(i) !== data.at(i)) return data
			}
			data = data.substr(0, data.length - word.length)
		} while(true)
	}

	urlCombine(...paths: string[]) {
		if (paths.length === 1) return paths[0]
		let hasLeft, hasRight
		return paths.reduce((r, e, i) => {
			if (i === 0) return e
			hasLeft = r.endsWith('/')
			hasRight = e.startsWith('/')
			if (hasLeft && hasRight) return r + e.substr(1)
			if (!hasLeft && !hasRight) return r +'/'+ e
			return r + e
		}, '')
	}


}


export const Strings = new StringImpl

// console.log(Strings.normalizeControllerName('User'))

// console.log(Strings.urlCombine('User', '1', '/2'))

// const d = 'accountProviderProvider'
// console.log(Strings.trimeEnd(d, 'Provider'))