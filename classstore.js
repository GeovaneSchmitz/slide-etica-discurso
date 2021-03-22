const incstr = require('incstr')

const createUniqueIdGenerator = () => {
  const generateNextId = incstr.idGenerator({
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  })
  const index = {}
  return (local, path) => {
    const key = local + '-' + path
    if (index[key]) {
      return index[key]
    }
    let nextId
    do {
      nextId = generateNextId()
    } while (nextId.match(/^[0-9]/))

    index[key] = nextId

    return index[key]
  }
}
class ClassStore {
  constructor() {
    this.generateScopedName = createUniqueIdGenerator()
  }
  getName(localName, filename) {
    return this.generateScopedName(localName, filename)
  }
}

module.exports = {
  classes: new ClassStore(),
  variables: new ClassStore(),
  keyframes: new ClassStore()
}
