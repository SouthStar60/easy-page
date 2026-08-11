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

    // 统一渲染
    function renderNode(item, level = 0) {
        let html = '';
        const isVolume = item.hasOwnProperty('children') || item.hasOwnProperty('subvolumes') || item.hasOwnProperty('articles');
        const nodeType = isVolume ? 'volume' : 'subvolume';
        const iconType = isVolume ? 'volume' : 'subvolume';
        const label = item.name;

        html += `<li class="${nodeType}" data-level="${level}">`;
        html += `<a class="toggle" data-toggle="true">`;
        html += `<span>${getIconSVG(iconType, true)}</span> ${label}`;
        html += `</a>`;
        html += `<ul class="children">`;

        let children = item.children || [];
        if (children.length === 0) {
            if (item.articles) {
                children = children.concat(item.articles.map(a => ({ type: 'article', ...a })));
            }
            if (item.subvolumes) {
                children = children.concat(item.subvolumes.map(s => ({ type: 'subvolume', ...s })));
            }
        }

        for (let child of children) {
            if (child.type === 'article') {
                const mode = child.openMode || 'embed';
                html += `<li class="article" data-level="${level + 1}">`;
                html += `<a data-file="${child.file}" data-openmode="${mode}">`;
                html += `<span>${getIconSVG('article')}</span> ${child.title}`;
                html += `</a>`;
                html += `</li>`;
            } else if (child.type === 'subvolume') {
                html += renderNode(child, level + 1);
            } else {
                if (child.articles || child.subvolumes) {
                    html += renderNode(child, level + 1);
                } else {
                    const mode = child.openMode || 'embed';
                    html += `<li class="article" data-level="${level + 1}">`;
                    html += `<a data-file="${child.file}" data-openmode="${mode}">`;
                    html += `<span>${getIconSVG('article')}</span> ${child.title}`;
                    html += `</a>`;
                    html += `</li>`;
                }
            }
        }

        html += `</ul>`;
        html += `</li>`;
        return html;
    }

    // 获取第一篇文章
    function getFirstArticle(groupKey) {
        const group = DOC_DATA[groupKey];
        if (!group) return null;
        for (let vol of group.volumes) {
            let children = vol.children || [];
            if (children.length === 0) {
                if (vol.articles) {
                    children = children.concat(vol.articles.map(a => ({ type: 'article', ...a })));
                }
                if (vol.subvolumes) {
                    children = children.concat(vol.subvolumes.map(s => ({ type: 'subvolume', ...s })));
                }
            }
            for (let child of children) {
                if (child.type === 'article') {
                    return child;
                } else if (child.type === 'subvolume') {
                    if (child.articles && child.articles.length > 0) {
                        return child.articles[0];
                    }
                    let subChildren = child.children || [];
                    for (let subChild of subChildren) {
                        if (subChild.type === 'article') {
                            return subChild;
                        }
                    }
                }
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

        // 应用搜索过滤
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            filterArticles(searchInput.value.trim());
        }
    }

    // 加载文章
    function loadArticle(filePath, openMode = 'embed') {
        if (openMode === 'blank') {
            window.open(filePath, '_blank');
            // 更新面包屑
            updateBreadcrumb(filePath);
            return;
        }

        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            contentArea.innerHTML = `
                <iframe src="${filePath}" 
                        style="width:100%; height:100%; border:none; background:#fff; min-height: 80vh;">
                </iframe>
            `;
            // 更新面包屑
            updateBreadcrumb(filePath);
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
                // 更新面包屑
                updateBreadcrumb(filePath);
            })
            .catch(err => {
                contentArea.innerHTML = `<div class="article-page"><p style="color:#ff6b6b;">加载失败: ${err.message}</p></div>`;
                // 更新面包屑
                updateBreadcrumb(filePath);
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

    // 搜索功能
    function filterArticles(query) {
        const articles = drawerNav.querySelectorAll('.article');
        // 先隐藏所有分卷
        const allVolumes = drawerNav.querySelectorAll('.volume, .subvolume');
        allVolumes.forEach(v => v.style.display = 'none');

        if (!query) {
            // 无搜索词，恢复所有显示
            allVolumes.forEach(v => v.style.display = '');
            articles.forEach(art => art.style.display = '');
            return;
        }
        const lowerQuery = query.toLowerCase();
        articles.forEach(art => {
            const link = art.querySelector('a[data-file]');
            if (!link) return;
            const title = link.textContent.trim().toLowerCase();
            const match = title.includes(lowerQuery);
            art.style.display = match ? '' : 'none';
            if (match) {
                let parent = art.closest('li.volume, li.subvolume');
                while (parent) {
                    parent.style.display = '';
                    parent = parent.parentElement?.closest('li.volume, li.subvolume');
                }
            }
        });
    }

    function bindSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        if (!searchInput) return;

        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        const newClear = searchClear.cloneNode(true);
        searchClear.parentNode.replaceChild(newClear, searchClear);

        newInput.addEventListener('input', function() {
            const query = this.value.trim();
            filterArticles(query);
            newClear.classList.toggle('visible', query.length > 0);
        });

        newClear.addEventListener('click', function() {
            newInput.value = '';
            filterArticles('');
            newClear.classList.remove('visible');
            newInput.focus();
        });

        newInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterArticles('');
                newClear.classList.remove('visible');
                this.blur();
            }
        });
    }

    // 获取文章路径
    function getArticlePath(groupKey, filePath) {
        const group = DOC_DATA[groupKey];
        if (!group) return null;
        for (let vol of group.volumes) {
            // 先检查直接文章
            if (vol.articles) {
                for (let art of vol.articles) {
                    if (art.file === filePath) {
                        return { volume: vol.name, subvolume: null, title: art.title };
                    }
                }
            }
            // 检查子分卷
            if (vol.subvolumes) {
                for (let sub of vol.subvolumes) {
                    if (sub.articles) {
                        for (let art of sub.articles) {
                            if (art.file === filePath) {
                                return { volume: vol.name, subvolume: sub.name, title: art.title };
                            }
                        }
                    }
                    if (sub.children) {
                        for (let child of sub.children) {
                            if (child.type === 'article' && child.file === filePath) {
                                return { volume: vol.name, subvolume: sub.name, title: child.title };
                            }
                        }
                    }
                }
            }
            // 检查 children
            if (vol.children) {
                for (let child of vol.children) {
                    if (child.type === 'article' && child.file === filePath) {
                        return { volume: vol.name, subvolume: null, title: child.title };
                    }
                    if (child.type === 'subvolume') {
                        if (child.children) {
                            for (let subChild of child.children) {
                                if (subChild.type === 'article' && subChild.file === filePath) {
                                    return { volume: vol.name, subvolume: child.name, title: subChild.title };
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    function updateBreadcrumb(filePath) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;
        const path = getArticlePath(currentGroup, filePath);
        if (path) {
            let text = '';
            if (path.subvolume) {
                text = `${path.volume} / ${path.subvolume} / ${path.title}`;
            } else {
                text = `${path.volume} / ${path.title}`;
            }
            breadcrumb.textContent = text;
        } else {
            breadcrumb.textContent = '';
        }
    }

    function handleUrlHash() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#') && hash.length > 1) {
            const parts = hash.substring(1).split('/');
            if (parts.length >= 2) {
                const groupKey = parts[0];
                const filePath = decodeURIComponent(parts.slice(1).join('/'));
                // 检查分组是否存在
                if (DOC_DATA[groupKey]) {
                    // 设置当前分组
                    currentGroup = groupKey;
                    // 先渲染目录树，确保 DOM 中有对应文章节点
                    renderDrawer(currentGroup);
                    // 加载文章
                    loadArticle(filePath);
                    // 高亮对应的文章
                    setTimeout(() => {
                        const allArticles = drawerNav.querySelectorAll('.article > a[data-file]');
                        for (let link of allArticles) {
                            if (link.dataset.file === filePath) {
                                drawerNav.querySelectorAll('.article').forEach(li => li.classList.remove('active'));
                                link.closest('.article')?.classList.add('active');
                                break;
                            }
                        }
                    }, 50);
                    // 更新组菜单高亮
                    renderGroupMenu();
                    // 关闭抽屉
                    closeDrawer();
                    return true; // 表示已处理跳转
                }
            }
        }
        return false; // 未处理跳转
    }

    // 初始化
    function init() {
        // 先尝试处理 URL 跳转
        if (handleUrlHash()) {
            // 如果跳转成功，直接返回，不执行后续默认加载
            return;
        }

        renderGroupMenu();
        renderDrawer(currentGroup);
        loadFirstArticle();
        closeDrawer();
        bindSearchEvents();
    }

    init();

    window.loadArticle = loadArticle;
})();