import http from 'app/services/http';
import { managedPromise } from 'app/lib/managedPromise';
import { idGenerator } from 'app/lib/idGenerator';
import { groupIdGenerator } from 'app/lib/groupIdGenerator';

export interface Item {
  id: number;
  groupId: number;
}

export type ReadonlyList = readonly Item[];

type ListObserver = (list: ReadonlyList) => void;
type Disposer = () => void;

export class ListService {
  private list: Item[] = [];
  private observers = new Set<ListObserver>();
  private itemId = idGenerator();
  private groupId = groupIdGenerator();
  private httpGet = managedPromise<void, any>(() => http.get('/'));

  async getAll(): Promise<ReadonlyList> {
    return this.list.slice();
  }

  async add(): Promise<void> {
    const id = this.itemId();
    const promise = this.httpGet();
    const groupId = this.groupId(promise);
    this.list.push({ id, groupId });
    this.notify();
    return promise.then((r) => void this.notify());
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
