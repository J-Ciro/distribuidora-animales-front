/**
 * Archivo de configuración para pruebas con React Testing Library
 */
import '@testing-library/jest-dom'
import { vi, beforeAll, afterAll, beforeEach } from 'vitest'

// Mock de localStorage con implementación funcional
const storage = {}
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, value) => { storage[key] = value }),
  removeItem: vi.fn((key) => { delete storage[key] }),
  clear: vi.fn(() => { Object.keys(storage).forEach(key => delete storage[key]) }),
}
global.localStorage = localStorageMock

// Limpiar localStorage antes de cada test
beforeEach(() => {
  Object.keys(storage).forEach(key => delete storage[key])
})

// Mock de console.error para tests más limpios
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
