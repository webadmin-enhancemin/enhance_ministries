module.exports = {
  layout: "layouts/post.njk",
  tags: "blog",
  permalink: function({ page }) {
    return `/blog/${page.fileSlug}/`;
  }
};
