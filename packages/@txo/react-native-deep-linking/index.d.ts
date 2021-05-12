/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-05-12T11:05:52+02:00
 * @Copyright: Technology Studio
**/

import { ReactNode } from 'react'
import { NavigationAction } from '@txo-peer-dep/react-conditional-navigation'

declare module '@txo/react-native-deep-linking' {
  type DeeplinkNavigationActionCreator = (params: Record<string, string>) => NavigationAction | null

  type DeeplinkNavigationMap = Record<string, DeeplinkNavigationActionCreator>

  type DeeplinkContainerProps = {
    children: ReactNode,
    deeplinkNavigationMap: DeeplinkNavigationMap | null,
  }
  const DeeplinkContainer: React.ComponentType<DeeplinkContainerProps>
}
