import { FormatException } from '../errors'

interface DatePart<T = number> {
	year: T
	month: T
	day: T
	hour: T
	minute: T
	second: T
	millionths: T
}

type DatePartKey = keyof DatePart

function escapeRegExp(data: string) {
  return data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const formater: Record<string, RegExp> = {}

function toRegex(format: string) {
	if (formater[format]) return formater[format]

	const result = escapeRegExp(format).replace(/((y+)|(M+)|(d+)|(h+)|(H+)|(m+)|(s+)|(t+)|(z+)|(f+)|(F+))/g, (substring: string, ...args: any[]) => {

		const len = substring.length
		switch(substring[0]) {
			case 'y':
				return `(?<year>\\d{${len === 1 ? '1, 4' : len}})`
			case 'M':
				return `(?<month>\\d{${len === 1 ? '1, 2' : len}})`
			case 'd':
				return `(?<day>\\d{${len === 1 ? '1, 2' : len}})`
			case 'H':
				return `(?<hour>\\d{${len === 1 ? '1, 2' : len}})`
			case 'm':
				return `(?<minute>\\d{${len === 1 ? '1, 2' : len}})`
			case 's':
				return `(?<second>\\d{${len === 1 ? '1, 2' : len}})`
			case 'f':
				return `(?<millionths>\\d{${len}})`
			case 'F':
				return `(?<millionths>\\d{1, ${len}})`
			case 't':
				return `(?<AM/PM designator>\\d{${len === 1 ? '1, 2' : len}})`
		}
		return substring

	})
	return formater[format] = new RegExp(result)
}



export class DateTimeImpl {


	ensure(arg: Date | string | number) : Date
	ensure(...args: (Date | string | number)[]) : Date[]
	ensure(...args: (Date | string | number)[]) : Date | Date[] {
		if (args.length === 1) return this.ensureOne(args[0])
		return args.map(e => this.ensureOne(e))
	}

	private ensureOne(data: Date | string | number) {
		switch(typeof(data)) {
			case 'string':
			case 'number':
				return new Date(data)
			default:
				if (data instanceof Date) return data
				throw new Error('ensure.argument')
				break
		}
	}


	startOf(data: Date, unit: DatePartKey = 'day') {
		const result = new Date(data.getTime())
		switch(unit) {
			case 'day':
				result.setHours(0, 0, 0, 0)
				return result
		}
	}


	endOf(data: Date, unit: DatePartKey = 'day') {
		const result = new Date(data.getTime())
		switch(unit) {
			case 'day':
				result.setHours(23, 59, 59, 999)
				return result
		}
	}



	parseExact(dt: string, format: string) {
		const regex = toRegex(format)
		const part = dt.match(regex)
		if (!part || !part.groups) throw new FormatException('dt')
		const groups = Object.fromEntries(Object.entries(part.groups).map(([key, val]) => [key, Number(val)])) as Partial<DatePart<number>>
		console.log(groups)
		return new Date(groups.year ?? 0, (groups.month && groups.month - 1) ?? 0, groups.day ?? 0, groups.hour ?? 0, groups.minute ?? 0, groups.second ?? 0, groups.millionths ?? 0)
	}


	toZhCNDate(date: Date) {

		return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
	}
	
}



export const DateTimes = new DateTimeImpl
// var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
// var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
// console.log(DateTimes.parseExact('2019-08-11 11:24:33.1234', 'yyyy-MM-dd HH:mm:ss.ffff'))