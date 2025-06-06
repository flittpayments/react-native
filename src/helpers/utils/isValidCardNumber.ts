import {lunaCheck} from "./lunaCheck";

const CVV4_BINS = ["32", "33", "34", "37"];

export function isCvv4Length(cardNumber: string): boolean {
    for (let i = CVV4_BINS.length - 1; i >= 0; --i) {
        if (cardNumber.startsWith(CVV4_BINS[i])) {
            return true;
        }
    }
    return false;
}
export const buildExp = (mm: number, yy: number) => {
    return (mm < 10 ? '0' : '') + mm + yy;
};
const isValidCardNumber = (cardNumber:string) => {
    if (!(12 <= cardNumber.length && cardNumber.length <= 19)) {
        return false;
    }
    return lunaCheck(cardNumber);
};

export function isValidExpireMonthValue(mm: number): boolean {
    return mm >= 1 && mm <= 12;
}

export function isValidExpireYearValue(yy: number): boolean {
    return yy >= 23 && yy <= 99;
}

const isValidExpireMonth = (mm:number): boolean => {
    return isValidExpireMonthValue(mm);
};

const isValidExpireYear = (yy:number): boolean => {
    if (!isValidExpireYearValue(yy)) {
        return false;
    }
    const year = new Date().getFullYear() - 2000;
    return year <= yy;
};

const isValidExpireDate = (mm:number,yy:number): boolean => {
    if (!isValidExpireMonthValue(mm)) {
        return false;
    }
    if (!isValidExpireYearValue(yy)) {
        return false;
    }

    const now = new Date();
    const year = now.getFullYear() - 2000;
    const month = now.getMonth() + 1;

    return (yy > year) || (yy >= year && mm >= month);
};

const isValidCvv = (cvv:string,cardNumber:string): boolean => {
    if (isCvv4Length(cardNumber)) {
        return cvv.length === 4;
    } else {
        return cvv.length === 3;
    }
};

const isValidCard = (cardNumber:string,mm:number,yy:number,cvv:string): boolean => {
    return isValidCardNumber(cardNumber) &&
        isValidExpireDate(mm,yy) &&
        isValidCvv(cvv,cardNumber);
};

export {
    isValidCvv,
    isValidExpireMonth,
    isValidExpireYear,
    isValidExpireDate,
    isValidCardNumber,
    isValidCard,
}
