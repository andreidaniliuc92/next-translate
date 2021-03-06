// @todo Replace to [].flat() in the future
function flat(a) {
  return a.reduce((b, c) => b.concat(c), [])
}

/**
 * Get page namespaces
 *
 * @param {object} config
 * @param {string} page
 */
export default async function getPageNamespaces({ pages = {} }, page, ctx) {
  const rgx = 'rgx:'
  const getNs = async ns => (typeof ns === 'function' ? ns(ctx) : ns || [])

  // Namespaces promises using regex
  const rgxs = Object.keys(pages).reduce((arr, p) => {
    if (
      p.substring(0, rgx.length) === rgx &&
      new RegExp(p.replace(rgx, '')).test(page)
    ) {
      arr.push(getNs(pages[p]))
    }
    return arr
  }, [])

  return [
    ...(await getNs(pages['*'])),
    ...(await getNs(pages[page])),
    ...flat(await Promise.all(rgxs)),
  ]
}
