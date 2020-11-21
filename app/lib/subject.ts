export type Disposer = () => void
export type Observer<T> = (data: T) => void

export class Subject<T> {
  private observers = new Set<Observer<T>>()

  observe(observer: Observer<T>, data: T): Disposer {
    this.observers.add(observer)
    observer(data)
    return () => void this.observers.delete(observer)
  }

  notify(data: T) {
    for (const observer of this.observers) {
      observer(data)
    }
  }
}
