<script setup lang="ts">
/**
 * 2025/5/4 17:09
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 邮箱验证码按钮组件
 * @version 1.0
 * @since 1.0
 */
import { defineProps, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getEmailCode } from '@/service/userService.ts'

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 60,
  },
})

// 倒计时
const countdown = ref(0)
let timer: number | null = null

/**
 * 开启倒计时
 */
const startCountdown = async () => {
  // 判断邮箱是否合法
  if (!/^[\w.+_-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,14}$/.test(props.email)) {
    message.warn('请填写正确邮箱')
    return
  }

  // 倒计时已开启 <防呆>
  if (countdown.value > 0) return

  // 获取邮箱验证码
  getEmailCode({ email: props.email }).then(
    () => {
      // 开启倒计时
      countdown.value = props.duration
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0 && timer) {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
      message.success('验证码已发送，请注意查收！！！')
    },
    () => {
      message.error('系统出现异常，验证码发送失败，请联系管理员！！！')
    },
  )
}
</script>

<template>
  <AButton class="code-btn" type="primary" :disabled="countdown > 0" @click="startCountdown">
    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
  </AButton>
</template>

<style scoped lang="less">
.code-btn {
  padding: 0 16px;
  margin-left: 8px;
  min-width: 104px;
  text-align: center;
}
</style>
