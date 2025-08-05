export const parseExpiry = (formatted: string): { month: string; year: string } => {
    const cleaned = formatted.replace(/\D/g, '')
    return {
        month: cleaned.slice(0, 2),
        year: cleaned.slice(2, 4)
    }
}
