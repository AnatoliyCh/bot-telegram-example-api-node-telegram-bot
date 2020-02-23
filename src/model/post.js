module.exports = class Post {
  attachments = []; //вложения
  text = ""; //текст в посте

  constructor(object) {
    this.attachments = Array.from(object.attachments)
      .filter(item => item.type == "photo")
      .map(item => {
        return {
          type: item.type,
          caption: "",
          media: Array.from(item.photo.sizes).pop().url
        };
      });
    object.text && (this.text = object.text);
    this.attachments.length && (this.attachments[0].caption = this.text);
  }
};
