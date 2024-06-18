class PostModel {
  constructor(body) {
    const { title, content, authorId } = body;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.photo = body.photo;
  }
}
module.exports = PostModel;
