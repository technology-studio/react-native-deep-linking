/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2019-04-26T10:04:68+02:00
 * @Copyright: Technology Studio
**/

import type { CommonActions } from '@react-navigation/native'
import type { DefaultRootState } from '@txo-peer-dep/redux'

export type DeeplinkNavigationActionCreator = (params: Record<string, string | undefined>, state: DefaultRootState) => CommonActions.Action | null

export type DeeplinkNavigationMap = Record<string, DeeplinkNavigationActionCreator>
