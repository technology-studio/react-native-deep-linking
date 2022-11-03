/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-25T13:04:03+02:00
 * @Copyright: Technology Studio
**/

import type { ReactNode } from 'react'
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

type Props = {
  children: ReactNode,
  deeplinkNavigationMap: DeeplinkNavigationMap | undefined,
  getState: () => DefaultRootState,
}

const log = new Log('@txo.react-native-deep-linking.lib.Containers.DeeplinkContainer')

export const DeeplinkContainer = ({
  children,
  deeplinkNavigationMap,
  getState,
}: Props): ReactNode => {
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
    const pureLink: string = link.split('?', 1)[0]
    const deeplinkNavigationActionCreator: DeeplinkNavigationActionCreator | undefined = deeplinkNavigationMap?.[pureLink]
    if (deeplinkNavigationActionCreator) {
      const url = new Url(link, true)
      const navigationAction: CommonActions.Action | null = deeplinkNavigationActionCreator(url.query, getState())
      if (navigationAction) {
        navigation.dispatch(navigationAction)
      }
    } else {
      log.debug('UNKNOWN DEEPLINK', { link })
    }
  }

  return children
}
