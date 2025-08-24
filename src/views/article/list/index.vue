<script setup lang="ts">
/**
 * 2025/7/14 0:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章管理
 * @version 1.0
 * @since 1.0
 */
import { onMounted, reactive, ref, computed, h } from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons-vue'
import useArticleStore from '@/store/article/list'
import { errMsgExtract } from '@/global/string-format.ts'
import dayjs from 'dayjs'
import { ContentHeader, ContentTable } from '@/components/content-cmp'
import type {
  ButtonConfig,
  FilterConfig,
  SearchConfig,
  ColumnConfig,
  PaginationConfig,
  RowSelectionConfig,
} from '@/components/content-cmp'
import type { ApiResultObject, ArticleVO, CategoryVO } from '@/service/typings.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const articleStore = useArticleStore()
const router = useRouter()

// 选择的行Keys
const selectedRowKeys = ref<(string | number)[]>([])
// 分类过滤器
const categoryFilter = ref<string>()
// 搜索关键词
const searchKeyword = ref<string>()
// 分类列表
const categoryList = ref<CategoryVO[]>([])

// 页面信息
const pageInfo = reactive({
  addition: {
    pageNum: ref(1),
    pageSize: ref(10),
  },
  total: ref(0),
  dataSource: reactive<ArticleVO[]>([]),
  loading: ref<boolean>(false),
})

// 表格列配置
const tableColumns: ColumnConfig[] = [
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title',
    width: 300,
    ellipsis: true,
  },
  {
    title: '文章分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '文章标签',
    dataIndex: 'tagList',
    key: 'tagList',
    width: 200,
  },
  {
    title: '是否置顶',
    dataIndex: 'isStick',
    key: 'isStick',
    width: 100,
  },
  {
    title: '文章状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 200,
  },
]

/**
 * 初始化页面
 */
const pageInit = async (addition: { pageNum: number; pageSize: number }) => {
  pageInfo.loading = true
  articleStore
    .getArticleListAction({
      ...addition,
      delFlag: 'NORMAL',
      categoryName: categoryFilter.value,
      title: searchKeyword.value,
    })
    .then(
      (res) => {
        // 重置属性
        pageInfo.dataSource = res.data ?? []
        Object.assign(pageInfo.addition, res.addition ?? {})
        // 停止加载
        pageInfo.loading = false
      },
      (error) => {
        errMsgExtract(error)
        pageInfo.loading = false
      },
    )
}

/**
 * 页面挂载初始化
 */
onMounted(() => {
  pageInit(pageInfo.addition)
})

/**
 * 表格选择处理
 * @param selectedKeys 选中的行key数组
 */
const onSelectChange = (selectedKeys: (string | number)[]) => {
  selectedRowKeys.value = selectedKeys
}

// 头部配置
const headerConfig = computed(() => ({
  leftButtons: [
    {
      key: 'add',
      label: '撰写文章',
      type: 'primary' as const,
      icon: PlusOutlined,
      onClick: handleWriteArticle,
    },
    {
      key: 'batch-delete',
      type: 'primary' as const,
      danger: true,
      label: '批量删除',
    },
  ] as ButtonConfig[],
  filters: [
    {
      key: 'categoryName',
      placeholder: '文章分类',
      width: '150px',
      options: [
        { label: '全部分类', value: '' },
        ...categoryList.value.map((cat) => ({ label: cat.name || '', value: cat.name || '' })),
      ],
    },
  ] as FilterConfig[],
  search: {
    placeholder: '请输入文章标题搜索',
    width: '300px',
    onSearch: onSearch,
  } as SearchConfig,
  rightButtons: [
    {
      key: 'recycle',
      label: '回收站',
      type: 'primary' as const,
      danger: true,
      icon: DeleteOutlined,
      onClick: handleRecycleBin,
    },
  ] as ButtonConfig[],
  selectedCount: selectedRowKeys.value.length,
  content: `您确定要删除选中的 ${selectedRowKeys.value.length} 篇文章吗？删除后将移入回收站。`,
}))

// 表格配置
const tableConfig = computed(() => ({
  dataSource: pageInfo.dataSource,
  columns: tableColumns,
  rowKey: (record: ArticleVO) => record.id as string,
  loading: pageInfo.loading,
  rowSelection: {
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
  } as RowSelectionConfig,
  pagination: {
    current: pageInfo.addition.pageNum,
    pageSize: pageInfo.addition.pageSize,
    total: pageInfo.total,
    onChange: paginationHandler,
  } as PaginationConfig,
  scrollY: 420,
}))

const handleWriteArticle = async () => {
  const article = (await articleStore.saveArticleInitAction()).data
  await router.push({ name: 'article-write', params: { articleId: article?.id } })
}

// 批量删除确认处理
const handleBatchDeleteConfirm = async () => {
  pageInfo.loading = true
  try {
    await articleStore.delArticleAction((selectedRowKeys.value as string[]) ?? [])
    // 清空选中的行
    selectedRowKeys.value = []
    // 重新加载数据
    await pageInit(pageInfo.addition)
    message.success('删除成功')
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  } finally {
    pageInfo.loading = false
  }
}

const handleRecycleBin = () => {
  // 处理回收站逻辑
  router.push({ name: 'article-recycle' })
}

const onSearch = (value: string) => {
  searchKeyword.value = value
  pageInit({ pageNum: 1, pageSize: pageInfo.addition.pageSize })
}

/**
 * 筛选器变化处理
 */
const onFilterChange = (key: string, value: string) => {
  if (key === 'categoryName') {
    categoryFilter.value = value ?? ''
  }
  pageInit({ pageNum: 1, pageSize: pageInfo.addition.pageSize })
}

/**
 * 分页点击处理
 * @param page 当前页码
 * @param pageSize 每页数据量
 */
const paginationHandler = (page: number, pageSize: number) => {
  pageInit({ pageNum: page, pageSize: pageSize })
}

/**
 * 编辑文章
 */
const handleEdit = (record: ArticleVO) => {
  router.push({ name: 'article-write', params: { articleId: record.id } })
}

/**
 * 发布文章
 */
const handlePublish = async (record: ArticleVO) => {
  try {
    await articleStore.updateStatusAction(record.id as string, 'IS_PUBLISH')
    message.success('发布成功')
    await pageInit(pageInfo.addition)
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  }
}

/**
 * 下架文章
 */
const handleUnpublish = async (record: ArticleVO) => {
  try {
    await articleStore.updateStatusAction(record.id as string, 'DRAFT')
    message.success('下架成功')
    await pageInit(pageInfo.addition)
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  }
}

/**
 * 获取状态文本
 */
const getStatusText = (status?: number | string) => {
  if (status === 1 || status === '1') return '已发布'
  return '草稿'
}

/**
 * 获取状态样式
 */
const getStatusClass = (status?: number | string) => {
  if (status === 1 || status === '1') return 'published-tag'
  return 'draft-tag'
}
</script>

<template>
  <div class="article-management">
    <!-- 头部操作栏 -->
    <ContentHeader
      :left-buttons="headerConfig.leftButtons"
      :filters="headerConfig.filters"
      :search="headerConfig.search"
      :right-buttons="headerConfig.rightButtons"
      :selected-count="headerConfig.selectedCount"
      :content="headerConfig.content"
      @filter-change="onFilterChange"
      @batch-delete-confirm="handleBatchDeleteConfirm"
    />

    <!-- 表格内容 -->
    <ContentTable
      :data-source="tableConfig.dataSource"
      :columns="tableConfig.columns"
      :row-key="tableConfig.rowKey"
      :loading="tableConfig.loading"
      :row-selection="tableConfig.rowSelection"
      :pagination="tableConfig.pagination"
      :scroll-y="tableConfig.scrollY"
    >
      <!-- 文章标题列 -->
      <template #bodyCell-title="{ record }">
        <div class="article-title">
          <span class="title-text">{{ record.title }}</span>
          <a-tag v-if="record.isStick === 1 || record.isStick === '1'" color="red" size="small">置顶</a-tag>
        </div>
      </template>

      <!-- 文章分类列 -->
      <template #bodyCell-category="{ record }">
        <a-tag v-if="record.category" :color="record.category.color" class="category-tag">
          {{ record.category.name }}
        </a-tag>
        <span v-else>-</span>
      </template>

      <!-- 文章标签列 -->
      <template #bodyCell-tagList="{ record }">
        <div class="tag-list">
          <a-tag v-for="tag in record.tagList" :key="tag.id" :color="tag.color" size="small" class="tag-item">
            {{ tag.name }}
          </a-tag>
          <span v-if="!record.tagList || record.tagList.length === 0">-</span>
        </div>
      </template>

      <!-- 是否置顶列 -->
      <template #bodyCell-isStick="{ record }">
        <a-tag v-if="record.isStick === 1 || record.isStick === '1'" color="red">置顶</a-tag>
        <span v-else>-</span>
      </template>

      <!-- 文章状态列 -->
      <template #bodyCell-status="{ record }">
        <a-tag :class="getStatusClass(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- 更新时间列 -->
      <template #bodyCell-updateTime="{ record }">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <!-- 操作列 -->
      <template #bodyCell-action="{ record }">
        <div class="action-buttons">
          <a-button type="link" size="small" :icon="h(EditOutlined)" @click="handleEdit(record)"> 编辑</a-button>
          <a-button
            v-if="record.status !== 1 && record.status !== '1'"
            type="link"
            size="small"
            :icon="h(CloudUploadOutlined)"
            @click="handlePublish(record)"
          >
            发布
          </a-button>
          <a-button
            v-else
            type="link"
            size="small"
            danger
            :icon="h(EyeInvisibleOutlined)"
            @click="handleUnpublish(record)"
          >
            下架
          </a-button>
        </div>
      </template>
    </ContentTable>
  </div>
</template>

<style scoped lang="less">
.article-management {
  padding: 24px;
  height: calc(100vh - 64px - 20px);
  background-color: transparent;
  display: flex;
  flex-direction: column;

  .article-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .title-text {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .tag-item {
      margin: 0;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .category-tag {
    margin: 0;
    border-radius: 4px;
    font-size: 12px;
  }

  .published-tag {
    color: #52c41a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }

  .draft-tag {
    color: #faad14;
    background: #fffbe6;
    border-color: #ffe58f;
  }
}
</style>
