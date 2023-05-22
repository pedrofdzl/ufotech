export class http404 extends Error{
    constructor(message){
        super(message);
        this.name = '404'
    }
}

export class http500 extends Error {
    constructor(message){
        super(message);
        this.name = '500'
    }
};