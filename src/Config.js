import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash.mergewith';


//A class to store config in local or session storage, or in memory if neither are available

class Config {
constructor(defaultConfig, key, storage, shouldSave=false) {
this.defaultConfig = defaultConfig;
this.config = {};
this.key = key;
this.storage = storage;
this.shouldSave = shouldSave;
this.set(defaultConfig);
}

get(value) {
	return this.config[value];
}

set(s) {
	let result = cloneDeep(s);
	this.config = result;
if (this.shouldSave) this.save();
}

update(s) {
	let result = cloneDeep(s);
	mergeWith(this.config, result, (a, b) => {
		if(Array.isArray(a) && Array.isArray(b)) return b;
	});
if (this.shouldSave) this.save();
}

load(newStorage = undefined) {
if (newStorage) {
this.storage = newStorage;
}
if (this.storage) {
	let result = this.storage.getItem(this.key);
	if (result !== 'null' && result) {
console.log("Now setting " + result);
	this.set(JSON.parse(result));
return true;
}
}
return false;
}

save(newStorage = undefined) {
	if (newStorage) {
		this.storage = newStorage;
	}
	if (this.storage) {
		let result = JSON.stringify(this.config);
		this.storage.setItem(this.key, result);
		return true;
	}
	return false;
}

clear() {
	if (this.storage) {
		this.storage.removeItem(this.key);
	}
}

get shouldSave() {
return this._saves;
}

set shouldSave(value) {
this._saves = value;
if (value === false) {
this.clear();
}
}

}

export default Config;
