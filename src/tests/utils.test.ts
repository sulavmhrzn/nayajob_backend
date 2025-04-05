import { describe, expect, it } from "vitest";
import type { ZodError } from "zod";
import { Envelope } from "../utils/envelope";
import { prettyZodError, snakeCaseKeys, zPhoneNumber } from "../utils/general";

describe("prettyZodError", () => {
    it("should format zod errors correctly", () => {
        const mockError = {
            issues: [{ path: ["name"], message: "Required" }],
        } as unknown as ZodError;
        const result = prettyZodError(mockError);

        expect(result).toEqual({ name: "Required" });
    });
});

describe("snakeCaseKeys", () => {
    it("should convert object keys to snake_case", () => {
        const input = { firstName: "Sulav", lastName: "Maharjan" };
        const expectedOutput = { first_name: "Sulav", last_name: "Maharjan" };
        const result = snakeCaseKeys(input);
        expect(result).toEqual(expectedOutput);
    });
});

describe("zPhoneNumber", () => {
    it("should validate a valid phone number", () => {
        const validPhoneNumber = "9812345678";
        const result = zPhoneNumber.parse(validPhoneNumber);
        expect(result).toBe(validPhoneNumber);
    });

    it("should invalidate an invalid phone number", () => {
        const invalidPhoneNumber = "12345";
        const result = zPhoneNumber.safeParse(invalidPhoneNumber);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Invalid phone number");
        }
    });
});

describe("envelope", () => {
    it("should create a success envelope", () => {
        const result = Envelope.success("Success", { data: "test" });
        expect(result instanceof Envelope).toBe(true);
        expect(result).toEqual(Envelope.success("Success", { data: "test" }));
    });
    it("should create an error envelope", () => {
        const result = Envelope.error("Error", "error message");
        expect(result instanceof Envelope).toBe(true);
        expect(result).toEqual(Envelope.error("Error", "error message"));
    });
});
