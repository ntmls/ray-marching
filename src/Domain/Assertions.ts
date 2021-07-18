export class Assertions {

    static moreThanZero(value: number, name: string): void {
        this.notNullOrUndefined(value, name); 
        if (value <= 0) throw new Error(`'${name}' must be greater than zero.}`);
    }

    static zeroOrGreater(value: number, name: string): void {
        this.notNullOrUndefined(value, name); 
        if (value < 0) throw new Error(`'${name}' must be zero or greater.}`);
    }

    static notNullOrUndefined(arg: any, name: string): void {
        if (arg === undefined) throw new Error(`'${name}' is required. Cannot be 'undefined'.`)
        if (arg === null) throw new Error(`'${name}' cannot be null. Cannot be 'null'.`)
    }

    static oneOrGreater(value: number, name: string): void {
       this.notNullOrUndefined(value, name); 
       if (value < 1) throw new Error(`'${name}' must be one or more.}`);
    }
}