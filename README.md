# Easy page(简页)

简单的web网页，用于快速构建站点。

# 使用方法

一般不需要修改过多内容，直接修改`assets/js/data.js`以添加文章或网页。

## data.js格式

格式：
```javascript
const DOC_DATA = {    //存储数据
    '组': {
        label: '组在“::”菜单显示的名称',
        volumes: [
            {
                name: '母分卷名',
                children: [
                    {
                        type: 'article',    //类型，article为文章，subvolume为子分卷
                        title: '文章标题',
                        file: '文章所在位置',
                    },
                    {
                        type: 'subvolume',
                        name: '子分卷名',
                        children: [
                        { 
                            type: 'article', 
                            title: '文章标题', 
                            file: '文章所在位置',
                            openMode: 'embed'    //打开模式embed为嵌入，blank为新标签页打开，需要注意，blank需要自己手动在文章中添加样式。
                        }
                        ]
                    }
                ]
            }
        ]
    }
}

const DEFAULT_GROUP = '组';    //默认打开的组。
```

简单示例:
```javascript
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
```

## URL 跳转

启动时就打开某个文章

格式：#组名/文章文件路径

示例：
```url
http://localhost:5500/index.html#groupA/page1.html
```

