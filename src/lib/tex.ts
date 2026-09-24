import katex from 'katex';

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Renders a string containing LaTeX math into safe HTML.
 * Supports delimiters: $$...$$ (display), $...$ (inline),
 * \[...\] (display) and \(...\) (inline).
 */
export function tex(input: string): string {
	let s = input
		.replace(/\\\[/g, '$$')
		.replace(/\\\]/g, '$$')
		.replace(/\\\(/g, '$')
		.replace(/\\\)/g, '$');

	const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
	let out = '';
	let last = 0;
	let m: RegExpExecArray | null;
	while ((m = re.exec(s)) !== null) {
		let text = s.slice(last, m.index);
		text = escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
		out += text;
		const display = m[1] !== undefined;
		const math = display ? m[1] : m[2];
		try {
			out += katex.renderToString(math, { displayMode: display, throwOnError: false });
		} catch {
			out += escapeHtml(display ? '$$' + math + '$$' : '$' + math + '$');
		}
		last = re.lastIndex;
	}
	let tail = escapeHtml(s.slice(last)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	out += tail;
	return out;
}
