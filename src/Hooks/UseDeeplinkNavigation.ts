/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2023-10-11T18:10:89+02:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Linking,
} from 'react-native'
import { Log } from '@txo/log'
import type { CommonActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import type { DefaultRootState } from '@txo-peer-dep/redux'
import { useThrottledCallback } from 'use-debounce'

import type {
  DeeplinkNavigationMap,
  DeeplinkNavigationActionCreator,
} from '../Model/Types'
import { matchPath } from '../Api/MatchPath'

const log = new Log('@txo.react-native-deep-linking.lib.Hooks.UseDeeplinkNavigation')

export const useDeeplinkNavigation = ({
  deeplinkNavigationMap,
  getState,
}: {
  deeplinkNavigationMap: DeeplinkNavigationMap | undefined,
  getState: () => DefaultRootState,
}): void => {
  const navigation = useNavigation()
  const isInitialUrlChecked = useRef(false)

  const _handleDeeplink = useCallback((event: { url: string }): void => {
    log.debug('handleDeeplink event', event)
    const link = event.url

    if (deeplinkNavigationMap != null) {
      const deeplinkPathList = Object.keys(deeplinkNavigationMap)
      const url = new URL(link)
      for (const deeplinkPath of deeplinkPathList) {
        const pathMatch = matchPath(deeplinkPath, url.pathname)
        if (pathMatch != null) {
          const searchParams: Record<string, string> = {}
          for (const [key, value] of url.searchParams) {
            searchParams[key] = value
          }
          const deeplinkNavigationActionCreator: DeeplinkNavigationActionCreator | undefined = deeplinkNavigationMap[deeplinkPath]
          if (deeplinkNavigationActionCreator != null) {
            const navigationAction: CommonActions.Action | null = deeplinkNavigationActionCreator(
              {
                ...pathMatch.params,
                ...searchParams,
              },
              getState(),
            )
            if (navigationAction != null) {
              navigation.dispatch(navigationAction)
            }
            return
          }
        }
      }
    }
    log.debug('UNKNOWN DEEPLINK', { link })
  }, [deeplinkNavigationMap, getState, navigation])
  const handleDeeplink = useThrottledCallback(_handleDeeplink, 1000, { trailing: false })

  const checkInitialUrl = useCallback(async (): Promise<void> => {
    const initialUrl = await Linking.getInitialURL()
    if (initialUrl != null) {
      log.debug('checkInitialUrl', { initialUrl })
      handleDeeplink({ url: initialUrl })
    }
  }, [handleDeeplink])

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleDeeplink)
    if (!isInitialUrlChecked.current) {
      void checkInitialUrl()
      isInitialUrlChecked.current = true
    }
    return (): void => {
      listener.remove()
    }
  }, [checkInitialUrl, handleDeeplink])
}
