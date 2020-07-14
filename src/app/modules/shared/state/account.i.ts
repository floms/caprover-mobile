
export interface AccountI {
    label?: string;
    host: string;
    secure?: boolean;
    token?: string;
    remember?: boolean;
}

export interface AccountStateModel {
    accounts: AccountI[];
    active: string;
}