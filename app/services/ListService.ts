import { schemeCategory10, color as d3Color } from 'd3';
import { Http } from 'app/services/http';
import { managedPromise } from 'app/lib/managedPromise';
import { idGenerator } from 'app/lib/idGenerator';

export interface Item {
  id: number;
  request: string;
  response?: string;
  color: string;
}

export type ReadonlyList = readonly Item[];

type ListObserver = (list: ReadonlyList) => void;
type Disposer = () => void;

const getColor = (num: number) =>
  d3Color(schemeCategory10[num % 10])
    ?.darker(2)
    .formatHex() ?? '#777';

const itemId = idGenerator();

export class ListService {
  private list: Item[] = [];
  private observers = new Set<ListObserver>();
  private http = new Http(1000);
  private colorMap = new Map<Promise<any>, string>();
  private httpGet = managedPromise<number, { params: any }>(() =>
    this.http.get('/', {}),
  );

  private colorForPromise(promise: Promise<any>) {
    let color = this.colorMap.get(promise);
    if (color == null) {
      color = getColor(this.colorMap.size);
      this.colorMap.set(promise, color);
    }
    return color;
  }

  async getAll(): Promise<ReadonlyList> {
    return this.list.slice();
  }

  async add(): Promise<void> {
    const id = itemId();
    const promise = this.httpGet();
    const color = this.colorForPromise(promise);
    this.list.push({ id, request: `Request ${id}`, color });
    this.notify();

    return promise.then((r) => {
      const index = [...this.colorMap.keys()].indexOf(promise);
      this.list = this.list.map((item) =>
        item.id !== id ? item : { ...item, response: `Response ${index + 1}` },
      );
      this.notify();
    });
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
