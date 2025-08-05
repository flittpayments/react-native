export const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')

    if (cleaned.length >= 3) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }

    return cleaned
}
