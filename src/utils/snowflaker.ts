/*
 * @Description  : 分布式自增 ID  算法
 * @Author       : JunLee
 * @Date         : 2020-06-06 08:00:40
 * @LastEditTime : 2020-06-06 08:00:40
 * @FilePath     : \iot-onenet-wx-rev-a\src\common\snowflaker.ts
 */

import bigInt from 'big-integer'

/**
 * @description: Twitter Snowflaker 分布式自增 ID 算法，生成 18 位递增不重复数字 ID
 */
export class SnowFlaker {
    private twepoch: number                 // 开始时间戳
    private workerIdBits: number            // 设备 ID 位数
    private dataCenterIdBits: number        // 数据中心 ID 位数
    private maxWorkerId: number             // 设备 ID 最大位数
    private maxDataCenterId: number         // 数据中心 ID 最大位数
    private sequenceBits: number            // 序列位数
    private workerIdShift: number           // 设备 ID 左移位数
    private dataCenterIdShift: number       // 数据中心 ID 左移位数
    private timestampLeftShift: number      // 时间戳左移位数
    private sequenceMask: number            // 生成序列的掩码
    private lastTimestamp: number           // 上次生成 ID 的时间戳
    private workerId: number                // 设备 ID
    private dataCenterId: number            // 数据中心 ID
    private sequence: number                // 序列，毫秒内

    /**
     * @description: 构造
     * @param {number} workerId 工作设备 ID，0 - 31
     * @param {number} dataCenterId 数据中心 ID，0 - 31
     */
    constructor (workerId?: number, dataCenterId?: number) {
        // 起始时间 2020-01-01 00:00:00 单位：ms
        this.twepoch = 1577808000000
        // 机器 ID 所占位数
        this.workerIdBits = 5
        // 数据标识 ID 所占位数
        this.dataCenterIdBits = 5
        // 支持最大机器 ID 数 0-31
        // tslint:disable-next-line no-bitwise
        this.maxWorkerId = -1 ^ (-1 << this.workerIdBits)
        // 支持最大数据中心标识数 0-31
        // tslint:disable-next-line no-bitwise
        this.maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits)
        // 序列在 ID 中所占位数
        this.sequenceBits = 12
        // 工作设备 ID 左移 12 位
        this.workerIdShift = this.sequenceBits
        // 数据中心标识 ID 左移 17 位 12+5
        this.dataCenterIdShift = this.sequenceBits + this.workerIdBits
        // 时间戳左移 22 位 12+5+5
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits
        // 生成序列掩码 4095
        // tslint:disable-next-line no-bitwise
        this.sequenceMask = -1 ^ (-1 << this.sequenceBits)
        // 上次生成 ID 的时间戳
        this.lastTimestamp = -1
        // 默认工作设备 ID 0-31
        this.workerId = workerId || 0
        // 默认工作数据中心 ID 0-31
        this.dataCenterId = dataCenterId || 0
        // 默认毫秒单位内，生成序列上限 0-4095
        this.sequence = 0

        if (this.workerId > this.maxWorkerId || this.workerId < 0) throw new Error('工作设备 ID 错误（0 - 31）')
        if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) throw new Error('数据中心 ID 错误（0 - 31）')
    }

    /**
     * @description: 生成 ID
     * @param {number} workerId 工作设备 ID，0 - 31
     * @param {number} dataCenterId 数据中心 ID，0 -31
     * @returns {string} 返回 18 位不重复递增 ID
     */
    generate (workerId?: number, dataCenterId?: number) {
        workerId = workerId || this.workerId
        dataCenterId = dataCenterId || this.dataCenterId
        let timestamp = this.timeGenerate()

        // 当前时间戳不能小于最后生成 ID 的时间戳
        if (timestamp < this.lastTimestamp) throw new Error('时间戳错误：小于最后生成 ID 时间戳')

        // 如果当前时间戳和上次生成 ID 的时间戳一至
        // 则判断是否生成毫秒内序列
        if (timestamp === this.lastTimestamp) {
            // 生成当前毫秒内的 ID 序列
            // tslint:disable-next-line no-bitwise
            this.sequence = (this.sequence + 1) & this.sequenceMask
            // 如当前毫秒内序列数溢出，阻塞至下一毫秒，获得新的毫秒时间戳
            if (this.sequence === 0) timestamp = this.tilNextMillis()
        } else {
            // 重置毫秒序列
            this.sequence = 0
        }
        // 更新上次生成 ID 时间戳
        this.lastTimestamp = timestamp
        // 按 Twitter Snowflaker 算法进行 左移 或 运算，并返回最终结果
        // tslint:disable-next-line no-bitwise
        const shiftNum = (dataCenterId << this.dataCenterIdShift) | (workerId << this.workerIdShift)
            | this.sequence
        const nFirst = bigInt(String(timestamp - this.twepoch), 10)
            .shiftLeft(this.timestampLeftShift)
        return nFirst.or(bigInt(shiftNum)).toString(10)
    }

    /**
     * @description: 生成并返回当前时间戳
     */
    timeGenerate () {
        return new Date().getTime()
    }

    /**
     * @description: 阻塞进程至下一毫秒
     * @return: 阻塞后的时间戳
     */
    tilNextMillis () {
        let timestamp = this.timeGenerate()
        while (timestamp <= this.lastTimestamp) timestamp = this.timeGenerate()
        return timestamp
    }
}

/**
 * @description: 生成 18 位不重复自增 ID
 * @param {number} workerId 工作设备 ID，0-31，可选
 * @param {number} dataCenterId 数据中心 ID，0-31，可选
 * @returns {string} 18 位不重复自增 ID
 */
// export default function snowflaker (workerId?: number, dataCenterId?: number) {
//     return new SnowFlaker().generate(workerId, dataCenterId)
// }

// let snow = new SnowFlaker(1, 0)
// let snowflaker = (workerId?: number, dataCenterId?: number): string => snow.generate()

// export default snowflaker

const sf = new SnowFlaker()
const snowflaker = (workerId?: number, dataCenterId?: number) => sf.generate(workerId = 1, dataCenterId = 0)

export default snowflaker
