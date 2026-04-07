export const composeUrl = (params) => {
    const { Uco } = params
    const app = 'https://apl.unob.cz/vvi/vysledky'

    const result = `${app}?Uco=${Uco}`
    return result
}