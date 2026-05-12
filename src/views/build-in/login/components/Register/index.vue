<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

// t 是一个函数，直接调用 t() 返回翻译文字
const { t } = useI18n()

// Naive UI 的 <n-form> 用的验证规则
const rules = {
  account: {
    // required: true：必填验证
    required: true,
    // trigger: 'blur'：触发验证的时机，'blur' 表示失去焦点时验证，还可以写成 ['blur', 'input'] 表示输入时也验证
    trigger: 'blur',
    // message：违反规则时显示的文字，这里用 t() 做国际化
    message: t('login.accountRuleTip'),
  },
  pwd: {
    required: true,
    trigger: 'blur',
    message: t('login.passwordRuleTip'),
  },
  rePwd: {
    required: true,
    trigger: 'blur',
    message: t('login.checkPasswordRuleTip'),
  },
}
const formValue = ref({
  account: '',
  pwd: '',
  rePwd: '',
})

const isRead = ref(false)

function toLogin() {
  emit('update:modelValue', 'login')
}

function handleRegister() {}
</script>

<template>
  <div>
    <n-h2 depth="3" class="text-center">
      {{ $t('login.registerTitle') }}
    </n-h2>
    <!--
    n-form 的属性绑定
    :rules="rules"：动态绑定验证规则对象（注意前导冒号）
    :model="formValue"：绑定被验证的数据对象。Naive UI 会根据 path 从 model 里取字段值
    :show-label="false"：不显示表单项的 label 文字，因为我们已经有了 placeholder
    size="large"：没有冒号，是一个字符串常量
      -->
    <n-form
      :rules="rules"
      :model="formValue"
      :show-label="false"
      size="large"
    >
      <!-- path 属性指定这个表单项对应 model 里的哪个字段，从而使用 rules.account 的验证规则 -->
      <n-form-item path="account">
        <!-- Naive UI 的 n-input 组件的值绑定属性是 value，所以要用 v-model:value 而不是单独的 v-model -->
        <n-input
          v-model:value="formValue.account"
          clearable
          :placeholder="$t('login.accountPlaceholder')"
          :input-props="{ autocomplete: 'username' }"
        />
      </n-form-item>
      <n-form-item path="pwd">
        <!--
        n-input 的 type="password" 和密码显示切换
        show-password-on="click"：点击图标时切换密码可见/不可见
        :input-props="{autocomplete:'new-password'}"：传递给原生 input 元素的属性，用于浏览器自动填充行为，new-password 表示新密码
        -->
        <n-input
          v-model:value="formValue.pwd"
          type="password"
          :placeholder="$t('login.passwordPlaceholder')"
          clearable
          show-password-on="click"
          :input-props="{ autocomplete: 'new-password' }"
        >
          <!--
        具名插槽 password-invisible-icon 和 password-visible-icon 替换默认眼睛图标
        这里的图标是你自定义的组件，必须先全局注册或局部引入（IconPark 的组件）
        -->
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="rePwd">
        <n-input
          v-model:value="formValue.rePwd"
          type="password"
          :placeholder="$t('login.checkPasswordPlaceholder')"
          clearable
          show-password-on="click"
          :input-props="{ autocomplete: 'new-password' }"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item>
        <!--
          n-space
          vertical :size="20"：垂直间隔 20px 的容器
          class="w-full"：width: 100%
          -->
        <n-space
          vertical
          :size="20"
          class="w-full"
        >
          <!-- n-checkbox 的 v-model:checked -->
          <n-checkbox v-model:checked="isRead">
            {{ $t('login.readAndAgree') }}
            <!--
              n-button 的 text 属性
              text 是无背景的文本按钮，表现为链接样式
             -->
            <n-button
              type="primary"
              text
            >
              {{ $t('login.userAgreement') }}
            </n-button>
          </n-checkbox>
          <n-button
            block
            type="primary"
            @click="handleRegister"
          >
            {{ $t('login.signUp') }}
          </n-button>
          <!--
          n-flex
          justify="center"：水平居中弹性布局，内部元素横向排列
          type 属性决定了按钮的语义样式
          -->
          <n-flex justify="center">
            <n-text>{{ $t('login.haveAccountText') }}</n-text>
            <n-button
              text
              type="primary"
              @click="toLogin"
            >
              {{ $t('login.signIn') }}
            </n-button>
          </n-flex>
        </n-space>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped></style>
