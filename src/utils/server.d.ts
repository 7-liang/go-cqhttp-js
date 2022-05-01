/// <reference types="node" />
import http from 'http';
import express from 'express';
import EventEmitter from "events";
export default class Server extends EventEmitter {
    express: express.Application;
    server: http.Server;
    constructor(options: {
        port: number;
    });
}
