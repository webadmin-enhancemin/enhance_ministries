/**
 * Eleventy Configuration for Enhance Ministries
 *
 * This file configures Eleventy (11ty) static site generator.
 * Documentation: https://www.11ty.dev/docs/
 */

module.exports = function(eleventyConfig) {

  // ============================================
  // PASSTHROUGH FILE COPY
  // These files are copied as-is to the output
  // ============================================

  // Copy assets folder (images, logos, etc.)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy CSS file
  eleventyConfig.addPassthroughCopy("src/styles.css");

  // Copy robots.txt for SEO
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Copy favicon
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.png": "favicon.png" });

  // ============================================
  // GLOBAL DATA
  // Available in all templates as `site.*`
  // ============================================

  eleventyConfig.addGlobalData("site", {
    name: "Enhance Ministries",
    tagline: "Cultivating Healthy Leaders and Fruitful Ministries",
    url: "https://hogtai.github.io/enhance_ministries",
    email: "info@enhancemin.com",
    phone: "(651) 503-0934",
    address: "8362 Tamarack Village Ste. 119, Woodbury, MN 55125",
    ein: "85-2672334",
    cssVersion: "37",
    currentYear: new Date().getFullYear(),
    social: {
      facebook: "https://www.facebook.com/EnhanceMinistries",
      instagram: "https://www.instagram.com/enhanceministries/"
    }
  });

  // ============================================
  // FILTERS
  // Custom template filters
  // ============================================

  // URL filter - ensures correct paths for GitHub Pages
  eleventyConfig.addFilter("url", function(url) {
    // For GitHub Pages subdirectory deployment
    // Change this if moving to a custom domain
    return url;
  });

  // ============================================
  // SHORTCODES
  // Reusable template snippets
  // ============================================

  // Current year shortcode: {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // ============================================
  // CONFIGURATION
  // ============================================

  return {
    // Template formats to process
    templateFormats: ["njk", "md", "html"],

    // Use Nunjucks for HTML files
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",

    // Directory configuration
    dir: {
      input: "src",           // Source files
      output: "_site",        // Build output
      includes: "_includes",  // Partials and layouts
      data: "_data"           // Global data files
    }
  };
};
