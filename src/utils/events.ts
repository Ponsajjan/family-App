import { EventEmitter } from 'events';

const eventEmitterSingleton = () => {
    return new EventEmitter();
};

declare const globalThis: {
    eventEmitterGlobal: ReturnType<typeof eventEmitterSingleton>;
} & typeof global;

const eventEmitter = globalThis.eventEmitterGlobal ?? eventEmitterSingleton();

export default eventEmitter;

if (process.env.NODE_ENV !== 'production') globalThis.eventEmitterGlobal = eventEmitter;
