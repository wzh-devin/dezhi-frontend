<template>
  <div class="color-picker-wrapper">
    <div class="color-display" :style="{ backgroundColor: modelValue }" @click="togglePanel">
      <span class="color-text">{{ modelValue }}</span>
    </div>

    <Teleport to="body">
      <div v-if="visible" class="color-panel-overlay" @click="handleOverlayClick">
        <div class="color-panel" :style="panelStyle" @click.stop>
          <!-- 预设颜色 -->
          <div class="preset-colors">
            <div class="preset-section">
              <div class="preset-label">推荐颜色</div>
              <div class="preset-row">
                <div
                  v-for="color in recommendColors"
                  :key="color"
                  class="preset-color"
                  :class="{ active: modelValue === color }"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
                />
              </div>
            </div>

            <div class="preset-section">
              <div class="preset-label">最近使用</div>
              <div class="preset-row">
                <div
                  v-for="color in recentColors"
                  :key="color"
                  class="preset-color"
                  :class="{ active: modelValue === color }"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
                />
              </div>
            </div>
          </div>

          <!-- 颜色选择器 -->
          <div class="color-picker">
            <div class="saturation-brightness" @mousedown="handleSaturationMouseDown">
              <div
                class="saturation-brightness-overlay"
                :style="{
                  background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)), linear-gradient(to top, #000, transparent)`,
                }"
              >
                <div
                  class="saturation-brightness-handle"
                  :style="{
                    left: saturation + '%',
                    top: 100 - brightness + '%',
                  }"
                />
              </div>
            </div>

            <div class="hue-slider" @mousedown="handleHueMouseDown">
              <div class="hue-handle" :style="{ left: (hue / 360) * 100 + '%' }" />
            </div>
          </div>

          <!-- 输入框 -->
          <div class="color-input">
            <input
              v-model="hexValue"
              type="text"
              class="hex-input"
              @input="handleHexInput"
              @blur="handleHexBlur"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#1890ff',
})

const emit = defineEmits<Emits>()

// 组件状态
const visible = ref(false)
const hue = ref(0)
const saturation = ref(100)
const brightness = ref(100)
const hexValue = ref(props.modelValue)
const panelStyle = ref({})

// 预设颜色
const recommendColors = [
  '#1890ff',
  '#52c41a',
  '#fa541c',
  '#eb2f96',
  '#722ed1',
  '#13c2c2',
  '#fadb14',
  '#a0d911',
  '#fa8c16',
  '#f5222d',
]

const recentColors = [
  '#f5222d',
  '#fa8c16',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#13c2c2',
  '#722ed1',
  '#eb2f96',
  '#666666',
  '#262626',
]

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== hexValue.value) {
      hexValue.value = newValue
      updateHSVFromHex(newValue)
    }
  },
  { immediate: true },
)

// 监听HSV变化
watch([hue, saturation, brightness], () => {
  const hex = hsvToHex(hue.value, saturation.value, brightness.value)
  hexValue.value = hex
  emit('update:modelValue', hex)
})

// 计算面板位置
const updatePanelPosition = () => {
  const trigger = document.querySelector('.color-display') as HTMLElement
  if (trigger) {
    const rect = trigger.getBoundingClientRect()
    panelStyle.value = {
      position: 'absolute',
      top: rect.bottom + 4 + 'px',
      left: rect.left + 'px',
      zIndex: 1050,
    }
  }
}

// 方法
const togglePanel = () => {
  if (!visible.value) {
    nextTick(() => {
      updatePanelPosition()
    })
  }
  visible.value = !visible.value
}

const handleOverlayClick = () => {
  visible.value = false
}

const selectColor = (color: string) => {
  hexValue.value = color
  updateHSVFromHex(color)
  emit('update:modelValue', color)
  visible.value = false
}

const handleSaturationMouseDown = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const updatePosition = (event: MouseEvent) => {
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    saturation.value = Math.round(x * 100)
    brightness.value = Math.round((1 - y) * 100)
  }

  updatePosition(e)

  const handleMouseMove = (event: MouseEvent) => {
    updatePosition(event)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleHueMouseDown = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const updateHue = (event: MouseEvent) => {
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    hue.value = Math.round(x * 360)
  }

  updateHue(e)

  const handleMouseMove = (event: MouseEvent) => {
    updateHue(event)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleHexInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValidHex(value)) {
    updateHSVFromHex(value)
    emit('update:modelValue', value)
  }
}

const handleHexBlur = () => {
  if (!isValidHex(hexValue.value)) {
    hexValue.value = props.modelValue
  }
}

// 工具函数
const isValidHex = (hex: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

const hexToHsv = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6
    else if (max === g) h = (b - r) / diff + 2
    else h = (r - g) / diff + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360

  const s = max === 0 ? 0 : Math.round((diff / max) * 100)
  const v = Math.round(max * 100)

  return { h, s, v }
}

const hsvToHex = (h: number, s: number, v: number): string => {
  const sNorm = s / 100
  const vNorm = v / 100

  const c = vNorm * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = vNorm - c

  let r = 0,
    g = 0,
    b = 0
  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, '0')
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, '0')
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${rHex}${gHex}${bHex}`
}

const updateHSVFromHex = (hex: string) => {
  if (isValidHex(hex)) {
    const { h, s, v } = hexToHsv(hex)
    hue.value = h
    saturation.value = s
    brightness.value = v
  }
}

// 监听窗口滚动和resize，更新面板位置
onMounted(() => {
  window.addEventListener('scroll', updatePanelPosition)
  window.addEventListener('resize', updatePanelPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePanelPosition)
  window.removeEventListener('resize', updatePanelPosition)
})
</script>

<style scoped lang="less">
.color-picker-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.color-display {
  width: 100%;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  padding: 0 11px;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.color-text {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
}

.color-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: transparent;
}

.color-panel {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 12px;
  width: 280px;
}

.preset-colors {
  margin-bottom: 12px;
}

.preset-section {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.preset-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.preset-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.preset-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  position: relative;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #40a9ff;
  }

  &.active {
    border-color: #1890ff;
    border-width: 2px;

    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 10px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }
}

.color-picker {
  margin-bottom: 12px;
}

.saturation-brightness {
  width: 100%;
  height: 150px;
  position: relative;
  cursor: crosshair;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.saturation-brightness-overlay {
  width: 100%;
  height: 100%;
  position: relative;
}

.saturation-brightness-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hue-slider {
  width: 100%;
  height: 12px;
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 16.66%,
    #00ff00 33.33%,
    #00ffff 50%,
    #0000ff 66.66%,
    #ff00ff 83.33%,
    #ff0000 100%
  );
  border-radius: 6px;
  position: relative;
  cursor: pointer;
}

.hue-handle {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
  pointer-events: none;
  background: #fff;
}

.color-input {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.hex-input {
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  &::placeholder {
    color: #bfbfbf;
  }
}
</style>
