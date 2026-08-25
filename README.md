# Easy Page

English|[中文](README-zh_CN.md)

The development of this warehouse code has been halted due to logical issues!

A simple web page for quickly building sites.

# Usage

Generally, you don't need to modify much; simply edit assets/js/data.js to add articles or pages.

## data.js Format

Format:

```javascript
const DOC_DATA = {    // stores data
    'group': {
        label: 'Name displayed in the "::" menu for this group',
        volumes: [
            {
                name: 'Parent volume name',
                children: [
                    {
                        type: 'article',    // type: article for an article, subvolume for a sub-volume
                        title: 'Article title',
                        file: 'Article file location',
                    },
                    {
                        type: 'subvolume',
                        name: 'Sub-volume name',
                        children: [
                        { 
                            type: 'article', 
                            title: 'Article title', 
                            file: 'Article file location',
                            openMode: 'embed'    // openMode: embed for embedded display, blank to open in a new tab; note that for blank, you need to manually add styling in the article itself.
                        }
                        ]
                    }
                ]
            }
        ]
    }
}

const DEFAULT_GROUP = 'group';    // Default group to open.
```

Simple example:

```javascript
const DOC_DATA = {
    'groupA': {
        label: 'Example Group A',
        volumes: [
            {
                name: 'Parent Volume 1',
                children: [
                    { type: 'article', title: 'Article 1-1', file: 'assets/pages/page1.html', openMode: 'embed' },
                    { type: 'subvolume', name: 'Sub-volume 1-1', children: [
                        { type: 'article', title: 'Article 1-1-1', file: 'assets/pages/page3.html', openMode: 'embed' }
                    ]},
                    { type: 'article', title: 'Article 1-2', file: 'assets/pages/page2.html', openMode: 'blank' },
                    { type: 'subvolume', name: 'Sub-volume 1-2', children: [
                        { type: 'article', title: 'Article 1-2-1', file: 'assets/pages/page4.html', openMode: 'blank' }
                    ]}
                ]
            },
            {
                name: 'Parent Volume 2',
                children: [
                    { type: 'subvolume', name: 'Sub-volume 2-1', children: [
                        { type: 'article', title: 'Article 2-1-1', file: 'assets/pages/page6.html', openMode: 'embed' }
                    ]},
                    { type: 'article', title: 'Article 2-1', file: 'assets/pages/page5.html', openMode: 'embed' }
                ]
            }
        ]
    },
    'groupB': {
        label: 'Example Group B',
        volumes: [
            {
                name: 'Parent Volume 3',
                children: [
                    { type: 'article', title: 'Article 3-1', file: 'assets/pages/page7.html', openMode: 'blank' },
                    { type: 'subvolume', name: 'Sub-volume 3-1', children: [
                        { type: 'article', title: 'Article 3-1-1', file: 'assets/pages/page8.html', openMode: 'embed' }
                    ]}
                ]
            }
        ]
    }
};

const DEFAULT_GROUP = 'groupA';
```

## URL Navigation

Open a specific article on startup.

Format: #group_name/article_file_path

Example:

```url
http://localhost:5500/index.html#groupA/page1.html
```

---

Translated from Chinese by [DeepSeek](https://www.deepseek.com/)