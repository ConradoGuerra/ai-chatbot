import { EventEmitter } from 'node:events';

class LoggingEventEmitter extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    console.log(`[eventBus] Emitting event: ${String(event)}`, ...args);
    return super.emit(event, ...args);
  }
}

export const eventBus = new LoggingEventEmitter();
