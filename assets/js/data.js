// 数据
const DOC_DATA = {
    'groupA': {
        label: '示例组 A',
        volumes: [
            {
                name: '母分卷 1',
                children: [
                    { type: 'article', title: '文章 1-1', file: 'assets/pages/page1.html', openMode: 'embed' },
                    { type: 'subvolume', name: '子分卷 1-1', children: [
                        { type: 'article', title: '文章 1-1-1', file: 'assets/pages/page3.html', openMode: 'embed' }
                    ]},
                    { type: 'article', title: '文章 1-2', file: 'assets/pages/page2.html', openMode: 'blank' },
                    { type: 'subvolume', name: '子分卷 1-2', children: [
                        { type: 'article', title: '文章 1-2-1', file: 'assets/pages/page4.html', openMode: 'blank' }
                    ]}
                ]
            },
            {
                name: '母分卷 2',
                children: [
                    { type: 'subvolume', name: '子分卷 2-1', children: [
                        { type: 'article', title: '文章 2-1-1', file: 'assets/pages/page6.html', openMode: 'embed' }
                    ]},
                    { type: 'article', title: '文章 2-1', file: 'assets/pages/page5.html', openMode: 'embed' }
                ]
            }
        ]
    },
    'groupB': {
        label: '示例组 B',
        volumes: [
            {
                name: '母分卷 3',
                children: [
                    { type: 'article', title: '文章 3-1', file: 'assets/pages/page7.html', openMode: 'blank' },
                    { type: 'subvolume', name: '子分卷 3-1', children: [
                        { type: 'article', title: '文章 3-1-1', file: 'assets/pages/page8.html', openMode: 'embed' }
                    ]}
                ]
            }
        ]
    }
};

const DEFAULT_GROUP = 'groupA';