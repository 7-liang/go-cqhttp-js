import { faceMap, imageEffect, imageSubType, giftMap } from './utils/misc'


class CQType {
    public type: string
    public data: any
    constructor(opts: { type: string }) {
        this.type = opts.type
    }

    stringify () {
        let cq_code = `[CQ:${this.type}`        
        for (let key in this.data) {
            if (this.data.hasOwnProperty(key) && this.data[key]) 
                cq_code += `,${key}=${this.data[key]}`
        }
        cq_code += ']'
        return cq_code
    }
}

class Text extends CQType {
    public data: { text: string }
    constructor (opts: { text: string }) {
        super({ type: 'text' })
        this.data = { text: opts.text }
    }

    stringify () {
        return this.data.text
    }
}

class Record extends CQType {
    public data: { file: string, magic: number, url: string, cache: number, proxy: number, timeout: number }
    constructor (opts: {
        file: string, magic?: number, url?: string,
        cache?: number, proxy?: number, timeout?: number
    }) {
        super({ type: 'record' })
        this.data = {
            file: opts.file, magic: opts.magic, url: opts.url,
            cache: opts.cache, proxy: opts.proxy, timeout: opts.timeout
        }
    }
}

class Face extends CQType {
    public data: { id: number, name: string }
    constructor (opts: { id: number, name?: string}) {
        super({ type: 'face' })
        this.data = { id: opts.id, name: opts.name }
    }

    stringify() {
        return `[CQ:face,id=${this.data.id}]`
    }
}

class Video extends CQType {
    public data: {
        file: string
        cover: string
        c: number
    }
    constructor (opts: {
        file: string
        cover?: string
        c?: number
    }) {
        super({ type: 'video' })
        this.data = {
            file: opts.file,
            cover: opts.cover,
            c: opts.c
        }
    }
}

class At extends CQType {
    public data: { qq: number | string, name: string }
    constructor (opts: { qq: number | 'all', name?: string }) {
        super({ type: 'at' })
        this.data = { qq: opts.qq, name: opts.name }
    }
}

class Share extends CQType {
    public data: { url: string, title: string, content: string, image: string }
    constructor (opts: { url: string, title: string, content?: string, image?: string }) {
        super({ type: 'share' })
        this.data = { url: opts.url, title: opts.title, content: opts.content, image: opts.image }
    }
}

class Music extends CQType {
    public data: { type: string, id: number, url: string, audio: string, title: string, content: string, image: string }
    constructor (opts: {
        type: 'qq' | '163' | 'xm' | 'custom',
        id?: number, url?: string, audio?: string,
        title?: string, content?: string, image?: string
    }) {
        super({ type: 'music' })
        this.data = {
            type: opts.type, id: opts.id, url: opts.url, audio: opts.audio,
            title: opts.title, content: opts.content, image: opts.image
        }
    }
}

class Image extends CQType {
    public data: { file: string, type: string, subType: string, url: string, cache: number, id: number, c: number }
    constructor (opts: {
        file: string, type: 'flash' | 'show', subType?: string,
        url?: string, cache?: 0 | 1, id?: number, c?: number
    }) {
        super({ type: 'image' })
        this.data = {
            file: opts.file, type: opts.type, subType: opts.subType,
            url: opts.url, cache: opts.cache, id: opts.id, c: opts.c
        }
    }
}

class Reply extends CQType {
    public data: { id: number, text: string, qq: number, time: number, seq: number }
    constructor (opts: { id?: number, text?: string, qq?: number, time?: number, seq?: number }) {
        super({ type: 'reply' })
        this.data = { id: opts.id, text: opts.text, qq: opts.qq, time: opts.time, seq: opts.seq }
    }
}

class Redbag extends CQType {
    public data: { title: string }
    constructor (opts: { title: string }) {
        super({ type: 'redbag' })
        this.data = { title: opts.title }
    }
}

class Poke extends CQType {
    public data: { qq: number }
    constructor (opts: { qq: number }) {
        super({ type: 'poke' })
        this.data = { qq: opts.qq }
    }
}

class Gift extends CQType {
    public data: { qq: number, id: number }
    constructor (opts: { qq: number, id: number }) {
        super({ type: 'gift' })
        this.data = { qq: opts.qq, id: opts.id }
    }
}

class Xml extends CQType {
    public data: { data: string, resid: number }
    constructor (opts: { data: string, resid?: number }) {
        super({ type: 'xml' })
        this.data = { data: opts.data, resid: opts.resid }
    }
}

class Json extends CQType {
    public data: { data: string, resid: number }
    constructor (opts: { data: string, resid?: number }) {
        super({ type: 'json' })
        this.data = { data: opts.data, resid: opts.resid }
    }
}

class Tts extends CQType {
    public data: { text: string }
    constructor (opts: { text: string }) {
        super({ type: 'tts' })
        this.data = { text: opts.text }
    }
}




export default class Message {
    public cq_code: string
    public message_chain: CQType[]

    constructor () {
        this.cq_code = ''
        this.message_chain = []
    }

    // 文本消息
    addText (text: string) {
        if (!text) return this
        const msg = new Text({ text })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // QQ 表情
    addFace (opts: { id?: number, name?: string }) {
        let { id, name } = opts
        if (!id && !name) return this
        if (!id) id = faceMap.get(name)
        if (!name) {
            for (let face of faceMap) {
                if (face[1] == id) {
                    name = face[0]
                    break
                }
            }
        }
        const msg = new Face({ id, name })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 语音
    addRecord (opts: { file: string, magic?: 0 | 1, url?: string, cache?: 0 | 1, proxy?: 0 |1, timeout?: number }) {
        if (!opts.file) return this
        const msg = new Record({
            file: opts.file, magic: opts.magic, cache: opts.cache,
            proxy: opts.proxy, timeout: opts.timeout, url: opts.url
        })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 短视频
    addVideo (opts: { file: string, cover?: string, c?: 2 | 3 }) {
        if (!opts.file) return this
        const msg = new Video({ file: opts.file, cover: opts.cover, c: opts.c })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // At
    addAt (qq: number | 'all') {
        if (!qq) return this
        const msg = new At({ qq })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }


    // 链接分享
    addShare (opts: { url: string, title: string, content?: string, image?: string }) {
        const { url, title, content, image } = opts
        if (!url || !title) return this
        const msg = new Share({ url, title, content, image })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 音乐分享
    addMusic (opts: {
        type: 'qq' | '163' | 'xm' | 'custom', id?: number, audio?: string,
        title?: string, content?: string, image?: string, url?: string
    }) {
        const { type, id, url, audio, title, content, image } = opts
        if (!type) return this

        let msg: Music
        if (type == 'qq' || type == '163' || type == 'xm') {
            if (!id) return this
            msg = new Music({ type, id })
        } else {
            if (!url || !audio || !title) return this
            msg = new Music({ type, url, audio, title, content, image })
        }

        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }


    // 图片
    addImage (opts: {
        file: string, type: 'flash' | 'show', subType?: string, url?: string,
        cache?: 0 | 1, id?: number, c?: 2 | 3
    }) {
        let { file, type, subType, url, cache, id, c } = opts
        if (!file) return this
        // if (!id || id < 40000 || id > 40005) id = 40000
        const msg = new Image({ file, type, subType, url, cache, id, c })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 回复
    addReply (opts: { id?: number, text?: string, qq?: number, time?: number, seq?: number }) {
        const { id, text, qq, time, seq } = opts
        if (!id && !text) return this
        let msg: Reply
        if (id) {
            msg = new Reply({ id })
        } else {
            if (!qq) return this
            msg = new Reply({ text, qq, time, seq })
        }
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 戳一戳
    addPoke (qq: number) {
        // this.message += `[CQ:poke,qq=${qq}]`
        if (!qq) return this
        const msg = new Poke({ qq })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 礼物
    addGift (opts: { qq: number, id?: number, name?: string }) {
        const { qq, id, name } = opts
        if (!qq) return this
        if (!id && !name) return this
        let msg: Gift
        if (id) msg = new Gift({ qq, id })
        else msg = new Gift({ qq, id: giftMap.get(name) })
        this.message_chain.push(msg)
        this.cq_code += msg.stringify()
        return this
    }

    // 将消息解构为 消息链对象
    parse (message: string) {
        if (!message || !message.length) return this.message_chain

        // 分割字符串为数组
        message.replace(/\[/g, '&&').replace(/\]/g, '&&').split('&&').forEach(item => {
            // 只处理不为空的项
            if (item) {
                // 替换转义符
                item = item.replace(/&amp;/g, '&').replace(/&#91;/g, '[').replace(/&#93;/g, ']')
                // 正则判断是不是 text 类型消息
                let match = item.match(/^CQ:/)
                // 没有 CQ:，代表为 text 类型
                if (!match) {
                    if (item.replace(/\s/g, '') != '') this.addText(item)
                } else {
                    let tmp = item.split(',')
                    let type = tmp[0].match(/^CQ:(.*)/)[1]
                    let data: any = {}
                    for (let i = 1; i < tmp.length; i++) {
                        data[tmp[i].slice(0, tmp[i].indexOf('='))] = tmp[i].slice(tmp[i].indexOf('=') + 1)
                    }

                    switch (type) {
                        case 'record':
                            this.addRecord(data)
                            break
                        case 'face':
                            this.addFace(data)
                            break
                        case 'video':
                            this.addVideo(data)
                            break
                        case 'at':
                            this.message_chain.push(new At(data))
                            break
                        case 'share':
                            this.addShare(data)
                            break
                        case 'music':
                            this.addMusic(data)
                            break
                        case 'image':
                            this.addImage(data)
                            break
                        case 'reply':
                            this.addReply(data)
                            break
                        case 'poke':
                            this.message_chain.push(new Poke(data))
                            break
                        case 'gift':
                            this.addGift(data)
                            break
                        case 'redbag':
                            this.message_chain.push(new Redbag(data))
                            break
                        case 'xml':
                            this.message_chain.push(new Xml(data))
                            break
                        case 'json':
                            this.message_chain.push(new Json(data))
                            break
                        case 'tts':
                            this.message_chain.push(new Tts(data))
                            break
                        default: break
                    }

                    /*
                    if (Object.keys(data).length) this.message_chain.push({ type, data })
                    else this.message_chain.push({ type })
                    */
                }
            }
        })

        return this.message_chain
    }
}