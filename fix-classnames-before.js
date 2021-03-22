const path = require('path')
const { classes, keyframes, variables } = require('./classstore')

const permitedPathsClasses = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
].map((folder) => path.resolve(folder))

const permitedPathsVariables = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
  'styles/transitions.scss',
].map((folder) => path.resolve(folder))

const permitedPathsKeyframes = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
  'styles/transitions.scss',
].map((folder) => path.resolve(folder))

const kebabToCamelCase = (classname) => {
  return classname.replace(/-./g, (hyphen) => hyphen.charAt(1).toUpperCase())
}

const splitVueTransitionState = (classname) => {
  let transition = ''
  const newClassname = classname.replace(
    /(Leave|Enter)(To|From|Active)?$/,
    (_, leaveOrEnter, toOrFromOrActive) => {
      transition = `${leaveOrEnter}${toOrFromOrActive ? toOrFromOrActive : ''}`
      return ''
    }
  )
  return [newClassname, transition]
}

const escapeRegex = (string) => {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

module.exports = function (source) {
  const getClassname = ({ store, name, filename }) => {
    return this.mode === 'production'
      ? store.getName(name, filename || '')
      : name
  }

  const isValidPathClasses = permitedPathsClasses.some(
    (path) => this.resourcePath.indexOf(path) === 0
  )

  if (isValidPathClasses) {
    source = source.replace(
      /(\.[^ .;{}>/:(),'0-9"][^ .;{}>:(),/'"]+)(?![^{]+;)/g,
      (classname) => {
        const [
          classnameWithoutTransition,
          transition,
        ] = splitVueTransitionState(
          kebabToCamelCase(classname.replace(/^\./g, ''))
        )
        return (
          '.' +
          getClassname({
            store: classes,
            name: kebabToCamelCase(classnameWithoutTransition),
            filename: this.resourcePath,
          }) +
          transition
        )
      }
    )
  }
  const isValidPathKeyframes = permitedPathsKeyframes.some(
    (path) => this.resourcePath.indexOf(path) === 0
  )
  if (isValidPathKeyframes) {
    const keyFramesNames = {}
    source = source.replace(
      /@[-a-z]*?keyframes [^ .;{}>/:(),'0-9"][^ .;{}>:(),/'"]+(?![^{]+;)/g,
      (classname) => {
        const keyframesSplited = classname.match(
          /(^@[-a-z]*?keyframes )|[\s\S]+/g
        )
        if (keyframesSplited && keyframesSplited.length === 2) {
          const newKeyframeName = getClassname({
            store: keyframes,
            name: kebabToCamelCase(keyframesSplited[1]),
            filename: this.resourcePath,
          })

          keyFramesNames[keyframesSplited[1]] = newKeyframeName
          return keyframesSplited[0] + newKeyframeName
        }
        return classname
      }
    )
    for (const key of Object.keys(keyFramesNames)) {
      const regexp = new RegExp(
        `animation-name: ?${escapeRegex(
          key
        )} ?[;}]|animation: ?[-_()1-9a-zA-Z .]*?${escapeRegex(
          key
        )}[-_()1-9a-zA-Z .]*?[;}]`,
        'g'
      )
      source = source.replace(regexp, (match) =>
        match.replace(key, keyFramesNames[key])
      )
    }
  }

  const isValidPathVariables = permitedPathsVariables.some(
    (path) => this.resourcePath.indexOf(path) === 0
  )
  if (isValidPathVariables) {
    source = source.replace(
      /[( ;{:,]--[-_a-zA-Z]?[-_a-zA-Z0-9]*/g,
      (matchVariable) => {
        const match = matchVariable.match(
          /([( ;{:,]--)|[-_a-zA-Z][-_a-zA-Z0-9]*/g
        )
        return (
          match[0] +
          getClassname({
            store: variables,
            name: match[1],
          })
        )
      }
    )
  }
  return source
}
