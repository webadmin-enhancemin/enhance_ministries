module.exports = {
  layout: "layouts/post.njk",
  tags: "blog",
  permalink: function({ page, date }) {
    // Don't generate a page for future-dated posts
    if (date && new Date(date) > new Date()) {
      return false;
    }
    return `/blog/${page.fileSlug}/`;
  }
};
