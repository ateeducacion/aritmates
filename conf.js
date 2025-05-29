// const { includes } = require("core-js/fn/dict")

// Configuracion jsdoc
module.exports = {
  'plugins': [
    'plugins/markdown',
    // 'plugins/summarize',
    // 'node_modules/better-docs/typescript',
  ],
  'recurseDepth': 10,
  'source': {
    include: ['src'],
    includePattern: '\\.(jsx|js|ts|tsx)$',
  },
  'tags': {
    // 'allowUnknownTags': ['optional'],
    'allowUnknownTags': true,
    'dictionaries': ['jsdoc'],
  },
  'opts': {
    'encoding': 'utf8',
    'destination': './docs/',
    'recurse': true,
    'private': true,
    'verbose': true,
    // 'template': 'node_modules/better-docs',
    'template': './node_modules/docdash',
  },
  'templates': {
    'search': true,
    'cleverLinks': false,
    'monospaceLinks': true,
    'useLongnameInNav': false,
    'showInheritedInNav': true,
    // 'cleverLinks': false,
    // 'monospaceLinks': false,
    // 'search': true,
    // 'default': {
    //   'staticFiles': {
    //     'include': [
    //       './docs-src/statics',
    //     ],
    //   },
    // },
    'better-docs': {
      'name': 'Documentación Aritmates',
      // 'logo': 'images/logo.png',
      'title': 'Documentación Aritmates', // HTML title
      // 'css': 'style.css',
      // 'trackingCode': 'tracking-code-which-will-go-to-the-HEAD',
      'hideGenerator': false,
      'navLinks': [
        {
          'label': 'DEV',
          'href': 'http://omvs0006.medusa.gobiernodecanarias.net/aritmates/',
        },
        {
          'label': 'PRE',
          'href': 'https://www3-pre.gobiernodecanarias.org/medusa/apps/aritmates/',
        },
        // {
        //   'label': 'Example Application',
        //   'href': 'https://admin-bro-example-app.herokuapp.com/admin',
        // },
      ],
    },
  },
  'docdash': {
    'static': true, // Display the static members inside the navbar
    'sort': true, // Sort the methods in the navbar
    // "sectionOrder": [               // Order the main section in the navbar (default order shown here)
    //      "Classes",
    //      "Modules",
    //      "Externals",
    //      "Events",
    //      "Namespaces",
    //      "Mixins",
    //      "Tutorials",
    //      "Interfaces"
    // ],
    'search': true, // Display seach box above navigation which allows to search/filter navigation items
    'collapse': true, // Collapse navigation by default except current object's navigation of the current page
    'wrap': true, // Wrap long navigation names instead of trimming them
    'typedefs': true, // Include typedefs in menu
    // 'navLevel': [integer],          // depth level to show in navbar, starting at 0 (false or -1 to disable)
    // 'private': [false|true],        // set to false to not show @private in navbar
    // 'removeQuotes': [none|all|trim],// Remove single and double quotes, trim removes only surrounding ones
    // 'scripts': [],                  // Array of external (or relative local copied using templates.default.staticFiles.include) js or css files to inject into HTML,
    'menu': { // Adding additional menu items after Home
      'Project Website': { // Menu item name
        'href': 'https://myproject.com', // the rest of HTML properties to add to manu item
        'target': '_blank',
        'class': 'menu-item',
        'id': 'website_link',
      },
      'Forum': {
        'href': 'https://myproject.com.forum',
        'target': '_blank',
        'class': 'menu-item',
        'id': 'forum_link',
      },
    },
    // scopeInOutputPath: [false|true], // Add scope from package file (if present) to the output path, true by default.
    // nameInOutputPath: [false|true], // Add name from package file to the output path, true by default.
    // versionInOutputPath: [false|true] // Add package version to the output path, true by default.
  },
};


