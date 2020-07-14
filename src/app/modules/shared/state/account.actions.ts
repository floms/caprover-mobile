import { AccountI } from './account.i';


export class Login {
    static readonly type = '[Account] Login';
    constructor(public host: string, public password: string, public secure: boolean, public remember: boolean = false) { }
}

export class ResetAccounts {
    static readonly type = '[Account] Reset Accounts';
    constructor() { }
}

export class LoadAccounts {
    static readonly type = '[Account] Load Accounts';
    constructor() { }
}

export class LoadAccountsSuccess {
    static readonly type = '[Account] Load Accounts Success';
    constructor(public accounts: AccountI[]) { }
}

export class AuthenticateCurrentAccount {
    static readonly type = '[Account] Authenticate Current';
    constructor() { }
}

export class AuthenticateAccount {
    static readonly type = '[Account] Authenticate';
    constructor(public account: AccountI) { }
}

export class AddAccount {
    static readonly type = '[Account] Add Account';
    constructor(public account: AccountI) { }
}

export class SetActiveAccount {
    static readonly type = '[Account] Set Active Account';
    constructor(public account: AccountI) { }
}

export class RemoveAccount {
    static readonly type = '[Account] Remove Account';
    constructor(public account: AccountI) { }
}

export class ClearActiveAccount {
    static readonly type = '[Account] Clear Active Account';
    constructor() { }
}