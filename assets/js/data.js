// 数据 —— 纯结构占位，不含实际内容，仅展示层级与打开模式
const DOC_DATA = {
    // 第一组
    'groupA': {
        label: '示例组 A',
        volumes: [
            {
                name: '母分卷 1',
                articles: [
                    { title: '文章 1-1', file: 'assets/pages/page1.html', openMode: 'embed' },
                    { title: '文章 1-2', file: 'assets/pages/page2.html', openMode: 'blank' }
                ],
                subvolumes: [
                    {
                        name: '子分卷 1-1',
                        articles: [
                            { title: '文章 1-1-1', file: 'assets/pages/page3.html', openMode: 'embed' }
                        ]
                    },
                    {
                        name: '子分卷 1-2',
                        articles: [
                            { title: '文章 1-2-1', file: 'assets/pages/page4.html', openMode: 'blank' }
                        ]
                    }
                ]
            },
            {
                name: '母分卷 2',
                articles: [
                    { title: '文章 2-1', file: 'assets/pages/page5.html', openMode: 'embed' }
                ],
                subvolumes: [
                    {
                        name: '子分卷 2-1',
                        articles: [
                            { title: '文章 2-1-1', file: 'assets/pages/page6.html', openMode: 'embed' }
                        ]
                    }
                ]
            }
        ]
    },
    // 第二组
    'groupB': {
        label: '示例组 B',
        volumes: [
            {
                name: '母分卷 3',
                articles: [
                    { title: '文章 3-1', file: 'assets/pages/page7.html', openMode: 'blank' }
                ],
                subvolumes: [
                    {
                        name: '子分卷 3-1',
                        articles: [
                            { title: '文章 3-1-1', file: 'assets/pages/page8.html', openMode: 'embed' }
                        ]
                    }
                ]
            }
        ]
    }
};

// 默认激活的组
const DEFAULT_GROUP = 'groupA';