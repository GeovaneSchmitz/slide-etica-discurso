import * as path from 'path'
import LicensePlugin from 'webpack-license-plugin'
import incstr from 'incstr'

const generateNextId = incstr.idGenerator({
  alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-',
})

const permitedPaths = ['components', 'pages', 'layouts'].map((folder) =>
  path.resolve(folder)
)

// region CSS Scope Minify
const createUniqueIdGenerator = () => {
  const index = {}
  return (local, path) => {
    const key = local + '-' + path
    if (index[key]) {
      return index[key]
    }

    let nextId
    do {
      nextId = generateNextId()
    } while (
      // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
      nextId.match(
        /(^[0-9_-])|a[-_]*?d|spon|ban|google|affilia|MPU|promo|sba|ablock|reklam|([0-9_]x[0-9])|(-|_)[0-9]+$|^ch$|^mw$|^ra$|^ddb$|^mod$|^openx$|^quigo$|^gbfwa$|^rhsvw$|^imuBox$|^wpmrec$/gi
      )
    )
    index[key] = nextId

    return index[key]
  }
}

const generateScopedName = createUniqueIdGenerator()

const generateGetLocalIdent = (isDev) => (
  context,
  _localIdentName,
  localName
) => {
  const isValidPath = permitedPaths.some(
    (path) => context.resourcePath.indexOf(path) === 0
  )
  if (!isValidPath) return localName
  const classnameWithoutTransition = localName.replace(
    /(Leave|Enter)(To|From|Active)?$/,
    ''
  )
  let classname = generateScopedName(
    classnameWithoutTransition,
    context.resourcePath
  )

  if (isDev) {
    classname =
      classnameWithoutTransition.replace(
        /[A-Z]/g,
        (letter) => '-' + letter.toLowerCase()
      ) +
      '-' +
      classname
  }

  const transition =
    (classnameWithoutTransition !== localName &&
      localName.replace(
        /[\S]+?(Leave|Enter)(To|From|Active)?$/,
        (_, leaveOrEnter, toOrFromOrActive) =>
          `-${leaveOrEnter.toLowerCase()}${
            toOrFromOrActive ? '-' + toOrFromOrActive.toLowerCase() : ''
          }`
      )) ||
    ''
  return `${classname}${transition}`
}

export default {
  /*
   ** Headers of the page
   */
  server: {
    host: '0.0.0.0', // default: localhost
    port: '5001',
  },

  ssr: false,

  target: 'server',

  render: {
    csp: true,
  },

  head: {
    title: 'Ética do discurso - Slides',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preload',
        href: '',
        as: 'font',
      },
    ],
  },

  components: true,
  modern: 'server',

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/styles/fonts.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  buildModules: [
    '@aceforth/nuxt-optimized-images',
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
  ],

  optimizedImages: {
    inlineImageLimit: -1,
    optimizeImages: true,
  },
  /*
   ** Nuxt.js modules
   */
  modules: [],

  http: {
    proxy: true, // Can be also an object with default options
    retry: 3,
    proxyHeaders: true,
  },

  /*
   ** Nuxt.js modules
   */
  /*
   ** Build configuration
   */
  build: {
    publicPath: '/public/',

    extractCSS: {
      ignoreOrder: true,
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isModern, isClient }) {
      const getLocalIdent = generateGetLocalIdent(isDev)
      const buildType = isModern ? 'modern' : isClient ? 'client' : 'server'
      console.log(buildType)
      config.plugins.push(
        new LicensePlugin({
          outputFilename: `license-${buildType}.json`,
          unacceptableLicenseTest: (licenseType) => licenseType.match(/GPL/i),
        })
      )

      /*       config.optimization.concatenateModules = false
       */
      config.module.rules.forEach((rule) => {
        rule.oneOf &&
          rule.oneOf.forEach((useOf) => {
            String(useOf.resourceQuery) === '/module/' &&
              useOf.use &&
              useOf.use.forEach((use) => {
                if (use.loader.match(/vue-style-loader|css-loader/g)) {
                  if (!use.options.modules) {
                    use.options.modules = {
                      getLocalIdent,
                    }
                  } else {
                    delete use.options.modules.localIdentName
                    use.options.modules.getLocalIdent = getLocalIdent
                  }
                }
              })
            const cssLoaderIndex = useOf.use.findIndex((use) => {
              return use.loader && use.loader.includes('css-loader')
            })
            if (cssLoaderIndex > -1) {
              useOf.use.splice(cssLoaderIndex + 1, 0, {
                loader: path.resolve('fix-classnames-before.js'),
              })
            }
          })
      })

      config.module.rules[1].oneOf[0].use.unshift({
        loader: path.resolve('fix-html.js'),
      })

      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = 'development'
      }
    },
  },
}
