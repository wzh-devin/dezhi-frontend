<script setup lang="ts">
/**
 * 2025/5/21 17:08
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description TODO 控制台
 * @version 1.0
 * @since 1.0
 */
import { ref, onMounted } from 'vue'
import { FileTextOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { getDashboardInfo } from '@/service/dashboardService'
import type { DashboardVO } from '@/service/typings'

// 仪表盘数据
const dashboardData = ref<DashboardVO>({})
const loading = ref(false)

// 统计数据
const statisticsData = ref([
  {
    title: '文章总数',
    value: '0',
    icon: FileTextOutlined,
    color: '#1890ff',
    key: 'articleCount',
  },
  {
    title: '发布文章数',
    value: '0',
    icon: SendOutlined,
    color: '#1890ff',
    key: 'publishArticleCount',
  },
  {
    title: '待审核评论数',
    value: '35',
    icon: MessageOutlined,
    color: '#faad14',
    key: 'commentCount',
  },
])

// 最新评论内容（写死的数据）
const latestComments = ref([
  {
    author: '王小明',
    content: '这篇文章内容非常实用，我已经在项目中实践了部分建议，效果明显。',
    article: '如何提升网站性能：最佳实践指南',
    time: '2023-12-05 14:32',
    avatar: '王',
  },
  {
    author: '李玫华',
    content: '对AI技术在企业应用的分析很到位，期待后续更多相关内容。',
    article: 'AI在现代企业中的应用',
    time: '2023-12-05 10:15',
    avatar: '李',
  },
  {
    author: '张大山',
    content: '前端开发趋势分析很专业，但是对WebAssembly的发展前景分析还有待深入。',
    article: '2024年前端开发趋势展望',
    time: '2023-12-04 22:48',
    avatar: '张',
  },
  {
    author: '赵明月',
    content: '文章对区块链技术的分析很全面，但是对于普通开发者来说实践难度较高。',
    article: 'Web3.0与区块链技术发展前景',
    time: '2023-12-04 18:23',
    avatar: '赵',
  },
])

// 获取仪表盘数据
const handleFetchDashboardData = async () => {
  try {
    loading.value = true
    const result = await getDashboardInfo()
    if (result.data) {
      dashboardData.value = result.data
      // 更新统计数据
      statisticsData.value[0].value = String(result.data.articleCount || 0)
      statisticsData.value[1].value = String(result.data.publishArticleCount || 0)
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const handleFormatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      // 如果是 ISO 格式，尝试替换 T 为空格并截取到秒
      if (dateString.includes('T')) {
        return dateString.replace('T', ' ').split('.')[0]
      }
      return dateString.split('.')[0] || ''
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    // 如果是 ISO 格式，尝试替换 T 为空格并截取到秒
    if (dateString.includes('T')) {
      return dateString.replace('T', ' ').split('.')[0]
    }
    return dateString.split('.')[0] || ''
  }
}

// 获取文章状态
const handleGetArticleStatus = (status?: number | string) => {
  return Number(status) === 1 ? '已发布' : '草稿'
}

// 获取文章标签颜色
const handleGetTagColor = (category?: { name?: string; color?: string }) => {
  // 如果有自定义颜色，直接使用十六进制颜色
  if (category?.color) {
    return category.color
  }
  // 如果没有自定义颜色，使用默认颜色
  return '#1890ff'
}

// 截断文章摘要
const handleTruncateSummary = (summary: string) => {
  if (!summary) return ''
  if (summary.length <= 150) {
    return summary
  }
  return summary.substring(0, 150) + '...'
}

// 页面初始化
onMounted(() => {
  handleFetchDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <div class="statistics-section">
      <ARow :gutter="24">
        <ACol :span="8" v-for="(item, index) in statisticsData" :key="index">
          <ACard class="statistic-card" :loading="loading">
            <div class="statistic-content">
              <div class="statistic-info">
                <div class="statistic-title">{{ item.title }}</div>
                <div class="statistic-value">{{ item.value }}</div>
              </div>
              <div class="statistic-icon" :style="{ color: item.color }">
                <component :is="item.icon" />
              </div>
            </div>
          </ACard>
        </ACol>
      </ARow>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <ARow :gutter="24">
        <!-- 最新发布文章 -->
        <ACol :span="12">
          <ACard class="content-card" :loading="loading">
            <template #title>
              <span class="card-title">最新发布文章</span>
            </template>
            <div class="article-list">
              <div
                class="article-item"
                v-for="(article, index) in dashboardData.articleTop5List"
                :key="article.id || index"
              >
                <div class="article-main">
                  <div class="article-title">{{ article.title }}</div>
                  <div class="article-summary" v-if="article.summary">
                    {{ handleTruncateSummary(article.summary) }}
                  </div>
                  <div class="article-meta">
                    <ATag v-if="article.category?.name" :color="handleGetTagColor(article.category)">
                      {{ article.category.name }}
                    </ATag>
                    <span class="article-date">{{ handleFormatDate(article.updateTime) }}</span>
                    <ATag :color="handleGetArticleStatus(article.status) === '已发布' ? 'green' : 'orange'">
                      {{ handleGetArticleStatus(article.status) }}
                    </ATag>
                  </div>
                </div>
              </div>
              <div v-if="!dashboardData.articleTop5List?.length && !loading" class="empty-state">暂无文章数据</div>
            </div>
          </ACard>
        </ACol>

        <!-- 最新评论内容 -->
        <ACol :span="12">
          <ACard class="content-card">
            <template #title>
              <span class="card-title">最新评论内容(评论功能待开发)</span>
            </template>
            <div class="comment-list">
              <div class="comment-item" v-for="(comment, index) in latestComments" :key="index">
                <div class="comment-avatar">
                  <AAvatar :size="32">{{ comment.avatar }}</AAvatar>
                </div>
                <div class="comment-content">
                  <div class="comment-author">{{ comment.author }}</div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-meta">
                    <span class="comment-article">文章：{{ comment.article }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ACard>
        </ACol>
      </ARow>
    </div>
  </div>
</template>

<style scoped lang="less">
.dashboard-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .statistics-section {
    margin-bottom: 24px;

    .statistic-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .statistic-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .statistic-info {
          flex: 1;

          .statistic-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }

          .statistic-value {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }
        }

        .statistic-icon {
          font-size: 40px;
          opacity: 0.8;
        }
      }
    }
  }

  .content-section {
    .content-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .article-list {
        .article-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #fafafa;
            margin: 0 -16px;
            padding-left: 16px;
            padding-right: 16px;
            border-radius: 4px;
          }

          &:last-child {
            border-bottom: none;
          }

          .article-main {
            .article-title {
              font-size: 14px;
              color: #333;
              font-weight: 500;
              margin-bottom: 8px;
              line-height: 1.4;
            }

            .article-summary {
              font-size: 13px;
              color: #666;
              line-height: 1.4;
              margin-bottom: 8px;
              word-break: break-all;
            }

            .article-meta {
              display: flex;
              align-items: center;
              gap: 8px;

              .article-date {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }

      .empty-state {
        text-align: center;
        color: #999;
        padding: 20px 0;
        font-size: 14px;
      }

      .comment-list {
        .comment-item {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #fafafa;
            margin: 0 -16px;
            padding-left: 16px;
            padding-right: 16px;
            border-radius: 4px;
          }

          &:last-child {
            border-bottom: none;
          }

          .comment-avatar {
            margin-right: 12px;
            flex-shrink: 0;
          }

          .comment-content {
            flex: 1;
            min-width: 0;

            .comment-author {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }

            .comment-text {
              font-size: 13px;
              color: #666;
              line-height: 1.4;
              margin-bottom: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .comment-meta {
              display: flex;
              flex-direction: column;
              gap: 2px;

              .comment-article {
                font-size: 12px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .comment-time {
                font-size: 12px;
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
