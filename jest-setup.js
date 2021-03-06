/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import 'raf/polyfill' // fix requestAnimationFrame issue with polyfill
import '@testing-library/jest-dom/extend-expect'
import {Crypto} from '@peculiar/webcrypto'
import mockConfig from './config/mocks/default'
import {setConfig} from 'pwa-kit-react-sdk/ssr/universal/utils'

// TextEncoder is a web API, need to import it
// from nodejs util in testing environment.
// This is used in commerce-api/pkce.js
global.TextEncoder = require('util').TextEncoder

// This file consists of global mocks for jsdom.
class LocalStorageMock {
    constructor() {
        this.store = {}
    }
    clear() {
        this.store = {}
    }
    getItem(key) {
        return this.store[key] || null
    }
    setItem(key, value) {
        this.store[key] = value.toString()
    }
    removeItem(key) {
        delete this.store[key]
    }
}

const localStorageMock = new LocalStorageMock()

Object.defineProperty(window, 'crypto', {
    value: new Crypto()
})

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

Object.defineProperty(window, 'scrollTo', {
    value: () => null
})

// Mock the `default` config to the window global
Object.defineProperty(window, '__CONFIG__', {
    value: mockConfig,
    configurable: true
})

setConfig(mockConfig)

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
})
