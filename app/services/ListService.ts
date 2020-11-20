import http from 'app/services/http';
import { managedPromise } from 'app/lib/managedPromise';
import { idGenerator } from 'app/lib/idGenerator';

export interface Item {
  id: number;
  responseId: number;
}

export type ReadonlyList = readonly Item[];

type ListObserver = (list: ReadonlyList) => void;
type Disposer = () => void;

const itemIdGenerator = idGenerator();
const responseIdGenerator = idGenerator();

export class ListService {
  private list: Item[] = [];
  private observers = new Set<ListObserver>();
  private promiseIdMap = new Map<Promise<any>, number>();
  private httpGet = managedPromise<number, { params: any }>(() =>
    http.get('/', {}),
  );

  private getResponseId(promise: Promise<any>) {
    let id = this.promiseIdMap.get(promise);
    if (id == null) {
      id = responseIdGenerator();
      this.promiseIdMap.set(promise, id);
    }
    return id;
  }

  async getAll(): Promise<ReadonlyList> {
    return this.list.slice();
  }

  async add(): Promise<void> {
    const id = itemIdGenerator();
    const promise = this.httpGet();
    const responseId = this.getResponseId(promise);
    this.list.push({ id, responseId });
    this.notify();
    return promise.then((response) => void this.notify());
  }

  async delete(id: number): Promise<void> {
    this.list = this.list.filter((item) => item.id !== id);
    this.notify();
  }

  async clear(): Promise<void> {
    this.list = [];
    this.notify();
  }

  observe(observer: ListObserver): Disposer {
    this.observers.add(observer);
    observer(this.list.slice());
    return () => void this.observers.delete(observer);
  }

  private notify(): void {
    const list = this.list.slice();
    for (const observer of this.observers.values()) {
      observer(list);
    }
  }
}
