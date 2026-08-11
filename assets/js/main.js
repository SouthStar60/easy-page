(function() {
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerCloseBtn');
    const overlay = document.getElementById('overlay');
    const drawerNav = document.getElementById('drawerNav');
    const groupSwitcher = document.getElementById('groupSwitcherBtn');
    const groupMenu = document.getElementById('groupMenu');
    const groupMenuList = document.getElementById('groupMenuList');
    const contentArea = document.getElementById('contentArea');

    let currentGroup = DEFAULT_GROUP;
    let isDrawerOpen = false;

    // 代码高亮实现
    function highlightCodeBlocks() {
        const blocks = document.querySelectorAll('pre code');
        blocks.forEach(block => {
            const lang = block.className.replace('language-', '').trim() || 'text';
            const code = block.textContent;
            const highlighted = highlightByLanguage(code, lang);
            block.innerHTML = highlighted;
            block.className = `language-${lang}`;
        });
    }

    function highlightByLanguage(code, lang) {
        const keywords = getKeywords(lang);
        let escaped = escapeHtml(code);
        const sorted = Object.keys(keywords).sort((a, b) => b.length - a.length);
        for (let kw of sorted) {
            const pattern = new RegExp('\\b' + kw + '\\b', 'g');
            const className = keywords[kw];
            escaped = escaped.replace(pattern, `<span class="hljs-${className}">$&</span>`);
        }
        if (['javascript', 'java', 'c', 'cpp', 'php', 'css', 'html'].includes(lang)) {
            escaped = escaped.replace(/\/\/.*/g, match => `<span class="hljs-comment">${match}</span>`);
            escaped = escaped.replace(/\/\*[\s\S]*?\*\//g, match => `<span class="hljs-comment">${match}</span>`);
        }
        if (['python'].includes(lang)) {
            escaped = escaped.replace(/#.*/g, match => `<span class="hljs-comment">${match}</span>`);
        }
        escaped = escaped.replace(/(["'])(?:(?!\1).)*?\1/g, match => `<span class="hljs-string">${match}</span>`);
        escaped = escaped.replace(/\b\d+(\.\d+)?\b/g, match => `<span class="hljs-number">${match}</span>`);
        return escaped;
    }

    function getKeywords(lang) {
        const common = {
            'function': 'keyword', 'return': 'keyword', 'if': 'keyword', 'else': 'keyword',
            'for': 'keyword', 'while': 'keyword', 'do': 'keyword', 'switch': 'keyword',
            'case': 'keyword', 'break': 'keyword', 'continue': 'keyword', 'default': 'keyword',
            'try': 'keyword', 'catch': 'keyword', 'finally': 'keyword', 'throw': 'keyword',
            'new': 'keyword', 'this': 'keyword', 'typeof': 'keyword', 'instanceof': 'keyword',
            'void': 'keyword', 'delete': 'keyword', 'in': 'keyword', 'of': 'keyword',
            'class': 'keyword', 'extends': 'keyword', 'super': 'keyword', 'import': 'keyword',
            'export': 'keyword', 'const': 'keyword', 'let': 'keyword', 'var': 'keyword',
            'true': 'literal', 'false': 'literal', 'null': 'literal', 'undefined': 'literal'
        };
        const python = {
            'def': 'keyword', 'with': 'keyword', 'as': 'keyword', 'pass': 'keyword',
            'lambda': 'keyword', 'yield': 'keyword', 'from': 'keyword', 'import': 'keyword',
            'print': 'builtin', 'len': 'builtin', 'range': 'builtin', 'type': 'builtin',
            'True': 'literal', 'False': 'literal', 'None': 'literal', 'and': 'keyword',
            'or': 'keyword', 'not': 'keyword', 'is': 'keyword', 'in': 'keyword'
        };
        const html = {
            'html': 'tag', 'head': 'tag', 'body': 'tag', 'div': 'tag', 'span': 'tag',
            'p': 'tag', 'a': 'tag', 'img': 'tag', 'br': 'tag', 'hr': 'tag', 'h1': 'tag',
            'h2': 'tag', 'h3': 'tag', 'table': 'tag', 'tr': 'tag', 'td': 'tag',
            'ul': 'tag', 'ol': 'tag', 'li': 'tag', 'class': 'attr', 'id': 'attr',
            'src': 'attr', 'href': 'attr', 'style': 'attr', 'title': 'attr'
        };
        const css = {
            'color': 'property', 'font': 'property', 'background': 'property',
            'margin': 'property', 'padding': 'property', 'border': 'property',
            'width': 'property', 'height': 'property', 'display': 'property',
            'flex': 'property', 'grid': 'property', 'position': 'property',
            'top': 'property', 'left': 'property', 'right': 'property',
            'bottom': 'property', 'z-index': 'property', 'opacity': 'property'
        };
        const bash = {
            'echo': 'builtin', 'if': 'keyword', 'then': 'keyword', 'else': 'keyword',
            'fi': 'keyword', 'for': 'keyword', 'do': 'keyword', 'done': 'keyword',
            'while': 'keyword', 'until': 'keyword', 'case': 'keyword', 'esac': 'keyword',
            'function': 'keyword', 'return': 'keyword', 'exit': 'builtin'
        };
        const json = {
            'true': 'literal', 'false': 'literal', 'null': 'literal'
        };
        switch(lang) {
            case 'javascript': return {...common, ...{ 'console': 'builtin', 'log': 'builtin' }};
            case 'python': return {...common, ...python};
            case 'html': return {...common, ...html};
            case 'css': return {...common, ...css};
            case 'bash': return {...common, ...bash};
            case 'json': return {...common, ...json};
            default: return common;
        }
    }

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // SVG 图标
    function getIconSVG(type, isOpen = true) {
        const color = '#5b9aff';
        if (type === 'volume') {
            return `<svg class="folder-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${color}" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                ${isOpen ? '<polyline points="9 14 12 11 15 14"/>' : '<polyline points="9 11 12 14 15 11"/>'}
            </svg>`;
        } else if (type === 'subvolume') {
            return `<svg class="folder-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8ab4ff" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                ${isOpen ? '<polyline points="9 14 12 11 15 14"/>' : '<polyline points="9 11 12 14 15 11"/>'}
            </svg>`;
        } else {
            return `<svg class="file-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a0b0c0" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>`;
        }
    }

    // 递归渲染节点
    function renderNode(item, level = 0) {
        let html = '';
        const isVolume = item.hasOwnProperty('subvolumes') || item.hasOwnProperty('articles');
        const nodeType = isVolume ? 'volume' : 'subvolume';
        const iconType = isVolume ? 'volume' : 'subvolume';
        const label = item.name;

        html += `<li class="${nodeType}" data-level="${level}">`;
        html += `<a class="toggle" data-toggle="true">`;
        html += `<span>${getIconSVG(iconType, true)}</span> ${label}`;
        html += `</a>`;
        html += `<ul class="children">`;

        if (item.subvolumes && item.subvolumes.length) {
            item.subvolumes.forEach(sub => {
                html += renderNode(sub, level + 1);
            });
        }
        if (item.articles && item.articles.length) {
            item.articles.forEach(art => {
                const mode = art.openMode || 'embed';
                html += `<li class="article" data-level="${level + 1}">`;
                html += `<a data-file="${art.file}" data-openmode="${mode}">`;
                html += `<span>${getIconSVG('article')}</span> ${art.title}`;
                html += `</a>`;
                html += `</li>`;
            });
        }

        html += `</ul>`;
        html += `</li>`;
        return html;
    }

    // 获取当前分组的第一篇文章
    function getFirstArticle(groupKey) {
        const group = DOC_DATA[groupKey];
        if (!group) return null;
        for (let vol of group.volumes) {
            // 先检查子分卷
            if (vol.subvolumes) {
                for (let sub of vol.subvolumes) {
                    if (sub.articles && sub.articles.length > 0) {
                        return sub.articles[0];
                    }
                }
            }
            // 再检查母分卷直接文章
            if (vol.articles && vol.articles.length > 0) {
                return vol.articles[0];
            }
        }
        return null;
    }

    // 加载第一篇文章
    function loadFirstArticle() {
        const first = getFirstArticle(currentGroup);
        if (first) {
            loadArticle(first.file, first.openMode || 'embed');
            setTimeout(() => {
                const allArticles = drawerNav.querySelectorAll('.article > a[data-file]');
                for (let link of allArticles) {
                    if (link.dataset.file === first.file) {
                        drawerNav.querySelectorAll('.article').forEach(li => li.classList.remove('active'));
                        link.closest('.article')?.classList.add('active');
                        break;
                    }
                }
            }, 50);
        } else {
            contentArea.innerHTML = `<div class="content-placeholder"><p>该分组暂无文章</p></div>`;
        }
    }

    // 渲染目录树
    function renderDrawer(groupKey) {
        const group = DOC_DATA[groupKey];
        if (!group) return;

        let html = '<ul class="drawer-root">';
        group.volumes.forEach(vol => {
            html += renderNode(vol, 0);
        });
        html += '</ul>';
        drawerNav.innerHTML = html;

        // 折叠事件
        drawerNav.querySelectorAll('.toggle[data-toggle="true"]').forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const parentLi = this.closest('li');
                if (!parentLi) return;
                const childUl = parentLi.querySelector('ul.children');
                if (!childUl) return;

                const isCollapsed = childUl.classList.toggle('collapsed');
                const iconSpan = this.querySelector('span');
                if (iconSpan) {
                    const svg = iconSpan.querySelector('svg');
                    if (svg) {
                        const polyline = svg.querySelector('polyline');
                        if (polyline) {
                            polyline.setAttribute('points', isCollapsed ? '9 11 12 14 15 11' : '9 14 12 11 15 14');
                        }
                    }
                }
            });
        });

        // 文章点击事件
        drawerNav.querySelectorAll('.article > a[data-file]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const file = this.dataset.file;
                const mode = this.dataset.openmode || 'embed';
                if (file) {
                    loadArticle(file, mode);
                    drawerNav.querySelectorAll('.article').forEach(li => li.classList.remove('active'));
                    this.closest('.article')?.classList.add('active');
                    closeDrawer();
                }
            });
        });
    }

    // 加载文章
    function loadArticle(filePath, openMode = 'embed') {
        if (openMode === 'blank') {
            window.open(filePath, '_blank');
            return;
        }

        // embed 模式
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            contentArea.innerHTML = `
                <iframe src="${filePath}" 
                        style="width:100%; height:100%; border:none; background:#fff; min-height: 80vh;">
                </iframe>
            `;
            return;
        }

        fetch(filePath)
            .then(res => {
                if (!res.ok) throw new Error('文章加载失败');
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                contentArea.innerHTML = doc.body.innerHTML;
                highlightCodeBlocks();
                if (typeof window.initArticle === 'function') {
                    window.initArticle();
                }
            })
            .catch(err => {
                contentArea.innerHTML = `<div class="article-page"><p style="color:#ff6b6b;">加载失败: ${err.message}</p></div>`;
            });
    }

    // 抽屉控制
    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        isDrawerOpen = true;
    }
    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        isDrawerOpen = false;
    }
    function toggleDrawer() {
        isDrawerOpen ? closeDrawer() : openDrawer();
    }

    hamburger.addEventListener('click', toggleDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // 组切换菜单
    function renderGroupMenu() {
        const groups = Object.keys(DOC_DATA);
        let html = '';
        groups.forEach(key => {
            const label = DOC_DATA[key].label;
            const active = (key === currentGroup) ? 'active-group' : '';
            html += `<li class="${active}" data-group="${key}">${label}</li>`;
        });
        groupMenuList.innerHTML = html;
        groupMenuList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', function() {
                const group = this.dataset.group;
                if (group && group !== currentGroup) {
                    currentGroup = group;
                    renderDrawer(group);
                    groupMenu.classList.remove('open');
                    renderGroupMenu();
                    loadFirstArticle();
                } else {
                    groupMenu.classList.remove('open');
                }
            });
        });
    }

    groupSwitcher.addEventListener('click', function(e) {
        e.stopPropagation();
        groupMenu.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
        if (!groupMenu.contains(e.target) && e.target !== groupSwitcher) {
            groupMenu.classList.remove('open');
        }
    });

    // 初始化
    function init() {
        renderGroupMenu();
        renderDrawer(currentGroup);
        loadFirstArticle();
        closeDrawer();
    }

    init();

    window.loadArticle = loadArticle;
})();