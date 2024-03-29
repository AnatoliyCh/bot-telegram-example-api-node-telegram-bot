module.exports = class Post {
  attachments = []; //вложения
  subText = []; // деление текста на блоки по 1024 (1020 + '...') символа (текст, который не влез)
  regExp = null;
  maxLengthText = 1020;
  specialСhar = "\r\n";
  originalLink = null;

  constructor(object, originalLink) {
    this.originalLink = `${originalLink} ${this.specialСhar}`;
    const length = this.maxLengthText - this.originalLink.length;
    this.regExp = new RegExp("(.|[" + this.specialСhar + "]){1," + length + "}", "g");
    this.attachmentsHandler(object);
    this.textLengthHandler(object.text);
    this.subText[0] = `${this.originalLink}${this.subText[0] ? this.subText[0] : ""}`;
    if (this.attachments.length)
      this.attachments[0].caption = this.subText[0] ? this.subText[0] : "";
  }
  /**
   * Обрабатывает вложения
   */
  attachmentsHandler(object) {
    this.attachments = Array.from(object.attachments)
      .filter((item) => item.type == "photo")
      .map((item) => {
        return {
          type: item.type,
          caption: "",
          media: Array.from(item.photo.sizes).reduce((a, b) =>
            a.height + a.width > b.height + b.width ? a : b
          ).url,
        };
      });
  }
  /**
   * Делит текст из поста на части по 1023 символа
   * @param {string} text
   */
  textLengthHandler(text) {
    if (!text) return;
    this.subText = text.match(this.regExp);

    if (this.subText.length) {
      const lastIndex = this.subText.length - 1;
      for (let i = 0; i < this.subText.length; i++) {
        this.subText[i] = this.subText[i].replace(/^[.]\s/g, "").trim();
        i !== lastIndex && (this.subText[i] = `${this.subText[i]}...`);
      }
    }
  }
};
