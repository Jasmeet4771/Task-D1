
import { useState } from "react";
import "./Post.css";

function Post() {
  const [postType, setPostType] = useState("Question");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleText, setArticleText] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (enteredTags.length === 0 || enteredTags.length > 3) {
      alert("Please enter between 1 and 3 tags.");
      return;
    }

    if (postType === "Question" && !description.trim()) {
      alert("Please describe your problem.");
      return;
    }

    if (postType === "Article") {
      if (!abstract.trim() || !articleText.trim()) {
        alert("Please enter both the abstract and article text.");
        return;
      }
    }

    alert("Your post has been submitted successfully!");
  };

  return (
    <main className="post-page">
      <form className="post-form" onSubmit={handleSubmit}>
        <h2>New Post</h2>

        <div className="post-type">
          <strong>Select Post Type:</strong>

          <label>
            <input
              type="radio"
              name="postType"
              value="Question"
              checked={postType === "Question"}
              onChange={(event) => setPostType(event.target.value)}
            />
            Question
          </label>

          <label>
            <input
              type="radio"
              name="postType"
              value="Article"
              checked={postType === "Article"}
              onChange={(event) => setPostType(event.target.value)}
            />
            Article
          </label>
        </div>

        <h3>What do you want to ask or share</h3>

        <p className="post-help">
          This section is designed based on the type of the post.
          Select Question or Article to display the relevant fields.
        </p>

        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          placeholder={
            postType === "Question"
              ? "Start your question with how, what, why, etc."
              : "Enter a descriptive title"
          }
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        {postType === "Question" ? (
          <>
            <label htmlFor="post-description">
              Describe your problem
            </label>
            <textarea
              id="post-description"
              rows="9"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain your problem..."
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="post-abstract">Abstract</label>
            <textarea
              id="post-abstract"
              rows="3"
              value={abstract}
              onChange={(event) => setAbstract(event.target.value)}
              placeholder="Enter a short abstract"
              required
            />

            <label htmlFor="post-article-text">Article Text</label>
            <textarea
              id="post-article-text"
              rows="9"
              value={articleText}
              onChange={(event) => setArticleText(event.target.value)}
              placeholder="Write your article..."
              required
            />
          </>
        )}

        <label htmlFor="post-tags">Tags</label>
        <input
          id="post-tags"
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Enter up to 3 tags separated by commas, e.g. Java"
          required
        />

        <button className="post-submit" type="submit">
          Post
        </button>
      </form>
    </main>
  );
}

export default Post;
