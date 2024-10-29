interface TextAnimatorOptions {
	interval: number;
}

export class TextAnimator {
	animatedText = $state('');

	private fullText = '';
	private index = 0;
	private isRunning = false;

	constructor(private options: TextAnimatorOptions = { interval: 5 }) {}

	addText(text: string) {
		this.fullText += text;

		if (!this.isRunning) {
			this.animate();
		}
	}

	reset() {
		this.animatedText = '';
		this.fullText = '';
		this.index = 0;
	}

	private async animate() {
		this.isRunning = true;

		while (this.index < this.fullText.length) {
			this.animatedText += this.fullText[this.index];
			this.index++;
			await new Promise((resolve) => setTimeout(resolve, this.options.interval));
		}

		this.isRunning = false;
	}
}
