<script setup lang="ts">
/**
 * 2025/7/14 0:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章回收站页面
 * @version 1.0
 * @since 1.0
 */
import { onMounted, reactive, ref, computed } from 'vue'
import useArticleStore from '@/store/article/list'
import useCategoryStore from '@/store/article/category'
import { errMsgExtract } from '@/global/string-format.ts'
import dayjs from 'dayjs'
import { ContentHeader, ContentTable, type RowSelectionConfig } from '@/components/content-cmp'
import type { ButtonConfig, FilterConfig, SearchConfig, ColumnConfig, PaginationConfig } from '@/components/content-cmp'
import type { ApiResultObject, ArticleVO, CategoryVO } from '@/service/typings.ts'
import { message } from 'ant-design-vue'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()

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
    total: ref(0),
  },
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
    title: '删除时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
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
      status: 'DRAFT',
      delFlag: 'IS_DELETED',
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
 * 初始化分类列表
 */
const initCategoryList = async () => {
  try {
    const res = await categoryStore.getCategoryListAction({ pageNum: 1, pageSize: 100 })
    categoryList.value = res.data ?? []
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  }
}

/**
 * 页面挂载初始化
 */
onMounted(() => {
  pageInit(pageInfo.addition)
  initCategoryList()
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
      key: 'recover',
      label: '恢复文章',
      type: 'primary' as const,
      onClick: handleRecoverArticles,
      disabled: selectedRowKeys.value.length === 0,
    },
    {
      key: 'clear-recycle',
      label: '清空回收站',
      type: 'primary' as const,
      danger: true,
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
  content: '回收站清空后无法回溯，请谨慎操作！！！',
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
    total: pageInfo.addition.total,
    onChange: paginationHandler,
  } as PaginationConfig,
  scrollY: 420,
}))

// 清空回收站
const handleClearRecycleConfirm = async () => {
  pageInfo.loading = true
  try {
    await articleStore.cleanRecycleAction([])
    // 重新加载数据
    await pageInit(pageInfo.addition)
    message.success('清空回收站成功')
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  } finally {
    pageInfo.loading = false
  }
}

// 恢复文章
const handleRecoverArticles = async () => {
  if (selectedRowKeys.value.length === 0) {
    return
  }
  pageInfo.loading = true
  try {
    await articleStore.recoverArticleAction(selectedRowKeys.value as string[])
    // 清空选中的行
    selectedRowKeys.value = []
    // 重新加载数据
    await pageInit(pageInfo.addition)
    message.success('文章恢复成功')
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  } finally {
    pageInfo.loading = false
  }
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
  <div class="article-recycle">
    <!-- 头部操作栏 -->
    <ContentHeader
      :left-buttons="headerConfig.leftButtons"
      :filters="headerConfig.filters"
      :search="headerConfig.search"
      :content="headerConfig.content"
      @filter-change="onFilterChange"
      @batch-delete-confirm="handleClearRecycleConfirm"
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

      <!-- 删除时间列 -->
      <template #bodyCell-updateTime="{ record }">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </ContentTable>
  </div>
</template>

<style scoped lang="less">
.article-recycle {
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