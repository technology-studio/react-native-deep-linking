/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-25T13:04:03+02:00
 * @Copyright: Technology Studio
**/

import {
  useEffect,
} from 'react'
import {
  Linking,
  Platform,
} from 'react-native'
import { Log } from '@txo/log'
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

const checkInitialUrl = async (): Promise<void> => {
  const initialUrl = await Linking.getInitialURL()
  if (initialUrl != null) {
    await Linking.openURL(initialUrl)
  }
}

export const DeeplinkContainer = ({
  children,
  deeplinkNavigationMap,
  getState,
}: Props): JSX.Element => {
  const navigation = useNavigation()

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleDeeplink)
    if (Platform.OS === 'android') {
      void checkInitialUrl()
    }
    return (): void => {
      listener.remove()
    }
  }, [])

  const handleDeeplink = (event: { url: string }): void => {
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
  }

  return children
}
