<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 撰写文章
 * @version 1.0
 * @since 1.0
 */
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { Editor } from '@tiptap/vue-3'
import type { ArticleSaveVO, FileInfoVO } from '@/service/typings.ts'
import EditorToolbar from './cmp/EditorToolbar.vue'
import TiptapEditor from './cmp/TiptapEditor.vue'
import ImageSelectModal from './cmp/ImageSelectModal.vue'
import MarkdownHelpModal from './cmp/MarkdownHelpModal.vue'
import SaveArticleModal from './cmp/SaveArticleModal.vue'
import useArticleStore from '@/store/article/list'
import { useRoute, useRouter } from 'vue-router'
import useCategoryStore from '@/store/article/category'
import useTagStore from '@/store/article/tags'

const articleStore = useArticleStore()
const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

// 编辑器实例
const editorInstance = ref<Editor | null>(null)
const editorContent = ref('')

// 弹窗状态管理
const isMarkdownModalVisible = ref(false)
const isSaveModalVisible = ref(false)
const isImageModalVisible = ref(false)

// 加载状态管理
const isInitializing = ref(false)
const isSaving = ref(false)

// 当前文章ID
const currentArticleId = ref<string>('')

// 文章表单数据
const articleFormData = reactive<{
  title: string
  summary: string
  categoryId: string
  tagIdList: string[]
  isStick: number
  status: 'DRAFT' | 'IS_PUBLISHED'
  url: string
  isAi: number
  categoryOptional: Array<{ label: string; value: string }>
  tagOptional: Array<{ label: string; value: string }>
}>({
  title: '',
  summary: '',
  categoryId: '',
  tagIdList: [],
  isStick: 0,
  status: 'DRAFT',
  url: '',
  isAi: 0,
  categoryOptional: [],
  tagOptional: [],
})

// 编辑器准备完成回调
const handleEditorReady = (editor: Editor) => {
  editorInstance.value = editor
}

// 工具栏功能函数
const handleUndo = () => editorInstance.value?.chain().focus().undo().run()
const handleRedo = () => editorInstance.value?.chain().focus().redo().run()

const handleToggleBold = () => editorInstance.value?.chain().focus().toggleBold().run()
const handleToggleItalic = () => editorInstance.value?.chain().focus().toggleItalic().run()
const handleToggleUnderline = () => editorInstance.value?.chain().focus().toggleUnderline().run()
const handleToggleStrike = () => editorInstance.value?.chain().focus().toggleStrike().run()
const handleToggleHighlight = () => editorInstance.value?.chain().focus().toggleHighlight().run()

const handleSetHeading = (level: number) => {
  if (level === 0) {
    editorInstance.value?.chain().focus().setParagraph().run()
  } else {
    editorInstance.value
      ?.chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run()
  }
}

const handleToggleBulletList = () => editorInstance.value?.chain().focus().toggleBulletList().run()
const handleToggleOrderedList = () => editorInstance.value?.chain().focus().toggleOrderedList().run()
const handleToggleBlockquote = () => editorInstance.value?.chain().focus().toggleBlockquote().run()
const handleToggleCodeBlock = () => editorInstance.value?.chain().focus().toggleCodeBlock().run()

const handleSetTextAlign = (alignment: string) => {
  editorInstance.value?.chain().focus().setTextAlign(alignment).run()
}

// 插入功能
const handleInsertImage = () => {
  isImageModalVisible.value = true
}

const handleConfirmInsertImage = (selectedImages: FileInfoVO[]) => {
  if (selectedImages.length > 0) {
    selectedImages.forEach((image, index) => {
      if (image.url) {
        editorInstance.value
          ?.chain()
          .focus()
          .setImage({
            src: image.url,
            alt: image.name || `图片${index + 1}`,
          })
          .run()

        if (index < selectedImages.length - 1) {
          editorInstance.value?.chain().focus().insertContent('<br>').run()
        }
      }
    })

    message.success(`已成功插入 ${selectedImages.length} 张图片`)
  }
}

const handleInsertLink = () => {
  const linkUrl = window.prompt('请输入链接URL:')
  if (linkUrl) {
    editorInstance.value?.chain().focus().setLink({ href: linkUrl }).run()
  }
}

// 文章保存功能
const handleSaveArticle = async () => {
  try {
    // 初始化弹窗中的下拉菜单数据
    articleFormData.categoryOptional = await categoryStore.getCategoryOptionalAction()
    articleFormData.tagOptional = await tagStore.getTagOptionalAction()

    // 如果是编辑模式，获取文章详细信息并回填到弹窗
    if (currentArticleId.value) {
      const result = await articleStore.getArticleInfoAction(currentArticleId.value)
      if (result.data) {
        // 回填文章信息到弹窗表单
        // 注意：不覆盖标题，保持用户在页面标题框中输入的内容
        articleFormData.summary = result.data.summary || ''
        articleFormData.categoryId = result.data.category?.id || ''
        articleFormData.tagIdList = (result.data.tagList?.map((tag) => tag.id).filter((id) => id) as string[]) || []
        articleFormData.isStick = Number(result.data.isStick) || 0
        articleFormData.status = result.data.status === 1 ? 'IS_PUBLISHED' : 'DRAFT'
        articleFormData.url = result.data.url || ''
        articleFormData.isAi = Number(result.data.isAi) || 0
      }
    }

    isSaveModalVisible.value = true
  } catch (error) {
    console.error('获取文章信息失败:', error)
    message.error('获取文章信息失败，请重试')
  }
}

const handleConfirmSaveArticle = async (formData: ArticleSaveVO) => {
  try {
    isSaving.value = true
    const articleContent = editorContent.value

    // 状态值转换：前端使用字符串，后端需要数字
    const statusMapping = {
      DRAFT: 0,
      IS_PUBLISHED: 1,
    }

    // 构建符合editArticle接口的参数结构
    const saveData = {
      id: currentArticleId.value,
      title: formData.title, // 使用用户在弹窗中输入的标题
      categoryId: formData.categoryId,
      tagIdList: formData.tagIdList,
      content: articleContent,
      summary: formData.summary || '',
      contentMd: articleContent, // 假设内容就是markdown格式
      url: formData.url || '',
      isStick: formData.isStick || 0,
      status: statusMapping[formData.status as keyof typeof statusMapping] || 0,
      isAi: formData.isAi || 0,
    }

    await articleStore.editArticleAction(saveData)

    // 保存成功后，同步更新页面标题
    articleFormData.title = formData.title || ''

    message.success('文章保存成功')

    // 直接跳转到文章列表
    router.push({ name: 'article-list' })
  } catch (error) {
    console.error('文章保存失败:', error)
    message.error('文章保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// Markdown帮助
const handleShowMarkdownHelp = () => {
  isMarkdownModalVisible.value = true
}

// 页面初始化
const initializePage = async () => {
  try {
    isInitializing.value = true

    // 清空编辑器内容
    editorContent.value = ''

    // 检查是否是编辑模式（有articleId参数）
    const articleId = route.params.articleId as string

    if (articleId && articleId !== 'new') {
      // 编辑模式：加载现有文章
      currentArticleId.value = articleId
      const result = await articleStore.getArticleInfoAction(articleId)
      if (result.data) {
        articleFormData.title = result.data.title || ''
        editorContent.value = result.data.content || ''
      }
    } else {
      // 新建模式：调用初始化接口创建新文章
      const result = await articleStore.saveArticleInitAction()
      if (result.data && result.data.id) {
        currentArticleId.value = result.data.id
        // 更新路由参数，避免页面刷新时丢失文章ID
        await router.replace({
          name: route.name,
          params: { ...route.params, articleId: result.data.id },
        })
        message.success('文章初始化成功，开始撰写吧！')
      }
    }
  } catch (error) {
    console.error('页面初始化失败:', error)
    message.error('页面初始化失败，请重试')
  } finally {
    isInitializing.value = false
  }
}

// 页面挂载时初始化
onMounted(() => {
  initializePage()
})
</script>

<template>
  <div class="write-article-container">
    <!-- 初始化加载状态 -->
    <div v-if="isInitializing" class="loading-container">
      <ASpin size="large">
        <template #tip>正在初始化文章...</template>
      </ASpin>
    </div>

    <!-- 主要内容 -->
    <div v-else class="article-content">
      <div class="article-header">
        <!-- 文章标题 -->
        <div class="form-item">
          <AInput v-model:value="articleFormData.title" placeholder="请输入文章标题" />
        </div>
        <div class="header-actions">
          <AButton
            type="primary"
            :loading="isSaving"
            :disabled="isInitializing || !currentArticleId"
            @click="handleSaveArticle"
          >
            保存文章
          </AButton>
        </div>
      </div>

      <div class="article-form">
        <!-- 编辑器工具栏 -->
        <EditorToolbar
          @undo="handleUndo"
          @redo="handleRedo"
          @setHeading="handleSetHeading"
          @toggleBulletList="handleToggleBulletList"
          @toggleOrderedList="handleToggleOrderedList"
          @toggleBlockquote="handleToggleBlockquote"
          @toggleBold="handleToggleBold"
          @toggleItalic="handleToggleItalic"
          @toggleUnderline="handleToggleUnderline"
          @toggleStrike="handleToggleStrike"
          @toggleHighlight="handleToggleHighlight"
          @setTextAlign="handleSetTextAlign"
          @insertLink="handleInsertLink"
          @insertImage="handleInsertImage"
          @toggleCodeBlock="handleToggleCodeBlock"
          @showMarkdownHelp="handleShowMarkdownHelp"
        />

        <!-- Tiptap 编辑器 -->
        <TiptapEditor v-model="editorContent" @ready="handleEditorReady" />
      </div>
    </div>

    <!-- 弹窗组件 -->
    <!-- 图片选择弹窗 -->
    <ImageSelectModal v-model="isImageModalVisible" @confirm="handleConfirmInsertImage" />

    <!-- Markdown 帮助弹窗 -->
    <MarkdownHelpModal v-model="isMarkdownModalVisible" />

    <!-- 保存文章设置弹窗 -->
    <SaveArticleModal v-model="isSaveModalVisible" :initialData="articleFormData" @confirm="handleConfirmSaveArticle" />
  </div>
</template>

<style scoped lang="less">
.write-article-container {
  padding: 24px;
  background: #fff;
  min-height: 100vh;

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;

    .form-item {
      flex: 1;
      margin-bottom: 0;
      margin-right: 16px;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    h1 {
      margin: 0;
      color: #262626;
    }
  }

  .article-form {
    width: 100%;

    .form-item {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #262626;
      }
    }
  }
}
</style>
