class CommentModel {
  constructor(body) {
    const { content, postId, authorId } = body;
    this.content = content;
    this.postId = postId;
    this.authorId = authorId;
  }
}
module.exports = CommentModel;
