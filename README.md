# limited-use

[![Build Status](https://travis-ci.org/albytseng/limited-use.svg?branch=master)](https://travis-ci.org/albytseng/limited-use) [![dependencies Status](https://david-dm.org/albytseng/limited-use/status.svg)](https://david-dm.org/albytseng/limited-use) [![Coverage Status](https://coveralls.io/repos/github/albytseng/limited-use/badge.svg?branch=master)](https://coveralls.io/github/albytseng/limited-use?branch=master)

A convenient abstraction for functions that should only be invoked a limited number of times.

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
  new LimitedUse((x) => console.log(`think about her ${x}`), 365)
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
  - Calls the callback function with `args`.
- __`.disuse()`__
  - After this function is called, any future calls to `use()` will have no effect.
- __`.isUsable`__
  - True if the number of uses so far is not greater than or equal to the `limit`.
- __`.isDisused`__
  - True if the number of uses is at least equal to the `limit`.

### `CollectiveUse`

- __`constructor(...usables)`__
  - `usables` - Any number of objects that have `.use()` and `.disuse()` methods.
- __`.use(...args)`__
  - Calls `use(...args)` (to be executed asynchronously) on all `usables` added to this collection.
- __`.disuse()`__
  - After this function is called, this collection is marked as disused and `disuse()` is called on all `usables` that had been added.
- __`isUsable`__
  - True if `disuse()` has not yet been called on this collection and if at least one member is usable.
- __`isDisused`__
  - True if `disuse()` has been called on this collection.
- __`.add(...usables)`__
  - Adds `usables` (Any number of objects with `.use()` and `.disuse()`) to the collection.
- __`.remove(usable)`__
  - Removes `usable` from the collection. Returns true upon success.
- __`.clear()`__
  - Empties the collection.
