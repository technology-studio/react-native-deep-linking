/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-25T13:04:03+02:00
 * @Copyright: Technology Studio
 * @flow
**/

import type { ReactNode } from 'react'
import React from 'react'
import type { EmitterSubscription } from 'react-native'
import { Linking } from 'react-native'
import { Log } from '@txo/log'
import Url from 'url-parse'
import { navigationManager } from '@txo-peer-dep/react-conditional-navigation'
import type { NavigationAction } from '@txo-peer-dep/react-conditional-navigation'

import type {
  DeeplinkNavigationMap,
  DeeplinkNavigationActionCreator,
} from '../Model/Types'

type Props = {
  children: ReactNode,
  deeplinkNavigationMap: DeeplinkNavigationMap | undefined,
}

const log = new Log('@txo.react-native-deep-linking.lib.Containers.DeeplinkContainer')

export class DeeplinkContainer extends React.Component<Props> {
  listener: EmitterSubscription | null = null
  componentDidMount (): void {
    this.listener = Linking.addEventListener('url', this.handleDeeplink)
  }

  componentWillUnmount (): void {
    this.listener?.remove()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDeeplink = (event: any): void => {
    log.debug('handleDeeplink event', event)
    const link = event.url
    const pureLink: string = link.split('?', 1)[0]
    const deeplinkNavigationActionCreator: DeeplinkNavigationActionCreator | undefined = this.props.deeplinkNavigationMap?.[pureLink]
    if (deeplinkNavigationActionCreator) {
      const url = new Url(link, true)
      const navigationAction: NavigationAction | null = deeplinkNavigationActionCreator(url.query)
      if (navigationAction) {
        navigationManager.dispatchNavigationAction(navigationAction)
      }
    } else {
      log.debug('UNKNOWN DEEPLINK', { link })
    }
  }

  render (): ReactNode {
    return (
      this.props.children
    )
  }
}
