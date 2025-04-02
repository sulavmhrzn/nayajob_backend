export class Envelope<T> {
    status: string;
    message: string;
    data?: T;
    error?: string;
    constructor(status: string, message: string, data?: T, error?: string) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    static success<T>(message: string, data?: T): Envelope<T> {
        return new Envelope("success", message, data);
    }
}
