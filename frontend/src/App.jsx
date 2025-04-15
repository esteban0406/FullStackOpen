import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const fetcgBlogs = async () => {
      try {
        setBlogs(await blogService.getAll());
      } catch (error) {
        setErrorMessage(error.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    };
    fetcgBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlofappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlofappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  };

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const BlogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    };

    try {
      const returnedBlog = await blogService.create(BlogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ title: "", author: "", url: "" });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error creating blog');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const BlogForm = () => (
    <div>
      <h2>New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          Author:
          <input
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          URL:
          <input name="url" value={newBlog.url} onChange={handleBlogChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.username} logged in</p>
          <button
            onClick={() => {
              window.localStorage.removeItem("loggedBlofappUser");
              setUser(null);
            }}
          >
            log out
          </button>
          {BlogForm()}
        </div>
      )}
      <h2>List of Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
