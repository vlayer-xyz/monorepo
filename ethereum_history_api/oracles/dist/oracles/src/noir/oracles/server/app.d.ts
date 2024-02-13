/// <reference types="node" resolution-mode="require"/>
import Fastify from 'fastify';
import http from 'http';
export declare function buildOracleServer(opts?: Fastify.FastifyHttpOptions<http.Server>): Fastify.FastifyInstance;
