
import "reflect-metadata"

interface IProvider {
	name: string
	instance?: any
	provide: any,
	isService: boolean,
	isProvider: boolean
}

export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export const Type = Function

export type TokenProvider = string | symbol | Type | Function | any;



class MetadataImpl {
	paramTypes(targetPrototype: any, propertyKey?: string | symbol) : any[] {
		return Reflect.getMetadata('design:paramtypes', targetPrototype, propertyKey!) || []
	}
}

const Metadata = new MetadataImpl



class DIImpl extends Map<TokenProvider, IProvider> {

	private apply(provider: Type) {
		Metadata.paramTypes(provider)
		return (deps: any[]) => new provider(...deps)
	}
	
	private invoke<T>(token: TokenProvider) {
		const provider = super.get(token)
		if (!provider) return provider

		return this.get<T>(token)!
	}

	private resolve<T>(target: TokenProvider) {
		const provider = super.get(target)!
		const deps = Metadata.paramTypes(target)
		const construct = (deps: TokenProvider[]) => new provider.provide(...deps)
		const services = deps.map(e => this.get(e))
		return provider.instance = construct(services)
	}

	private ensure(token: TokenProvider) : IProvider | undefined {
		if (!super.has(token) && GlobalRegistry.has(token))
			super.set(token, GlobalRegistry.get(token)!)
		return super.get(token)
	}

	get<T>(target: TokenProvider) : T | undefined {
		const instance = super.get(target)?.instance
		if (instance !== undefined) return instance

		if (!this.ensure(target)) return undefined
		return this.resolve(target)
	}

}
export const DI = new DIImpl

class GlobalRegistryImpl extends Map<TokenProvider, IProvider> {

	services() {
		return Array.from(this.values()).filter(e => e.isService)
	}


	providers() {
		return Array.from(this.values()).filter(e => e.isProvider)
	}
}

export const GlobalRegistry = new GlobalRegistryImpl


export function Provider(target: Function) {
	GlobalRegistry.set(target, {
		name: target.name,
		provide: target,
		isService: false,
		isProvider: true
	})
}

export function Serivce(target: Function) {
	GlobalRegistry.set(target, {
		name: target.name,
		provide: target,
		isService: true,
		isProvider: false
	})
}


// @Serivce
// class TestEntry {
// 	constructor() {
// 			console.log('provider')
// 	}
// }

// @Serivce
// class TestProvider {
// 	constructor(data: TestEntry) {
// 			console.log('provider', data)
// 	}
// }


// @Serivce
// class TestService {
// 	constructor(
// 		provider: TestProvider,
// 		b: string
// 	) {
// 			console.log('service', arguments)
// 	}
// }


// const result = DI.get(TestService)
// console.log(result)
