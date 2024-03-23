import { marked } from 'marked'
import DOMPurify from 'dompurify'

console.log(DOMPurify)
export function mdToUi(md) {
	return DOMPurify.sanitize(marked.parse(md), { USE_PROFILES: { html: true } })
}