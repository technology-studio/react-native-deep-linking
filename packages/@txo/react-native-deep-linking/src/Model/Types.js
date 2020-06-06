/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-26T10:04:68+02:00
 * @Copyright: Technology Studio
 * @flow
**/

import type { LiteralMap } from '@txo/flow'
import type { NavigationAction } from '@txo-peer-dep/react-conditional-navigation'

export type DeeplinkNavigationActionCreator = (params: LiteralMap<string, string>) => ?NavigationAction

export type DeeplinkNavigationMap = LiteralMap<string, DeeplinkNavigationActionCreator>
