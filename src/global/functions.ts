/* verificar igualdad objetos */
export type Primitive = string | number | boolean | null | undefined;
export type PlainObject = {[key: string]: Primitive | PlainObject | Array<Primitive | PlainObject>};

export const deepEqual = (obj1: PlainObject, obj2: PlainObject): boolean => {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		if (!(key in obj2)) return false;

		const val1 = obj1[key];
		const val2 = obj2[key];

		const areObjects =
			val1 !== null && val2 !== null && typeof val1 === 'object' && typeof val2 === 'object';

		if (areObjects) {
			if (Array.isArray(val1) && Array.isArray(val2)) {
				if (val1.length !== val2.length) return false;
				for (let i = 0; i < val1.length; i++) {
					const item1 = val1[i];
					const item2 = val2[i];
					if (typeof item1 === 'object' && typeof item2 === 'object') {
						if (!deepEqual(item1 as PlainObject, item2 as PlainObject)) return false;
					} else if (item1 !== item2) {
						return false;
					}
				}
			} else if (!Array.isArray(val1) && !Array.isArray(val2)) {
				if (!deepEqual(val1, val2)) return false;
			} else {
				return false;
			}
		} else if (val1 !== val2) {
			return false;
		}
	}

	return true;
};

export const MacAddressRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i;
export const MatchesMAC = (id: string): boolean => {
	return MacAddressRegex.test(id);
};
