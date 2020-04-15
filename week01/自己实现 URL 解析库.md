# 自己实现 URL 解析库
```javascript
export default class {
    constructor(url) {
        this.url = url;
        this.href = url;
        this.origin = this.getOrigin();
        this.protocol = this.getProtocol();
        this.host = this.getHost();
        this.hostName = this.getHostName();
        this.port = this.getPort();
        this.pathName = this.getPathName();
        this.searchObj = this.getSearch();
        this.hash = this.getHash();
    }
    getOrigin() {
        const res = this.url.match(/^[\w\W]+?(?=\b\/{1})/g);
        return res && res.length ? res[0] : null;
    }
    getProtocol() {
        const res = this.url.match(/^[\w\W]+?\:(?=\/{2})/g);
        return res && res.length ? res[0] : null;
    }
    getHost() {
        const res = this.url.match(/(?<=\/{2})[\w\W]+?(?=\b\/{1})/g);
        return res && res.length ? res[0] : null;
    }
    getHostName() {
        const res = this.host.match(/[\w\W]+(?=\:[\d]+$)/g);
        return res && res.length ? res[0] : null;
    }
    getPort() {
        const res = this.host.match(/(?<=\:)\d+$/g);
        return res && res.length ? res[0] : null;
    }
    getPathName() {
        const res = this.url.match(/\b\/[\w\W]+(?=\?)/g);
        return res && res.length ? res[0] : null;
    }
    getSearch() {
        const res = this.url.match(/(?<=\?)[\w\W]+(?=#)/g);

        let obj = {};
        if (res && res.length) {
            let str = res[0];
            str.split('&').forEach(x => {
                const tempArr = x.split('=');
                obj[tempArr[0]] = tempArr[1];
            });
        }
        return obj;
    }
    getHash() {
        const res = this.url.match(/\#[\w\W]+$/g);
        return res && res.length ? res[0] : null;
    }
}
```