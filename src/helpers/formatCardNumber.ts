export const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')

    const isAmex = cleaned.startsWith('34') || cleaned.startsWith('37')

    if (isAmex) {
        return cleaned.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (match, p1, p2, p3) => {
            let result = p1
            if (p2) result += ` ${p2}`
            if (p3) result += ` ${p3}`
            return result
        }).trim()
    }

    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}
