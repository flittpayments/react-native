import {IBank} from "../manager/bank/types";

export function compareBanks(bank1: IBank, bank2: IBank): number {
    if (bank1.user_priority !== bank2.user_priority) {
        return bank2.user_priority - bank1.user_priority;
    }
    return bank2.country_priority - bank1.country_priority;
}
