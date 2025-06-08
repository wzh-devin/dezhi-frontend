<script setup lang="ts">
/**
 * 2025/5/21 17:10
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材管理
 * @version 1.0
 * @since 1.0
 */
import { onMounted, reactive, ref } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { IFileInfo } from '@/interfaces/pages/material-page.ts'
import useMaterialStore from '@/store/material'
import { errMsgExtract } from '@/global/string-format.ts'
import dayjs from 'dayjs'
import { convertBytesToKb } from '@/utils/convert.ts'

const materialStore = useMaterialStore()
// 选择的行Keys
const selectedRowKeys = ref<(string | number)[]>([])
// 文件类型过滤器
const fileTypeFilter = ref<string>('')
// 查询器
const searchQuery = ref<string>('')
// 页面信息
const pageInfo = reactive({
  pageNum: ref(1),
  pageSize: ref(10),
  total: ref(0),
  dataSource: reactive<IFileInfo[]>([]),
  loading: ref<boolean>(false),
  pageConfig: [
    {
      title: '文件展示',
      dataIndex: 'image',
      key: 'image',
      width: 80,
    },
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '文件地址',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      width: 300,
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 120,
    },
    {
      title: '存储类型',
      dataIndex: 'storageType',
      key: 'storageType',
      width: 120,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 180,
    },
  ],
})

/**
 * 初始化页面
 */
const pageInit = async (pageNum: number, pageSize: number) => {
  console.log('初始化页面')
  pageInfo.loading = true
  materialStore.getMaterialListAction({ pageNum: pageNum, pageSize: pageSize, status: 1 }).then(
    (res) => {
      // 重置属性
      pageInfo.dataSource = res.dataList
      pageInfo.pageNum = res.pageNum
      pageInfo.pageSize = res.pageSize
      pageInfo.total = res.total

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
  pageInit(1, 10)
})

/**
 * 表格选择处理
 * @param selectedKeys 选中的行key数组
 */
const onSelectChange = (selectedKeys: (string | number)[]) => {
  selectedRowKeys.value = selectedKeys
}

const handleUpload = () => {
  // 处理上传逻辑
}

const handleBatchDelete = () => {
  // 处理批量删除逻辑
}

const handleRecycleBin = () => {
  // 处理回收站逻辑
}

const onSearch = (value: string) => {
  // 处理搜索逻辑
  console.log('搜索:', value)
}

/**
 * 分页点击处理
 * @param page 当前页码
 * @param pageSize 每页数据量
 */
const paginationHandler = (page: number, pageSize: number) => {
  pageInit(page, pageSize)
}
</script>

<template>
  <div class="material-management">
    <div class="operation-bar">
      <div class="left-actions">
        <a-button type="primary" class="add-btn" @click="handleUpload">
          <template #icon>
            <plus-outlined />
          </template>
          新增文件
        </a-button>
        <a-button class="delete-btn" :disabled="!selectedRowKeys.length" @click="handleBatchDelete">批量删除</a-button>
        <a-select v-model:value="fileTypeFilter" placeholder="文件类型" class="type-select" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="DOC">文档</a-select-option>
          <a-select-option value="IMAGE">图片</a-select-option>
          <a-select-option value="ZIP">压缩包</a-select-option>
        </a-select>
      </div>
      <div class="right-actions">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="请输入文件名称搜索"
          class="search-input"
          style="width: 300px"
          @search="onSearch"
        />
        <a-button type="primary" class="recycle-btn" @click="handleRecycleBin">
          <template #icon>
            <delete-outlined />
          </template>
          回收站
        </a-button>
      </div>
    </div>

    <div class="table-container">
      <a-table
        :columns="pageInfo.pageConfig"
        :data-source="pageInfo.dataSource"
        :row-key="(record: IFileInfo) => record.id"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
        :scroll="{ y: 420 }"
        :loading="pageInfo.loading"
        class="file-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image :width="40" :height="40" :src="record.url" :preview-mask="false" :key="record.id" />
          </template>
          <template v-if="column.key === 'url'">
            <a :href="record.url" target="_blank" class="file-link">{{ record.url }}</a>
          </template>
          <template v-if="column.key === 'size'"> {{ `${convertBytesToKb(record.size)} KB` }}</template>
          <template v-if="column.key === 'fileType'">
            <a-tag
              :class="[
                'file-type-tag',
                record.fileType === 'DOC' ? 'doc-tag' : record.fileType === 'IMAGE' ? 'image-tag' : 'zip-tag',
              ]"
            >
              {{ record.fileType }}
            </a-tag>
          </template>
          <template v-if="column.key === 'uploadTime'">
            {{ dayjs(record.uploadTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </template>
      </a-table>

      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pageInfo.pageNum"
          v-model:page-size="pageInfo.pageSize"
          show-size-changer
          show-quick-jumper
          :total="pageInfo.total"
          :page-size-options="['10', '25', '30']"
          @change="paginationHandler"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.material-management {
  padding: 24px;
  height: calc(100vh - 64px - 20px);
  background-color: transparent;
  display: flex;
  flex-direction: column;

  .operation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    flex-shrink: 0;

    .left-actions {
      display: flex;
      gap: 12px;
      align-items: center;

      .add-btn {
        background-color: #1677ff;
        border-radius: 6px;
        display: flex;
        align-items: center;

        :deep(.anticon) {
          font-size: 14px;
          vertical-align: middle;
          margin-right: 6px;
        }
      }

      .delete-btn {
        border-radius: 6px;
        display: flex;
        align-items: center;
      }

      .type-select {
        border-radius: 6px;
      }
    }

    .right-actions {
      display: flex;
      gap: 12px;
      align-items: center;

      .search-input {
        border-radius: 6px;

        :deep(.ant-input) {
          border-radius: 6px 0 0 6px;
        }

        :deep(.ant-input-search-button) {
          border-radius: 0 6px 6px 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .anticon {
            margin-right: 0;
          }
        }
      }

      .recycle-btn {
        border-radius: 6px;
        background-color: #ff4d4f;
        border-color: #ff4d4f;
        display: flex;
        align-items: center;

        :deep(.anticon) {
          font-size: 14px;
          vertical-align: middle;
          margin-right: 6px;
        }

        &:hover {
          background-color: #ff7875;
          border-color: #ff7875;
        }
      }
    }
  }

  .table-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .file-table {
    background-color: transparent;
    border-radius: 0;
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.ant-table) {
      background: #fff;
      flex: 1;

      .ant-table-selection-column {
        padding-left: 16px !important;
        padding-right: 0 !important;
        width: 48px !important;
      }

      .ant-checkbox-wrapper {
        margin-inline-start: 0 !important;
      }

      .ant-table-thead > tr > th {
        background: #fafafa;
        white-space: nowrap;
        padding: 12px 16px;
        font-weight: 500;
        color: #1f2329;
        height: 48px;

        &.ant-table-selection-column {
          padding-right: 0;
        }

        &::before {
          display: none;
        }
      }

      .ant-table-tbody > tr > td {
        padding: 8px 16px;
        height: 56px;

        &.ant-table-selection-column {
          padding-right: 0;
        }
      }

      .ant-table-tbody > tr {
        &:hover > td {
          background: #fafafa;
        }
      }
    }

    :deep(.ant-table-cell) {
      .anticon {
        font-size: 16px;
        vertical-align: middle;
      }

      font-size: 14px;
    }

    .file-link {
      color: #1677ff;
      text-decoration: none;
      display: inline-flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
      }
    }

    .file-type-tag {
      border-radius: 4px;
      padding: 1px 6px;
      display: inline-flex;
      align-items: center;
      font-size: 12px;

      &.doc-tag {
        color: #1677ff;
        background: #e6f4ff;
        border-color: #91caff;
      }

      &.image-tag {
        color: #52c41a;
        background: #f6ffed;
        border-color: #b7eb8f;
      }

      &.zip-tag {
        color: #faad14;
        background: #fffbe6;
        border-color: #ffe58f;
      }
    }

    :deep(.ant-image) {
      cursor: pointer;

      img {
        object-fit: cover;
        border-radius: 4px;
      }
    }

    :deep(.ant-image-preview-operations) {
      background: rgba(0, 0, 0, 0.5);
    }

    :deep(.preview-toolbar-btn) {
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 0;
    padding: 16px;
    background-color: transparent;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;

    :deep(.ant-pagination) {
      .ant-pagination-item {
        border-radius: 6px;
        margin-inline-end: 8px;
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        border-radius: 6px;
      }

      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        border-radius: 6px;
      }
    }
  }
}
</style>
