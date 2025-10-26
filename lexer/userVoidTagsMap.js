/**
 * This class acts as a set but implements it internally using a map
 * The idea is you need to perform same no. of deletes as add to get rid of an element
 * This useful for cases like: <xyz><abc><xyz>Test</xyz>
 * Notice how there are 2 xyz, lexer right now assumes everytag as void tag,
 * and it tracks the ending of each tag to mark them as not void
 * with normal set this was a bit challenging because you can add xyz twice but removing it once deleted it from the set
 */
class UserVoidTagsMap {
	_store = new Map();
	_size = 0;

	has(key) {
		return this._store.has(key);
	}

	delete(key) {
		const value = this._store.get(key) ?? 0;

		if (this.has(key) && value > 0) {
			this._size -= 1;
		}

		if (value > 1) {
			this._store.set(key, value - 1);
			return;
		}

		this._store.delete(key);
	}

	add(key) {
		const value = this._store.get(key) ?? 0;

		this._size += 1;

		if (value === 0) {
			this._store.set(key, 1);
			return;
		}

		this._store.set(key, value + 1);
	}

	get size() {
		return this._size;
	}

	clear() {
		delete this._store;
		this._store = new Map();
		this._size = 0;
	}

};

module.exports = UserVoidTagsMap;