import http from 'app/services/http'
import { managedPromise } from 'app/lib/managedPromise'
import { idGenerator } from 'app/lib/idGenerator'
import { groupIdGenerator } from 'app/lib/groupIdGenerator'
import { Subject, Observer, Disposer } from 'app/lib/subject'

export interface Item {
  id: number
  groupId: number
}

export type ReadonlyList = readonly Item[]

export class ListService {
  private list: Item[] = []
  private subject = new Subject<ReadonlyList>()
  private itemId = idGenerator()
  private groupId = groupIdGenerator()
  private httpGet = managedPromise<void, any>(() => http.get('/'))

  private listCopy(): ReadonlyList {
    return this.list.slice()
  }

  async getAll(): Promise<ReadonlyList> {
    return this.listCopy()
  }

  async add(): Promise<void> {
    const id = this.itemId()
    const promise = this.httpGet()
    const groupId = this.groupId(promise)
    this.list = [...this.list, { id, groupId }]
    this.notify()
    return promise.then((r) => void this.notify())
  }

  async delete(id: number): Promise<void> {
    this.list = this.list.filter((item) => item.id !== id)
    this.notify()
  }

  async clear(): Promise<void> {
    this.list = []
    this.notify()
  }

  observe(observer: Observer<ReadonlyList>): Disposer {
    return this.subject.observe(observer, this.listCopy())
  }

  private notify(): void {
    this.subject.notify(this.listCopy())
  }
}
