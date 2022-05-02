export declare class SnowFlaker {
    private twepoch;
    private workerIdBits;
    private dataCenterIdBits;
    private maxWorkerId;
    private maxDataCenterId;
    private sequenceBits;
    private workerIdShift;
    private dataCenterIdShift;
    private timestampLeftShift;
    private sequenceMask;
    private lastTimestamp;
    private workerId;
    private dataCenterId;
    private sequence;
    constructor(workerId?: number, dataCenterId?: number);
    generate(workerId?: number, dataCenterId?: number): string;
    timeGenerate(): number;
    tilNextMillis(): number;
}
declare const snowflaker: (workerId?: number, dataCenterId?: number) => string;
export default snowflaker;
