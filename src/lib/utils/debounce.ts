// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttleUntilIdle = <T extends (...args: any[]) => void>(
	callback: T,
	wait: number,
): T => {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let called = false;

	return ((...args: Parameters<T>) => {
		if (!called) {
			callback(...args);
			called = true;
		}

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			called = false;
		}, wait);
	}) as T;
};
