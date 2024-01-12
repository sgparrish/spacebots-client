import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'
import aluminium from './aluminium.svg'
import mithril from './mithril.svg'
import titanium from './titanium.svg'
import zinc from './zinc.svg'
import zirconium from './zirconium.svg'

import fleet from './fleet.svg'
import system from './system.svg'

const customSvgNameToComponent: any = {
  aluminium,
  mithril,
  titanium,
  zinc,
  zirconium,

  fleet,
  system,
}

const customIcons: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, [h(customSvgNameToComponent[props.icon as string], { class: 'v-icon__svg' })]),
}

export default customIcons
