
type Func<T extends any[], R> = (...args: T) => R

function DefaultClass(...data: any[]) : ClassDecorator {
	return <TFunction extends Function>(target: TFunction) => {}
}

const EmptyPropertyDecorator: PropertyDecorator = (...agrs: any[]) => {}



function DefaultProperty(...data: any[]) {
		const result = (...args: any[]) : any => {
		}
		result.MinItems = DefaultProperty
		result.MaxItems = DefaultProperty
		return result
}


export interface ArrayOfChainedDecorators {
	(...args: any): any
	MinItems(minItems: number): this
	MaxItems(maxItems: number): this
	// Contains(): this
	// UniqueItems(uniqueItems: boolean): this
}

// @tsed/schema
export const Generics = DefaultClass


export const Required = DefaultProperty
export const Property = DefaultProperty
export const Format = DefaultProperty
export const GenericOf = DefaultProperty
export const MaxLength = DefaultProperty
export const Minimum = DefaultProperty
export const Maximum = DefaultProperty
export const MinLength = DefaultProperty
export const Ignore = DefaultProperty

export const CollectionOf = DefaultProperty as ArrayOfChainedDecorators



// @tsed/common
export const PlatformTest = {
	get<T>(...args: any[]) {
	
	},
	create() {

	},
	reset() {

	}
}



// typeorm
export const Entity = DefaultClass
export const Column = DefaultProperty
export const CreateDateColumn = DefaultProperty
export const PrimaryGeneratedColumn = DefaultProperty
export const PrimaryColumn = DefaultProperty
export const OneToMany = function<T, K>(a: Func<[], {new(): T}>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
export const ManyToOne = function<T, K>(a: Func<[], {new(): T}>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
export const JoinColumn = function<T, K>(a: object) {
	return EmptyPropertyDecorator
}

export const OneToOne = function<T, K>(a: Func<[], {new(): T}>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}

