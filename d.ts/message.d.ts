declare class CQType {
    public type: string
    public data: any
    constructor(opts: { type: string })
    stringify (): string
}


export default class Message {
    public cq_code: string
    public message_chain: CQType[]

    constructor ()

    // 文本消息
    addText (text: string): this
    
    // QQ 表情
    addFace (opts: { id?: number, name?: string }): this

    // 语音
    addRecord (opts: { file: string, magic?: 0 | 1, url?: string, cache?: 0 | 1, proxy?: 0 |1, timeout?: number }): this

    // 短视频
    addVideo (opts: { file: string, cover?: string, c?: 2 | 3 }): this

    // At
    addAt (qq: number | 'all'): this

    // 链接分享
    addShare (opts: { url: string, title: string, content?: string, image?: string }): this

    // 音乐分享
    addMusic (opts: {
        type: 'qq' | '163' | 'xm' | 'custom', id?: number, audio?: string,
        title?: string, content?: string, image?: string, url?: string
    }): this

    // 图片
    addImage (opts: {
        file: string, type: 'flash' | 'show', subType?: string, url?: string,
        cache?: 0 | 1, id?: number, c?: 2 | 3
    }): this

    // 回复
    addReply (opts: { id?: number, text?: string, qq?: number, time?: number, seq?: number }): this

    // 戳一戳
    addPoke (qq: number): this

    // 礼物
    addGift (opts: { qq: number, id?: number, name?: string }): this

    // 将消息解构为 消息链对象
    parse (message: string): CQType[]
}