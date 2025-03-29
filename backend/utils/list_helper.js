const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostLikes, blog) => {
    return mostLikes === null || mostLikes.likes < blog.likes ? blog : mostLikes
  }, null)
}

const mostBlogs = (blogs) => {
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})
  console.log(authorCounts)

  const topAuthor = Object.entries(authorCounts).reduce(
    (max, author) => (author[1] > max.count ? { author: author[0], count: author[1] } : max),
    { author: '', count: 0 },
  )

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
