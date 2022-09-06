
type Func<T extends any[], R> = (...args: T) => R

function DefaultClass(...data: any[]): ClassDecorator {
	return <TFunction extends Function>(target: TFunction) => { }
}

const EmptyPropertyDecorator: PropertyDecorator = (...agrs: any[]) => { }



function DefaultProperty(...data: any[]) {
	const result = (...args: any[]): any => {
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
export const Default = DefaultProperty
export const Description = DefaultProperty
export const Integer = DefaultProperty
export const Enum = DefaultProperty
export const Groups = DefaultProperty
export const Email = DefaultProperty

export const array = DefaultProperty
export const For = DefaultProperty
export const oneOf = DefaultProperty
export const Pattern = DefaultProperty
export const SpecTypes = DefaultProperty
export const string = DefaultProperty









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
export const ViewEntity = DefaultClass
export const Column = DefaultProperty
export const CreateDateColumn = DefaultProperty
export const PrimaryGeneratedColumn = DefaultProperty
export const PrimaryColumn = DefaultProperty
export const ViewColumn = DefaultProperty

export const DeleteDateColumn = DefaultProperty
export const UpdateDateColumn = DefaultProperty



export const OneToMany = function <T, K>(a: Func<[any], { new(): T }>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
export const ManyToOne = function <T, K>(a: Func<[any], { new(): T }>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
export const ManyToMany = function <T, K>(a: Func<[any], { new(): T }>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
export const JoinColumn = function <T, K>(a: object) {
	return EmptyPropertyDecorator
}

export const OneToOne = function <T, K>(a: Func<[], { new(): T }>, b: Func<[T], K> | object, c?: object) {
	return EmptyPropertyDecorator
}
