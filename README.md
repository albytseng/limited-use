# limited-use

[![Build Status](https://travis-ci.org/albytseng/limited-use.svg?branch=master)](https://travis-ci.org/albytseng/limited-use) [![dependencies Status](https://david-dm.org/albytseng/limited-use/status.svg)](https://david-dm.org/albytseng/limited-use) [![Coverage Status](https://coveralls.io/repos/github/albytseng/limited-use/badge.svg?branch=master)](https://coveralls.io/github/albytseng/limited-use?branch=master)

A convenient abstraction for functions that should only be invoked a limited number of times.

```javascript
import {LimitedUse} from 'limited-use'

const usable = new LimitedUse(callback, 1);
usable.use() // callback is called.
usable.use() // No effect; callback is not called.
```

With multiple `LimitedUse`s, use them as a single group with `CollectiveUse`:

```javascript
import {LimitedUse, CollectiveUse} from 'limited-use';

const usable1 = new LimitedUse(callback1);
const usable2 = new LimitedUse(callback2, 2);
const usables = new CollectiveUse(usable1, usable2);

usables.use() // All callbacks are called.
usables.use() // Only callback2 is called.
usables.use() // No effect; no callbacks are called.
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
