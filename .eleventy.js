module.exports = function(eleventyConfig) {
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Date filters for blog
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    }).format(new Date(dateObj));
  });
  eleventyConfig.addFilter("dateToRFC822", (dateObj) => {
    return new Date(dateObj).toUTCString();
  });

  // Add current year shortcode for footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
