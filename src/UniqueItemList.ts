type UpdateCallback = (items: Array<any>) => void;

export default class UniqueItemList<T> {
    items: Array<T>;
    strict: boolean;
    updateCallback: UpdateCallback | null;
    length: number;
    defaultItem: T | undefined;

    constructor(
        items: Array<T> | undefined = undefined,
        strict: boolean = false,
        updateCallback: UpdateCallback | null = null,
    ) {
        this.items = items ? items : [];
        this.strict = strict;
        this.updateCallback = updateCallback;
        this.defaultItem = items ? items[0] : undefined;
        this.length = 0;
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }

    filter(findFunc: (item: T) => boolean): Array<T> {
        return this.items.filter(findFunc);
    }

    indexOf(item: T) {
        return this.items.indexOf(item);
    }

    map(mapFunc: (item: T) => any): any {
        return this.items.map(mapFunc);
    }

    getDefault(): T | undefined {
        return this.defaultItem;
    }

    push(item: T): void {
        for (let i of this.items) {
            if (i === item) {
                if (this.strict)
                    throw new Error(
                        "item " +
                            item +
                            " already exists in UniqueItemList " +
                            this,
                    );
                return;
            }
        }
        this.items = this.items.concat([item]);
        this.length = this.items.length;
        if (!this.defaultItem) this.defaultItem = item;
        if (this.updateCallback) this.updateCallback(this.items);
    }

    remove(item: T) {
        let index = this.items.indexOf(item);
        if (index < 0) {
            if (this.strict)
                throw new Error(
                    "Item " +
                        item +
                        " does not exist in UniqueItemList " +
                        this,
                );
            return;
        }
        this.items.splice(index, 1);
        this.items = [...this.items];
        this.length = this.items.length;
        if (this.defaultItem === item)
            this.defaultItem = this.length > 0 ? this.items[0] : undefined;
        if (this.updateCallback) this.updateCallback(this.items);
    }

    replace(oldItem: T, newItem: T) {
        let index = this.items.indexOf(oldItem);
        if (index < 0) return false;
        this.items[index] = newItem;
        this.items = [...this.items];
        if (this.defaultItem === oldItem)
            this.defaultItem = this.length > 0 ? this.items[0] : undefined;
        if (this.updateCallback) this.updateCallback(this.items);
        return true;
    }
}
