const prettier = require('prettier')

const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const postsDirectory = path.join(process.cwd(), '_posts')
  const pagesDirectory = path.join(process.cwd(), 'pages')

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${[
          ...fs.readdirSync(postsDirectory).map((post) => `posts/${post}`),
          ...fs.readdirSync(pagesDirectory)
        ]
          .filter((page) => page[0] !== '_')
          .map((page) => {
            const file = page.replace('.md', '').replace('.js', '')
            const route = file === 'index' ? '' : file
            return `
                    <url>
                      <loc>${`https://bvgsoftware.com/${route}`}</loc>
                    </url>`
          })
          .join('')}
      </urlset>
  `

  fs.writeFileSync(
    'public/sitemap.xml',
    prettier.format(sitemap, { parser: 'html' })
  )
}
