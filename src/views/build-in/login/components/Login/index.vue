<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '@/store'
import { local } from '@/utils'

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()

function toOtherForm(type: any) {
  emit('update:modelValue', type)
}

const { t } = useI18n()
const rules = computed(() => {
  return {
    account: {
      required: true,
      trigger: 'blur',
      message: t('login.accountRuleTip'),
    },
    pwd: {
      required: true,
      trigger: 'blur',
      message: t('login.passwordRuleTip'),
    },
  }
})

const accountRef = ref({
  account: 'super',
  pwd: '123456',
})

const isRemember = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInst | null>(null)

function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    isLoading.value = true

    const { account, pwd } = accountRef.value

    if (isRemember.value)
      local.set('loginAccount', { account, pwd })
    else
      local.remove('loginAccount')

    await authStore.login(account, pwd)

    isLoading.value = false
  })
}

onMounted(() => {
  checkUserAccount()
})

function checkUserAccount() {
  const loginAccount = local.get('loginAccount')
  if (!loginAccount)
    return

  accountRef.value = loginAccount
  isRemember.value = true
}
</script>

<template>
  <div>
    <!-- depth="3" Naive UI 标题组件特有的属性，用来控制文字颜色的深度（层次） -->
    <n-h2 depth="3" class="text-center">
      <!-- Vue I18n 的写法，用来显示国际化后的登录页标题文字，比如 “登录” 或 “Sign In”。和样式本身没有直接关系，只是告诉你要显示什么文本 -->
      {{ $t('login.signInTitle') }}
    </n-h2>

    <!-- n-form: 表单组件 -->
    <!-- ref="formRef"：给本表单组件绑定一个引用 ID，用于在 JavaScript 中直接访问该组件的 DOM 实例或组件实例；
     没有冒号，说明它是一个字符串字面量，不是响应式变量；
     ue 在组件挂载后，会自动把 <n-form> 组件实例塞进 formRef.value
      -->
    <!-- :rules="rules": 绑定表单的验证规则 -->
    <!-- :show-label="false": 不显示表单项的标签 -->
    <n-form
      ref="formRef"
      :rules="rules"
      :model="accountRef"
      :show-label="false"
      size="large"
    >
      <!-- 账号 -->
      <n-form-item
        path="account"
      >
        <n-input
          v-model:value="accountRef.account"
          clearable :placeholder="$t('login.accountPlaceholder')"
          :input-props="{ autocomplete: 'username' }"
        />
      </n-form-item>

      <!-- 密码 -->
      <!-- path="pwd" 用于表单校验，告诉 Naive UI 这个输入框绑定的数据字段是 pwd -->
      <!-- clearable 输入框右侧会出现一个 ✕ 清除按钮，用户点击可以一键清空已输入的密码。这是纯 UI 交互优化 -->
      <!-- show-password-on="click" Naive UI 密码框的独有属性。它会在输入框内右侧显示一个默认的眼睛图标 -->
      <!-- :input-propsn-input 是 Naive UI 包装好的组件，但它底层还是会渲染出一个原生的 <input> 元素。如果你想给这个原生 <input> 加一些 HTML 自带的功能（比如 autocomplete），不能直接写在 <n-input> 上，因为 Naive UI 不认识。这时候就要用 input-props 这个传话接口，把属性透传给内部的原始 <input> 标签。 -->
      <!--  -->
      <n-form-item path="pwd">
        <n-input
          v-model:value="accountRef.pwd"
          type="password"
          :placeholder="$t('login.passwordPlaceholder')"
          clearable
          show-password-on="click"
          :input-props="{ autocomplete: 'current-password' }"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>

      <!-- n-space Naive UI 的间距布局组件 -->
      <!-- vertical 属性让子元素垂直排列（类似 flex-direction: column） -->
      <!-- :size="20" 设置子元素之间的垂直间距为 20px（冒号表示绑定的是数字而非字符串） -->
      <n-space
        vertical
        :size="20"
      >
        <!-- flex-y-center： 垂直居中 -->
        <!-- justify-between： 两端对齐 -->
        <div class="flex-y-center justify-between">
          <!-- n-checkbox：复选框 -->
          <n-checkbox v-model:checked="isRemember">
            {{ $t('login.rememberMe') }}
          </n-checkbox>
          <!-- n-button：按钮 -->
          <!-- type="primary": 按钮主题色 -->
          <!-- text: 属性将按钮变为文本按钮，没有边框和背景，只显示文字 -->
          <n-button
            type="primary"
            text
            @click="toOtherForm('resetPwd')"
          >
            {{ $t('login.forgotPassword') }}
          </n-button>
        </div>
        <!-- block：让按钮变成“块级”元素 -->
        <!-- size：按钮尺寸 -->
        <!-- :loading：相当于 v-bind:loading,将加载状态和响应式变量 isLoading 绑定 -->
        <!-- :disable: 控制按钮的禁用状态 -->
        <n-button
          block
          type="primary"
          size="large"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleLogin"
        >
          {{ $t('login.signIn') }}
        </n-button>
        <!--
        n-flex: Naive UI 的弹性布局组件
          默认设置：
            display: flex;
            flex-direction: row // 横向排列
            align-items: center  // 垂直居中
         -->
        <n-flex>
          <n-text>{{ $t('login.noAccountText') }}</n-text>
          <n-button type="primary" text @click="toOtherForm('register')">
            {{ $t('login.signUp') }}
          </n-button>
        </n-flex>
      </n-space>
    </n-form>

    <!-- n-divider： Naive UI 的分割组件 -->
    <n-divider>
      <!-- op-80：自定义的 CSS 类 opacity: 0.8 的缩写 -->
      <span
        op-80
      >
        {{ $t('login.or') }}
      </span>
    </n-divider>

    <n-space justify="center">
      <!-- circle：让按钮变成正圆形 -->
      <n-button circle>
        <!-- template：具名插槽 -->
        <template #icon>
          <!-- n-icon: Naive UI 图标包裹组件，用于统一管理内部图标的样式和颜色 -->
          <n-icon><icon-park-outline-wechat /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-tencent-qq /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-github-one /></n-icon>
        </template>
      </n-button>
    </n-space>
  </div>
</template>

<style scoped></style>
