<script lang="ts" setup>
import { ref } from 'vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, BellOutlined } from '@ant-design/icons-vue'
import Menu from '@/views/main/cmps/Menu.vue'

const collapsed = ref(false)

// const stats = [
//   {
//     icon: FileTextOutlined,
//     label: '文章总数',
//     value: 2478,
//     trend: '+12.5%',
//     trendColor: '#52c41a',
//     iconBg: '#e6f7ff',
//     iconColor: '#1890ff',
//   },
//   {
//     icon: MessageOutlined,
//     label: '待审核评论',
//     value: 35,
//     trend: '-2.3%',
//     trendColor: '#ff4d4f',
//     iconBg: '#fffbe6',
//     iconColor: '#faad14',
//   },
//   {
//     icon: UserAddOutlined,
//     label: '新增用户',
//     value: 156,
//     trend: '+8.2%',
//     trendColor: '#52c41a',
//     iconBg: '#f6ffed',
//     iconColor: '#52c41a',
//   },
//   {
//     icon: CheckCircleOutlined,
//     label: '系统状态',
//     value: '正常',
//     trend: '',
//     trendColor: '',
//     iconBg: '#f0f5ff',
//     iconColor: '#2f54eb',
//   },
// ]
//
// const articles = [
//   {
//     key: '1',
//     title: '如何提升网站性能：最佳实践指南',
//     category: '技术',
//     date: '2023-12-01',
//     status: '已发布',
//     tagType: 'blue',
//     statusType: 'success',
//   },
//   {
//     key: '2',
//     title: '2024年前端开发趋势展望',
//     category: '行业动态',
//     date: '2023-12-02',
//     status: '草稿',
//     tagType: 'cyan',
//     statusType: 'default',
//   },
//   {
//     key: '3',
//     title: 'AI在现代企业中的应用',
//     category: '人工智能',
//     date: '2023-12-03',
//     status: '已发布',
//     tagType: 'geekblue',
//     statusType: 'success',
//   },
// ]
//
// const articleColumns = [
//   { title: '标题', dataIndex: 'title', key: 'title' },
//   {
//     title: '分类',
//     dataIndex: 'category',
//     key: 'category',
//     customRender: ({ text, record }: { text: string; record: Record<string, unknown> }) =>
//       h('a-tag', { color: record.tagType }, text),
//   },
//   { title: '发布日期', dataIndex: 'date', key: 'date' },
//   {
//     title: '状态',
//     dataIndex: 'status',
//     key: 'status',
//     customRender: ({ text, record }: { text: string; record: Record<string, unknown> }) =>
//       h('a-tag', { color: record.statusType === 'success' ? 'success' : 'default' }, text),
//   },
// ]
</script>

<template>
  <a-layout class="main-layout">
    <a-layout-sider class="main-sider" width="220" :collapsed="collapsed" collapsible :trigger="null">
      <!-- 标题 -->
      <div class="main-sider__logo">
        <img src="/logo.png" alt="logo" />
        <span v-if="!collapsed">DeZhi后台</span>
      </div>
      <!-- 菜单 -->
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="main-header">
        <div class="main-header__left">
          <a-button type="text" shape="circle" class="main-header__trigger" @click="collapsed = !collapsed">
            <template #icon>
              <MenuUnfoldOutlined v-if="collapsed" />
              <MenuFoldOutlined v-else />
            </template>
          </a-button>
          <div class="main-header__title">管理控制台</div>
        </div>
        <div class="main-header__right">
          <a-badge dot>
            <a-button type="text" shape="circle">
              <template #icon>
                <BellOutlined />
              </template>
            </a-button>
          </a-badge>
          <a-avatar class="main-header__avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="main-header__user">管理员</span>
        </div>
      </a-layout-header>
      <a-layout-content class="main-content">
        <!--        <a-row class="main-stats" gutter="24" align="middle" justify="center">-->
        <!--          <a-col v-for="(item, idx) in stats" :key="idx" :span="6" class="main-stats__col">-->
        <!--            <a-card :bordered="false" class="main-stats__card">-->
        <!--              <div class="main-stats__card-inner">-->
        <!--                <a-avatar :style="{ background: item.iconBg, color: item.iconColor }" size="large">-->
        <!--                  <component :is="item.icon" />-->
        <!--                </a-avatar>-->
        <!--                <div>-->
        <!--                  <div class="main-stats__label">{{ item.label }}</div>-->
        <!--                  <div class="main-stats__value">{{ item.value }}</div>-->
        <!--                  <div v-if="item.trend" class="main-stats__trend" :style="{ color: item.trendColor }">-->
        <!--                    {{ item.trend }}-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </a-card>-->
        <!--          </a-col>-->
        <!--        </a-row>-->
        <!--        <a-card :bordered="false" class="main-articles">-->
        <!--          <div class="main-articles__title">最新文章</div>-->
        <!--          <a-table :pagination="false" :data-source="articles" :columns="articleColumns" />-->
        <!--          <div class="main-articles__pagination">-->
        <!--            <a-pagination :current="1" :total="3" :page-size="3" show-less-items />-->
        <!--          </div>-->
        <!--        </a-card>-->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.main-layout {
  min-height: 100vh;
  background: #f5f6fa;

  .main-sider {
    background: #fff;
    box-shadow: 2px 0 8px #f0f1f2;
    position: relative;

    &__logo {
      height: 64px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      font-size: 20px;
      font-weight: bold;

      img {
        height: 32px;
        margin-right: 8px;
      }
    }

    .ant-menu {
      border: none;
    }

    &__trigger {
      position: absolute;
      bottom: 16px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;

      &-btn {
        font-size: 18px;
      }
    }
  }

  .main-header {
    background: #fff;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    &__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__trigger {
      font-size: 18px;
      margin-right: 8px;
    }

    &__title {
      font-size: 18px;
      font-weight: 500;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__avatar {
      background: #e6f7ff;
      color: #1890ff;
    }

    &__user {
      font-size: 14px;
      color: #333;
    }
  }

  //.main-content {
  //  padding: 32px 24px 0 24px;
  //
  //  .main-stats {
  //    margin-bottom: 32px;
  //    display: flex;
  //    flex-direction: row;
  //    align-items: stretch;
  //    justify-content: center;
  //
  //    &__col {
  //      display: flex;
  //      align-items: stretch;
  //    }
  //
  //    &__card {
  //      border-radius: 12px;
  //      width: 100%;
  //      height: 100%;
  //      display: flex;
  //      align-items: center;
  //
  //      .main-stats__card-inner {
  //        display: flex;
  //        align-items: center;
  //        gap: 16px;
  //        width: 100%;
  //      }
  //    }
  //
  //    &__label {
  //      font-size: 14px;
  //      color: #888;
  //    }
  //
  //    &__value {
  //      font-size: 28px;
  //      font-weight: bold;
  //    }
  //
  //    &__trend {
  //      font-size: 12px;
  //    }
  //  }
  //
  //  .main-articles {
  //    border-radius: 12px;
  //
  //    &__title {
  //      font-size: 16px;
  //      font-weight: 500;
  //      margin-bottom: 16px;
  //    }
  //
  //    &__pagination {
  //      display: flex;
  //      justify-content: flex-end;
  //      margin-top: 16px;
  //    }
  //  }
  //}
}
</style>
