type EnvelopeStatusType = "success" | "error";

type EnvelopeSuccessType<T> = {
    status: "success";
    message: string;
    data?: T;
};

type EnvelopeErrorType<T> = {
    status: "error";
    message: string;
    error?: T;
};

export type EnvelopeType<T> = EnvelopeSuccessType<T> | EnvelopeErrorType<T>;

/**
 * Represents an envelope for API responses.
 */
export class Envelope<T> {
    status: EnvelopeStatusType;
    message: string;
    data?: T;
    error?: T;
    constructor(
        status: EnvelopeStatusType,
        message: string,
        data?: T,
        error?: T
    ) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    /**
     * Creates a success envelope.
     * @param message - The success message.
     * @param data - The data to include in the envelope.
     * @returns A success envelope with the provided message and data.
     */
    static success<T>(message: string, data?: T): Envelope<T> {
        return new Envelope<T>("success", message, data);
    }

    /**
     * Creates an error envelope.
     * @param message - The error message.
     * @param error - Optional error details.
     * @returns An error envelope with the provided message and error details.
     */
    static error<T>(message: string, error?: T): Envelope<T> {
        return new Envelope<T>("error", message, undefined, error);
    }

    toObject(): EnvelopeType<T> {
        if (this.status === "success") {
            return {
                status: this.status,
                message: this.message,
                data: this.data,
            };
        }
        return {
            status: this.status,
            message: this.message,
            error: this.error,
        };
    }
}
