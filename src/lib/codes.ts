// Generates a unique 6-digit numeric code in the form "#XXXXXX".
// Physics uses the 300000–399999 band, Botany uses the 100000–199999 band,
// Chemistry uses the 200000–299999 band, so codes are globally unique across databases.
const BASE: Record<string, number> = {
	B: 100000,
	C: 200000,
	P: 300000,
};

export function makeCode(subject: 'P' | 'B' | 'C', index: number): string {
	const base = BASE[subject] ?? 100000;
	const n = base + index;
	return '#' + n.toString().padStart(6, '0');
}
