import fs from 'node:fs'
import path from 'node:path'
import { 
  type Plugin,
  defineConfig,
  normalizePath, 
  loadEnv
} from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'
import svgr from 'vite-plugin-svgr'

const env = loadEnv(
  'all',
  process.cwd()
);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@renderer',
        replacement: path.resolve(__dirname, 'src/renderer')
      },
      {
        find: '@main',
        replacement: path.resolve(__dirname, 'src/main')
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, 'src/shared')
      }
    ]
  },
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'src/main/main.ts',
        vite: {
          build: {
            minify: false,
            commonjsOptions: {
              ignoreDynamicRequires: true,
            },
            rollupOptions: {
              plugins: [
                alias({
                  entries: [
                    {
                      find: "./lib-cov/fluent-ffmpeg",
                      replacement: "./lib/fluent-ffmpeg",
                    }
                  ]
                })
              ]
            }
          }
        }
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'src/main/preload.ts'),
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
    bindingSqlite3(),
    svgr(),
  ],
})

function bindingSqlite3(options: {
  output?: string;
  better_sqlite3_node?: string;
  command?: string;
} = {}): Plugin {
  const TAG = '[vite-plugin-binding-sqlite3]'
  options.output ??= 'dist-native'
  options.better_sqlite3_node ??= 'better_sqlite3.node'
  options.command ??= 'build'

  return {
    name: 'vite-plugin-binding-sqlite3',
    config(config) {
      // https://github.com/vitejs/vite/blob/v4.4.9/packages/vite/src/node/config.ts#L496-L499
      const path$1 = process.platform == 'win32' ? path.win32 : path.posix
      const resolvedRoot = config.root ? path$1.resolve(config.root) : process.cwd()
      const output = path$1.resolve(resolvedRoot, options.output)
      const better_sqlite3 = require.resolve('better-sqlite3')
      const better_sqlite3_root = path$1.join(better_sqlite3.slice(0, better_sqlite3.lastIndexOf('node_modules')), 'node_modules/better-sqlite3')
      const better_sqlite3_node = path$1.join(better_sqlite3_root, 'build/Release', options.better_sqlite3_node)    
      const better_sqlite3_copy = path$1.join(output, options.better_sqlite3_node)
      if (!fs.existsSync(better_sqlite3_node)) {
        throw new Error(`${TAG} Can not found "${better_sqlite3_node}".`)
      }
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true })
      }
      fs.copyFileSync(better_sqlite3_node, better_sqlite3_copy)
      /** `dist-native/better_sqlite3.node` */
      const BETTER_SQLITE3_BINDING = better_sqlite3_copy.replace(resolvedRoot + path.sep, '')

      if (!("VITE_BETTER_SQLITE3_BINDING" in env)) {
        fs.appendFileSync(path.join(resolvedRoot, '.env'), `VITE_BETTER_SQLITE3_BINDING=${BETTER_SQLITE3_BINDING}`)
      }
      

      console.log(TAG, `binding to ${BETTER_SQLITE3_BINDING}`)
    },
  }
}