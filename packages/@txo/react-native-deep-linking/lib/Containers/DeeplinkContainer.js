/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-25T13:04:03+02:00
 * @Copyright: Technology Studio
 * @flow
**/

import * as React from 'react'
import { Linking } from 'react-native'
import type { ContainerProps } from '@txo/react'
import { Log } from '@txo-peer-dep/log'
import Url from 'url-parse'
import { navigationManager } from '@txo-peer-dep/react-conditional-navigation'
import type { NavigationAction } from '@txo-peer-dep/react-conditional-navigation'

import type {
  DeeplinkNavigationMap,
  DeeplinkNavigationActionCreator,
} from '../Model/Types'

type Props = ContainerProps & {
  deeplinkNavigationMap: ?DeeplinkNavigationMap,
}

const log = new Log('@txo/react-native-deep-linking/lib/Containers/DeeplinkContainer')

export class DeeplinkContainer extends React.Component<Props> {
  componentDidMount () {
    Linking.addEventListener('url', this.handleDeeplink)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleDeeplink)
  }

  handleDeeplink = (event: any) => {
    log.debug('handleDeeplink event', event)
    const link = event.url
    const pureLink: string = link.split('?', 1)[0]
    const deeplinkNavigationActionCreator: ?DeeplinkNavigationActionCreator = this.props.deeplinkNavigationMap?.[pureLink]
    if (deeplinkNavigationActionCreator) {
      const url = new Url(link, true)
      const navigationAction: ?NavigationAction = deeplinkNavigationActionCreator(url.query)
      if (navigationAction) {
        navigationManager.dispatchNavigationAction(navigationAction)
      }
    } else {
      log.debug('UNKNOWN DEEPLINK', { link })
    }
  }

  render () {
    return (
      this.props.children
    )
  }
}
