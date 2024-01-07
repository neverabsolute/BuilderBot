import { DEGREES } from "../../configs.js";

export async function filterForDegrees(value: string) {
	const autocomplete = [];

	for (const degree of Object.values(DEGREES)) {
		if (degree.name.toLowerCase().includes(value.toLowerCase())) {
			autocomplete.push({
				value: degree.id,
				name: degree.name
			});
		}
	}

	return autocomplete;
}

export function getDegreeById(id: string) {
    return Object.values(DEGREES).find(degree => degree.id === id);
}

export function getDegreeByName(name: string) {
    return Object.values(DEGREES).find(degree => degree.name === name);
}