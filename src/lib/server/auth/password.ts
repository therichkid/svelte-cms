import { hash, verify, type Options } from '@node-rs/argon2';

const HASH_OPTIONS: Options = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
};

export const verifyPassword = async (password: string, hash: string) => {
	const isValid = await verify(hash, password, HASH_OPTIONS);
	return isValid;
};

export const hashPassword = async (password: string) => {
	const hashedPassword = await hash(password, HASH_OPTIONS);
	return hashedPassword;
};
