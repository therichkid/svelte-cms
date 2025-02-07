export class TypeWriter {
  private typedText = '';
  private text = '';
  private index = 0;
  private isTyping = false;

  constructor(
    private onLetterTyped: (typedText: string) => void,
    private typingSpeed = 3,
  ) {}

  add(text: string) {
    this.text += text;

    if (!this.isTyping) {
      this.startTyping();
    }
  }

  clear() {
    this.typedText = '';
    this.text = '';
    this.index = 0;
  }

  private async startTyping() {
    this.isTyping = true;

    while (this.index < this.text.length) {
      this.typedText += this.text[this.index];
      this.index++;

      this.onLetterTyped(this.typedText);

      await new Promise((resolve) => setTimeout(resolve, this.typingSpeed));
    }

    this.isTyping = false;
  }
}
