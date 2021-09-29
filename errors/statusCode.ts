
export class StatusCodeException extends Error {

	constructor(public statusCode: number, message: string) {
		super(message)
	}
}


export class ArgumentNull extends StatusCodeException {
	constructor(message: string) {
		super(500, message)
	}
}

export class NotFound extends StatusCodeException {

	constructor(message: string) {
		super(404, message)
	}

}

export class NotValid extends StatusCodeException {

	constructor(message: string) {
		super(500, message)
	}

}



export class SystemException extends Error {

}


export class FormatException extends SystemException {

	constructor(message?: string) {
		super(message)
	}
}