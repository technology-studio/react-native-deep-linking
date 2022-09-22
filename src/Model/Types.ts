/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-26T10:04:68+02:00
 * @Copyright: Technology Studio
 * @flow
**/

import type { NavigationAction } from '@txo-peer-dep/react-conditional-navigation'

export type DeeplinkNavigationActionCreator = (params: Record<string, string | undefined>) => NavigationAction | null

export type DeeplinkNavigationMap = Record<string, DeeplinkNavigationActionCreator>
