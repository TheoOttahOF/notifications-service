export class DatabaseError extends Error {
    constructor(message?: string, innerError?: Error) {
        super(`${message}\n${innerError}`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
