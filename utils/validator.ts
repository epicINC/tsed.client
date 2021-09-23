
class ValidatorImpl {
	isNumber(data: number) {
		return !isNaN(data) && isFinite(data)
	}

	isFalsity(data: any) {
		return data === undefined || data === null
	}


	isEmail(data: string) {
		if (!data) return false
		return /^[A-Za-z0-9\_\.\-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data)
	}

	isChinaMobile(data: string) {
		if (!data) return false
		return /^1(?:70\d|(?:9[189]|8[0-9]|7[135-8]|66|5[0-35-9])\d|47\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/.test(data)
	}
}

export const Validators = new ValidatorImpl