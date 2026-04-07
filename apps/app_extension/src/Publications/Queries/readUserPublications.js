import { readURL } from '@hrbolek/readers'

import { composeUrl } from './composeUrl'
import { html2Publications } from './html2Publications'
export const readUserPublications = async (Uco) => {
    const url = composeUrl({Uco})
    const html = await readURL(url)
    const pubs = html2Publications(html)
    return pubs
}