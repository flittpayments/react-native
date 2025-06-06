export function lunaCheck(cardNumber: string): boolean {
    let sum = 0;
    let odd = true;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        try {
            let num = Number(cardNumber.charAt(i));
            odd = !odd;
            if (odd) {
                num *= 2;
            }
            if (num > 9) {
                num -= 9;
            }
            sum += num;
        } catch (e) {
            return false;
        }
    }

    return sum % 10 === 0;
}
