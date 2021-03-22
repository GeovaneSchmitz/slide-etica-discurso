const path = require('path')
const { classes } = require('./classstore')
const permitedPaths = ['components', 'pages', 'layouts'].map((folder) =>
  path.resolve(folder)
)

module.exports = function (source) {
  const getClassname = (classname, filename) => {
    return this.mode === 'production'
      ? classes.getName(classname, filename)
      : classname
  }
  const convertClassname = (classname, filename) =>
    '$style.' +
    getClassname(
      classname.replace(/-./g, (hyphen) => hyphen.charAt(1).toUpperCase()),
      filename
    )

  const convertObject = (objectClass, filename) =>
    objectClass.replace(
      /(&quot;[A-Z_a-z0-9 -]+?&quot;|'[A-Z_a-z0-9 -]+?')(?=[^,]*(:))/g,
      (classname) =>
        `[${convertClassname(classname.replace(/&quot;|'/g, ''), filename)}]`
    )

  const convertDynamicAttribute = (classAttributeContent, filename) => {
    const isObject = classAttributeContent.match(/^[ ]*\{/g)
    const isArray = classAttributeContent.match(/^[ ]*\[/g)
    if (isObject) {
      return [convertObject(classAttributeContent, filename)]
    } else if (isArray) {
      return classAttributeContent
        .replace(/^\[|]$/g, '')
        .split(',')
        .map((classe) => convertDynamicAttribute(classe, filename))
    }
    return [classAttributeContent]
  }
  const isValidPath = permitedPaths.some(
    (path) => this.resourcePath.indexOf(path) === 0
  )
  if (isValidPath) {
    source = source.replace(/<[^>]+?class[^>]+?>/g, (tag) => {
      if (tag.match(/^<transition |^<transition-group/)) {
        tag = tag.replace(/ name="[^"]*"/g, (attribute) => {
          const classname = attribute.match(/"[^"]*"/)[0].replace(/"/g, '')
          return ` :name="${convertClassname(classname, this.resourcePath)}"`
        })
      }

      const classes = []
      const staticClassAttribute = tag.match(/ class="[^"]+/g)
      if (staticClassAttribute) {
        const staticClasses = staticClassAttribute[0]
          .replace(/^ class="/, '')
          .split(' ')
        classes.push(
          ...staticClasses.map((classname) =>
            convertClassname(classname, this.resourcePath)
          )
        )
      }

      const classAttribute = tag.match(/ :class="[^"]+/g)
      if (classAttribute) {
        const classAttributeContent = classAttribute[0].replace(
          /^ :class="/,
          ''
        )
        classes.push(
          ...convertDynamicAttribute(classAttributeContent, this.resourcePath)
        )
      }

      if (classes.length === 0) return tag
      let newClassAtrributeContent
      if (classes.length > 1) {
        newClassAtrributeContent = `[${classes.join(', ')}]`
      } else {
        newClassAtrributeContent = classes[0]
      }

      const tagWithoutClass = tag
        .replace(/:?class="[^"]*"/g, '')
        .replace(/ + /g, ' ')
        .replace(/ >/g, '>')

      return tagWithoutClass.replace(
        />$/,
        ` :class="${newClassAtrributeContent}">`
      )
    })
  }

  return source
}
