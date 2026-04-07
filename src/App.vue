<template>
  <vanConfigProvider :theme="getDarkMode" :theme-vars="getThemeVars()">
    <div class="absolute inset-0 overflow-hidden">
      <RouterView v-slot="{ Component, route }">
        <transition :name="transitionName">
          <div :key="route.fullPath" class="absolute inset-0 overflow-x-hidden overflow-y-auto">
            <KeepAlive v-if="keepAliveComponents" :include="keepAliveComponents">
              <component :is="Component" />
            </KeepAlive>
          </div>
        </transition>
      </RouterView>
    </div>
  </vanConfigProvider>
</template>

<script setup lang="ts">
import { darken, lighten } from '@/utils'
import { useRouteStore } from '@/store/modules/route'
import { useDesignSetting } from '@/hooks/setting/useDesignSetting'
import { useRouteTransition } from '@/hooks/useRouteTransition'
import { useSwipeBack } from '@/hooks/useSwipeBack'

const routeStore = useRouteStore()
const { getDarkMode, getAppTheme } = useDesignSetting()
const { transitionName } = useRouteTransition()
useSwipeBack()

// 需要缓存的路由组件
const keepAliveComponents = computed(() => routeStore.keepAliveComponents)

function getThemeVars() {
  const appTheme = unref(getAppTheme)
  const darkenStr = darken(appTheme, 25)
  const lightenStr = lighten(appTheme, 10)

  return {
    actionSheetCancelTextColor: appTheme,
    buttonPrimaryBackground: appTheme,
    buttonPrimaryBorderColor: appTheme,
    radioCheckedIconColor: appTheme,
    sliderActiveBackground: appTheme,
    cascaderActiveColor: appTheme,
    checkboxCheckedIconColor: appTheme,
    numberKeyboardButtonBackground: appTheme,
    pickerLoadingIconColor: appTheme,
    calendarRangeEdgeBackground: appTheme,
    calendarRangeMiddleColor: appTheme,
    calendarSelectedDayBackground: appTheme,
    stepperButtonRoundThemeColor: appTheme,
    switchOnBackground: appTheme,
    dialogConfirmButtonTextColor: appTheme,
    dropdownMenuOptionActiveColor: appTheme,
    dropdownMenuTitleActiveTextColor: appTheme,
    notifyPrimaryBackground: appTheme,
    circleColor: appTheme,
    noticeBarBackground: lightenStr,
    noticeBarTextColor: darkenStr,
    progressColor: appTheme,
    progressPivotBackground: appTheme,
    stepActiveColor: appTheme,
    stepFinishLineColor: appTheme,
    swipeIndicatorActiveBackground: appTheme,
    tagPrimaryColor: appTheme,
    navBarIconColor: appTheme,
    navBarTextColor: appTheme,
    paginationItemDefaultColor: appTheme,
    sidebarSelectedBorderColor: appTheme,
    tabsDefaultColor: appTheme,
    tabsBottomBarColor: appTheme,
    tabbarItemActiveColor: appTheme,
    treeSelectItemActiveColor: appTheme,
  }
}
</script>

<style lang="less">
  @import './styles/index.less';
</style>
