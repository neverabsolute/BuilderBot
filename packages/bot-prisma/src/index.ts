import { PrismaClient } from "../prisma/generated/index.js";

export const prisma = new PrismaClient();
export * from "../prisma/generated/index.js";

// Allow BigInt Serialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

export class AppError extends Error {
	constructor(message: string) {
		super(message);
	}
}
