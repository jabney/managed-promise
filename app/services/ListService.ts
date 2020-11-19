import {schemeCategory10, color as d3Color} from 'd3';
import {Http} from 'app/services/http';
import {managedPromise} from 'app/lib/managedPromise';

export interface Item {
  id: number;
  request: string;
  response?: string;
  color: string;
}

export type ReadonlyList = readonly Item[];

type ListObserver = (list: ReadonlyList) => void;
type Disposer = () => void;

let nextId = 0;

const getColor = (num: number) =>
  d3Color(schemeCategory10[num % 10])
    ?.darker(2)
    .formatHex() ?? '#777';

export class ListService {
  private _list: Item[] = [];
  private observers = new Set<ListObserver>();
  private http = new Http(1000);
  private colorMap = new Map<Promise<any>, string>();
  private httpGet = managedPromise<number, {params: any}>(() =>
    this.http.get('/', {}),
  );

  private get list() {
    return this._list.slice();
  }

  private colorForPromise(promise: Promise<any>) {
    let color = this.colorMap.get(promise);
    if (color == null) {
      color = getColor(this.colorMap.size);
      this.colorMap.set(promise, color);
    }
    return color;
  }

  async getAll(): Promise<ReadonlyList> {
    return this.list;
  }

  async add(): Promise<void> {
    const id = nextId++;
    const promise = this.httpGet();
    const color = this.colorForPromise(promise);
    this._list.push({id, request: `Request ${id}`, color});
    this.notify();

    return promise.then((r) => {
      const index = [...this.colorMap.keys()].indexOf(promise);
      this._list = this._list.map((item) =>
        item.id !== id ? item : {...item, response: `Response ${index + 1}`},
      );
      this.notify();
    });
  }

  async delete(id: number): Promise<void> {
    this._list = this._list.filter((item) => item.id !== id);
    this.notify();
  }

  async clear(): Promise<void> {
    this._list = [];
    this.notify();
  }

  observe(observer: ListObserver): Disposer {
    this.observers.add(observer);
    observer(this.list);
    return () => void this.observers.delete(observer);
  }

  private notify(): void {
    const list = this.list;
    for (const observer of this.observers.values()) {
      observer(list);
    }
  }
}
