export class Bank {
    private bankId: string;
    private countryPriority: number;
    private userPriority: number;
    private quickMethod: boolean;
    private userPopular: boolean;
    private name: string;
    private country: string;
    private bankLogo: string;
    private alias: string;

    constructor(
        bankId: string,
        countryPriority: number,
        userPriority: number,
        quickMethod: boolean,
        userPopular: boolean,
        name: string,
        country: string,
        bankLogo: string,
        alias: string
    ) {
        this.bankId = bankId;
        this.countryPriority = countryPriority;
        this.userPriority = userPriority;
        this.quickMethod = quickMethod;
        this.userPopular = userPopular;
        this.name = name;
        this.country = country;
        this.bankLogo = bankLogo;
        this.alias = alias;
    }

    getBankId(): string {
        return this.bankId;
    }

    getName(): string {
        return this.name;
    }

    getCountry(): string {
        return this.country;
    }

    getBankLogo(): string {
        return this.bankLogo;
    }

    getAlias(): string {
        return this.alias;
    }

    getCountryPriority(): number {
        return this.countryPriority;
    }

    getUserPriority(): number {
        return this.userPriority;
    }

    isQuickMethod(): boolean {
        return this.quickMethod;
    }

    isUserPopular(): boolean {
        return this.userPopular;
    }
}
