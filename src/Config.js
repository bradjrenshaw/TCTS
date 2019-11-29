import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';


//A class to store config in local or session storage, or in memory if neither are available

class Config {
constructor(defaultConfig, key, storage) {
this.defaultConfig = defaultConfig;
this.config = {};
this.key = key;
this.storage = storage;
this.set(defaultConfig);
}

get(value) {
	return this.config[value];
}


set(s) {
	let result = cloneDeep(s);
	this.config = result;
this.save();
console.log(this.config);
}

update(s) {
	let result = cloneDeep(s);
	merge(this.config, result);
this.save();
}

load(newStorage = undefined) {
if (newStorage) {
this.storage = newStorage;
}
if (this.storage) {
	let result = this.storage.getItem(this.key);
console.log('getItem result: ' + (typeof result)+'value: '+result);
	if (result !== 'null') {
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


}

export default Config;