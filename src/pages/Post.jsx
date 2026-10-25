
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Post.css";

function Post() {
  const [postType, setPostType] = useState("Question");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleText, setArticleText] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const user = auth.currentUser;

    if (!user) {
      setMessage("Please log in before creating a post.");
      return;
    }

    const enteredTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    if (enteredTags.length < 1 || enteredTags.length > 3) {
      setMessage("Please enter between 1 and 3 tags.");
      return;
    }

    if (postType === "Question" && !description.trim()) {
      setMessage("Please describe your problem.");
      return;
    }

    if (
      postType === "Article" &&
      (!abstract.trim() || !articleText.trim())
    ) {
      setMessage("Please enter both the abstract and article text.");
      return;
    }

    const postData = {
      type: postType,
      title: title.trim(),
      tags: enteredTags,
      authorId: user.uid,
      authorEmail: user.email,
      createdAt: serverTimestamp(),
    };

    if (postType === "Question") {
      postData.description = description.trim();
    } else {
      postData.abstract = abstract.trim();
      postData.articleText = articleText.trim();
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "posts"), postData);

      setMessage("Post saved successfully to Firestore!");

      setPostType("Question");
      setTitle("");
      setDescription("");
      setAbstract("");
      setArticleText("");
      setTags("");
    } catch (error) {
      console.error("Error saving post:", error);
      setMessage(
        error.code === "permission-denied"
          ? "Firestore denied this operation. Please check your security rules."
          : "Unable to save the post. Please try again."
      );
    } finally {
      setSaving(false);
    }
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

        <h3>What do you want to ask or share?</h3>

        <p className="post-help">
          Select Question or Article to display the relevant fields.
        </p>

        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a descriptive title"
          required
        />

        {postType === "Question" ? (
          <>
            <label htmlFor="post-description">Describe your problem</label>
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
          placeholder="e.g. React, JavaScript"
          required
        />

        <button className="post-submit" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Post"}
        </button>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}

export default Post;
