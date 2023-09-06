export default class UniqueItemListEvent<T> extends Event {
    items: Array<T>;

    constructor(name: string, items: Array<T>) {
        super(name);
        this.items = items;
    }
}
