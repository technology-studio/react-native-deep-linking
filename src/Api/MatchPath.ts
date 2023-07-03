/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2023-05-25T13:05:46+02:00
 * @Copyright: Technology Studio
**/

import { isNotEmptyString } from '@txo/functional'

// NOTE: Contents of this file are copied from react-router/packages/router/utils.ts with added eslint ignores

// Recursive helper for finding path parameters in the absence of wildcards
// eslint-disable-next-line @typescript-eslint/naming-convention
type _PathParam<Path extends string> =
  // split path into individual path segments
  Path extends `${infer L}/${infer R}`
    ? _PathParam<L> | _PathParam<R>
    : // find params after `:`
    Path extends `:${infer Param}`
      ? Param extends `${infer Optional}?`
        ? Optional
        : Param
      : // otherwise, there aren't any params present
      never

/**
 * Examples:
 * "/a/b/*" -> "*"
 * ":a" -> "a"
 * "/a/:b" -> "b"
 * "/a/blahblahblah:b" -> "b"
 * "/:a/:b" -> "a" | "b"
 * "/:a/b/:c/*" -> "a" | "c" | "*"
 */
type PathParam<Path extends string> =
  // check if path is just a wildcard
  Path extends '*' | '/*'
    ? '*'
    : // look for wildcard at the end of the path
    Path extends `${infer Rest}/*`
      ? '*' | _PathParam<Rest>
      : // look for params in the absence of wildcards
      _PathParam<Path>

// Attempt to parse the given string segment. If it fails, then just return the
// plain string type as a default fallback. Otherwise return the union of the
// parsed string literals that were referenced as dynamic segments in the route.
export type ParamParseKey<Segment extends string> =
  // if could not find path params, fallback to `string`
  [PathParam<Segment>] extends [never] ? string : PathParam<Segment>

/**
* A PathPattern is used to match on some portion of a URL pathname.
*/
export interface PathPattern<Path extends string = string> {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: Path,
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean,
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  end?: boolean,
}

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>,
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string,
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string,
  /**
   * The pattern that was used to match.
   */
  pattern: PathPattern,
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
}

export function matchPath<
  ParamKey extends ParamParseKey<Path>,
  Path extends string
> (
  pattern: PathPattern<Path> | Path,
  pathname: string,
): PathMatch<ParamKey> | null {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true }
  }

  const [matcher, paramNames] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end,
  )

  const match = pathname.match(matcher)
  if (match == null) return null

  const matchedPathname = match[0]
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1')
  const captureGroups = match.slice(1)
  const params: Params = paramNames.reduce<Mutable<Params>>(
    (memo, paramName, index) => {
      // We need to compute the pathnameBase here using the raw splat value
      // instead of using params["*"] later because it will be decoded then
      if (paramName === '*') {
        const splatValue = isNotEmptyString(captureGroups[index]) ? captureGroups[index] : ''
        pathnameBase = matchedPathname
          .slice(0, matchedPathname.length - splatValue.length)
          .replace(/(.)\/+$/, '$1')
      }

      memo[paramName] = safelyDecodeURIComponent(
        isNotEmptyString(captureGroups[index]) ? captureGroups[index] : '',
        paramName,
      )
      return memo
    },
    {},
  )

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  }
}

function compilePath (
  path: string,
  caseSensitive = false,
  end = true,
): [RegExp, string[]] {
  warning(
    path === '*' || !path.endsWith('*') || path.endsWith('/*'),
    `Route path "${path}" will be treated as if it were ` +
    `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
    'always follow a `/` in the pattern. To get rid of this warning, ' +
    `please change the route path to "${path.replace(/\*$/, '/*')}".`,
  )

  const paramNames: string[] = []
  let regexpSource =
    `^${
    path
      .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/\/:(\w+)/g, (_: string, paramName: string) => {
        paramNames.push(paramName)
        return '/([^\\/]+)'
      })}`

  if (path.endsWith('*')) {
    paramNames.push('*')
    regexpSource +=
      path === '*' || path === '/*'
        ? '(.*)$' // Already matched the initial /, just match the rest
        : '(?:\\/(.+)|\\/*)$' // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += '\\/*$'
  } else if (path !== '' && path !== '/') {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += '(?:(?=\\/|$))'
  } else {
    // Nothing to match for "" or "/"
  }

  const matcher = new RegExp(regexpSource, caseSensitive ? undefined : 'i')

  return [matcher, paramNames]
}

function safelyDecodeURIComponent (value: string, paramName: string): string {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    warning(
      false,
      `The value for the URL param "${paramName}" will not be decoded because` +
      ` the string "${value}" is a malformed URL segment. This is probably` +
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      ` due to a bad percent encoding (${error}).`,
    )

    return value
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function warning (cond: any, message: string): void {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message)

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message)
    } catch (e) { }
  }
}
