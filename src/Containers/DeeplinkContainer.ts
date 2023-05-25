/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-25T13:04:03+02:00
 * @Copyright: Technology Studio
**/

import {
  useEffect,
} from 'react'
import { Linking } from 'react-native'
import { Log } from '@txo/log'
import Url from 'url-parse'
import type { CommonActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import type { DefaultRootState } from '@txo-peer-dep/redux'

import type {
  DeeplinkNavigationMap,
  DeeplinkNavigationActionCreator,
} from '../Model/Types'
import { matchPath } from '../Api/MatchPath'

type Props = {
  children: JSX.Element,
  deeplinkNavigationMap: DeeplinkNavigationMap | undefined,
  getState: () => DefaultRootState,
}

const log = new Log('@txo.react-native-deep-linking.lib.Containers.DeeplinkContainer')

export const DeeplinkContainer = ({
  children,
  deeplinkNavigationMap,
  getState,
}: Props): JSX.Element => {
  const navigation = useNavigation()

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleDeeplink)
    return (): void => {
      listener.remove()
    }
  }, [])

  const handleDeeplink = (event: { url: string }): void => {
    log.debug('handleDeeplink event', event)
    const link = event.url
    const url = new URL(link)
    const { deeplinkNavigationActionCreator, params } = Object.keys(deeplinkNavigationMap ?? {})
      .reduce<{
      deeplinkNavigationActionCreator: DeeplinkNavigationActionCreator | undefined,
      params: Record<string, string | undefined>,
    }>((
      { deeplinkNavigationActionCreator, params },
      deeplinkPath,
    ) => {
      if (deeplinkNavigationActionCreator != null) {
        return { deeplinkNavigationActionCreator, params }
      }
      const pathMatch = matchPath(deeplinkPath, url.pathname)
      if (pathMatch != null) {
        const searchParams: Record<string, string> = {}
        for (const [key, value] of url.searchParams) {
          searchParams[key] = value
        }
        return {
          deeplinkNavigationActionCreator: deeplinkNavigationMap?.[deeplinkPath],
          params: {
            ...pathMatch?.params,
            ...searchParams,
          },
        }
      }
      return { deeplinkNavigationActionCreator, params }
    }, { deeplinkNavigationActionCreator: undefined, params: {} })
    if (deeplinkNavigationActionCreator != null) {
      const url = new Url(link, true)
      const navigationAction: CommonActions.Action | null = deeplinkNavigationActionCreator(
        { ...url.query, ...params },
        getState(),
      )
      if (navigationAction != null) {
        navigation.dispatch(navigationAction)
      }
    } else {
      log.debug('UNKNOWN DEEPLINK', { link })
    }
  }

  return children
}
