// Load the live site's CSS into the preview iframe so it looks like the real page
CMS.registerPreviewStyle('/styles.css');

var PostPreview = function (props) {
  var entry = props.entry;
  var title = entry.getIn(['data', 'title']) || 'Untitled Post';
  var rawDate = entry.getIn(['data', 'date']);
  var author = entry.getIn(['data', 'author']) || '';
  var featuredImage = entry.getIn(['data', 'featuredImage']);
  var body = props.widgetFor('body');

  var formattedDate = '';
  if (rawDate) {
    try {
      formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      }).format(new Date(rawDate));
    } catch (e) {
      formattedDate = String(rawDate);
    }
  }

  var meta = [formattedDate, author].filter(Boolean).join(' \u00B7 ');

  return h('div', null,
    h('header', { className: 'blog-hero' },
      h('img', {
        src: '/assets/hero-mountain.webp',
        alt: '',
        className: 'hero-bg-img',
        width: '1920',
        height: '1080'
      }),
      h('div', { className: 'container' },
        h('h1', null, title),
        h('p', { className: 'blog-hero-meta' }, meta)
      )
    ),
    h('article', { className: 'section' },
      h('div', { className: 'container' },
        featuredImage
          ? h('div', { className: 'blog-post-hero-image' },
              h('img', { src: featuredImage, alt: title })
            )
          : null,
        h('div', { className: 'blog-post-body' }, body)
      )
    )
  );
};

CMS.registerPreviewTemplate('blog', PostPreview);
