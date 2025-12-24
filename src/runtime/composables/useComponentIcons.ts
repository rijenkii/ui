import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useAppConfig } from '#imports'
import type { AvatarProps, IconProps } from '../types'

export interface UseComponentIconsProps {
  /**
   * Display an icon based on the `leading` and `trailing` props.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /** Display an avatar on the left side. */
  avatar?: AvatarProps
  /** When `true`, the icon will be displayed on the left side. */
  leading?: boolean
  /**
   * Display an icon on the left side.
   * @IconifyIcon
   */
  leadingIcon?: IconProps['name']
  /** When `true`, the icon will be displayed on the right side. */
  trailing?: boolean
  /**
   * Display an icon on the right side.
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /** When `true`, the loading icon will be displayed. */
  loading?: boolean
  /**
   * Position of the loading icon on the component:
   * - `leading` -- at the start of the component
   * - `trailing` -- at the end of the component
   * - `auto` -- dependant on the value of the `trailing` property
   * @defaultValue `auto`
   */
  loadingPosition?: 'auto' | 'leading' | 'trailing'
  /**
   * The icon when the `loading` prop is `true`.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
}

export function useComponentIcons(componentProps: MaybeRefOrGetter<UseComponentIconsProps>) {
  const appConfig = useAppConfig()

  const props = computed(() => toValue(componentProps))

  const regularLeadingIcon = computed(() => props.value.leadingIcon ?? (props.value.leading || !props.value.trailing ? props.value.icon : undefined))
  const regularTrailingIcon = computed(() => props.value.trailingIcon ?? (props.value.trailing ? props.value.icon : undefined))

  const loadingIcon = computed(() => {
    const iconName = props.value.loading ? (props.value.loadingIcon || appConfig.ui.icons.loading) : undefined

    if (props.value.loadingPosition === "leading") {
      return { leading: iconName }
    } else if (props.value.loadingPosition === "trailing") {
      return { trailing: iconName }
    } else if (!props.value.trailing) {
      return { leading: iconName }
    } else {
      return { trailing: iconName }
    }
  })

  const leadingIconName = computed(() => loadingIcon.value.leading ?? regularLeadingIcon.value)
  const trailingIconName = computed(() => loadingIcon.value.trailing ?? regularTrailingIcon.value)

  return {
    /**
     * @deprecated check for truthfulness of `leadingIconName` instead.
     */
    isLeading: computed(() => leadingIconName.value !== undefined),
    /**
     * @deprecated check for truthfulness of `trailingIconName` instead.
     */
    isTrailing: computed(() => trailingIconName.value !== undefined),
    leadingIconName,
    trailingIconName
  }
}
