import * as express from "express";

export interface RegistrableRoute {
    register(app: express.Application): void;
}
