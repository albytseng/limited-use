# limited-use

[![Build Status](https://travis-ci.org/albytseng/limited-use.svg?branch=master)](https://travis-ci.org/albytseng/limited-use) [![dependencies Status](https://david-dm.org/albytseng/limited-use/status.svg)](https://david-dm.org/albytseng/limited-use) [![Coverage Status](https://coveralls.io/repos/github/albytseng/limited-use/badge.svg?branch=master)](https://coveralls.io/github/albytseng/limited-use?branch=master)

A convenient abstraction for functions that should only be invoked a limited number of times.

## Example

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
  new LimitedUse(() => console.log('think about her'), 2)
)

usables.use() // 'eat a donut', 'think about her'
usables.use() // 'think about her'
usables.use() // no effect
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
