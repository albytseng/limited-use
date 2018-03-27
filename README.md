# limited-use

[![Build Status](https://img.shields.io/travis/albytseng/limited-use.svg)](https://travis-ci.org/albytseng/limited-use) [![Coverage Status](https://img.shields.io/coveralls/github/albytseng/limited-use/master.svg)](https://coveralls.io/github/albytseng/limited-use?branch=master) [![dependencies Status](https://img.shields.io/david/albytseng/limited-use.svg)](https://david-dm.org/albytseng/limited-use) [![npm Version](https://img.shields.io/npm/v/limited-use.svg)](https://www.npmjs.com/package/limited-use)

A lightweight abstraction for functions that should only be invoked a limited number of times.

## Usage

```javascript
import {LimitedUse} from 'limited-use'

const usable = new LimitedUse(() => console.log('take a nap'), 1)

usable.use() // 'take a nap'
usable.use() // no effect
```

With multiple `LimitedUse`s, use them as a single group with `CollectiveUse`:

```javascript
import {LimitedUse, CollectiveUse} from 'limited-use'

const usables = new CollectiveUse()
usables.add(
  new LimitedUse(() => console.log('eat a donut')),
  new LimitedUse(x => console.log(`think about her ${x}`), 365)
)

usables.use('smile') // 'eat a donut', 'think about her smile'
usables.use('touch') // 'think about her touch'
usables.disuse()
usables.use('desperately') // no effect
```

## Installation

Install using [yarn](https://yarnpkg.com/en/):

```bash
$ yarn add limited-use
```

Install using [npm](http://npmjs.com):

```bash
$ npm i limited-use
```

## API

### `LimitedUse`

- __`constructor(callback, limit)`__
  - `callback` - The function to limit in use. Any arguments passed to `use()` will be passed to this function.
  - `limit` - The maximum number of times the call can be called. Optional, default 1.
- __`.use(...args)`__
  - Calls `callback(...args)` and returns an immediately resolved promise of its return value.
- __`.disuse()`__
  - After this function is called, any future calls to `use()` will have no effect.
- __`.isUsable`__
  - True if the number of uses so far is less than `limit`.
- __`.isDisused`__
  - True if the number of uses so far is at least equal to `limit`.

### `CollectiveUse`

- __`constructor(...usables)`__
  - `usables` - Any number of objects that have `.use()` and `.disuse()` methods.
- __`.use(...args)`__
  - Calls `use(...args)` (to be executed asynchronously) on all `usables` added to this collection. Returns a promise that resolves to an array of each call's return value.
- __`.useSync(...args)`__
  - Calls `use(...args)` synchronously on all `usables` added to this collection. Returns an array of each call's return value.
- __`.disuse()`__
  - After this function is called, this collection is marked as disused and `disuse()` is called on all `usables` that had been added.
- __`.isUsable`__
  - True if `disuse()` has not yet been called on this collection and if at least one member is usable.
- __`.isDisused`__
  - True if `disuse()` has been called on this collection.
- __`.add(...usables)`__
  - Adds `usables` (Any number of objects with `.use()` and `.disuse()`) to the collection.
- __`.remove(usable)`__
  - Removes `usable` from the collection. Returns true upon success.
- __`.clear()`__
  - Empties the collection.
