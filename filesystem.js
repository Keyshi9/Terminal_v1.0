// Virtual File System
const FileSystem = {
    currentPath: '/home/user',

    init() {
        const saved = localStorage.getItem('pro-terminal-fs');
        if (saved) {
            this.structure = JSON.parse(saved);
        } else {
            this.structure = {
                '/': {
                    type: 'dir',
                    children: {
                        'home': {
                            type: 'dir',
                            children: {
                                'user': {
                                    type: 'dir',
                                    children: {
                                        'documents': { type: 'dir', children: {} },
                                        'downloads': { type: 'dir', children: {} },
                                        'projects': { type: 'dir', children: {} },
                                        'welcome.txt': { type: 'file', content: 'Welcome to Dev Terminal System!\nType "help" to get started.' }
                                    }
                                }
                            }
                        },
                        'etc': { type: 'dir', children: {} },
                        'var': { type: 'dir', children: {} }
                    }
                }
            };
            this.save();
        }
    },

    save() {
        localStorage.setItem('pro-terminal-fs', JSON.stringify(this.structure));
    },

    getNode(path) {
        if (path === '/') return this.structure['/'];

        const parts = path.split('/').filter(p => p);
        let current = this.structure['/'];

        for (const part of parts) {
            if (!current.children || !current.children[part]) return null;
            current = current.children[part];
        }
        return current;
    },

    resolvePath(path) {
        let parts;
        if (path.startsWith('/')) {
            parts = path.split('/').filter(p => p);
        } else {
            const currentParts = this.currentPath.split('/').filter(p => p);
            const newParts = path.split('/').filter(p => p);
            parts = [...currentParts, ...newParts];
        }

        const resolvedParts = [];
        for (const part of parts) {
            if (part === '..') {
                resolvedParts.pop();
            } else if (part !== '.') {
                resolvedParts.push(part);
            }
        }

        return '/' + resolvedParts.join('/');
    },

    ls(path = '.') {
        const fullPath = this.resolvePath(path);
        const node = this.getNode(fullPath);

        if (!node) return { error: 'Path not found' };
        if (node.type !== 'dir') return { error: 'Not a directory' };

        return Object.keys(node.children || {}).map(name => {
            const child = node.children[name];
            return {
                name,
                type: child.type,
                isDir: child.type === 'dir'
            };
        });
    },

    cd(path) {
        const fullPath = this.resolvePath(path);
        const node = this.getNode(fullPath);

        if (!node) return { error: 'Directory not found' };
        if (node.type !== 'dir') return { error: 'Not a directory' };

        this.currentPath = fullPath || '/';
        return { success: true, path: this.currentPath };
    },

    mkdir(name) {
        const node = this.getNode(this.currentPath);
        if (!node || node.type !== 'dir') return { error: 'Invalid current directory' };
        if (node.children[name]) return { error: 'Already exists' };

        node.children[name] = { type: 'dir', children: {} };
        this.save();
        return { success: true };
    },

    touch(name) {
        const node = this.getNode(this.currentPath);
        if (!node || node.type !== 'dir') return { error: 'Invalid current directory' };
        if (node.children[name]) return { error: 'Already exists' };

        node.children[name] = { type: 'file', content: '' };
        this.save();
        return { success: true };
    },

    cat(name) {
        const fullPath = this.resolvePath(name);
        const node = this.getNode(fullPath);

        if (!node) return { error: 'File not found' };
        if (node.type !== 'file') return { error: 'Not a file' };

        return { content: node.content || '' };
    },

    echo(content, filename) {
        const node = this.getNode(this.currentPath);
        if (!node || node.type !== 'dir') return { error: 'Invalid current directory' };

        if (!node.children[filename]) {
            node.children[filename] = { type: 'file', content: '' };
        }

        if (node.children[filename].type !== 'file') {
            return { error: 'Not a file' };
        }

        node.children[filename].content = content;
        this.save();
        return { success: true };
    },

    rm(name) {
        const node = this.getNode(this.currentPath);
        if (!node || node.type !== 'dir') return { error: 'Invalid current directory' };
        if (!node.children[name]) return { error: 'Not found' };

        delete node.children[name];
        this.save();
        return { success: true };
    },

    pwd() {
        return this.currentPath;
    }
};
