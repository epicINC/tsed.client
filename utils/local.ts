import { ILocalContext } from '../components'


if (!('window' in globalThis)) {
	globalThis.window = {
		localStorage: {
			// @ts-ignore
			getItem(){},
			setItem(){},
			removeItem(){}
		}
	}
}

class LocalStorageImpl {

	

	get<T>(key: string) : T | null {
		return window.localStorage.getItem(key) && JSON.parse(window.localStorage.getItem(key)!)
	}

	set(key: string, data: object) {
		window.localStorage.setItem(key, JSON.stringify(data))
	}

	remove(key: string) {
		window.localStorage.removeItem(key)
	}

}


export const LocalStorages = new LocalStorageImpl

class ContextStorageImpl {

	get<T extends ILocalContext>() {
		return LocalStorages.get<T>('context')
	}

	set<T extends ILocalContext>(data: T) {
		LocalStorages.set('context', data)
	}

	remove() {
		LocalStorages.remove('context')
	}
}

export const ContextStorages = new ContextStorageImpl