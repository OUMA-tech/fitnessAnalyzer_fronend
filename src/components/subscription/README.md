# 订阅系统组件使用指南

这个目录包含了完整的订阅管理系统，包括订阅页面、服务、Hooks和UI组件。

## 文件结构

```
subscription/
├── SubscriptionPage.tsx          # 主订阅管理页面
├── SubscriptionIndicator.tsx     # 订阅状态指示器组件
├── UpgradePrompt.tsx            # 升级提示组件
├── SubscriptionUsageExample.tsx # 使用示例
└── README.md                    # 本文件
```

## 核心组件

### 1. SubscriptionPage
主要的订阅管理页面，包含：
- **智能数据加载**: 优先使用Redux中的订阅数据，如果没有则从API获取
- 当前订阅状态显示
- 可用计划展示
- 订阅历史记录
- 升级/降级功能
- 取消订阅功能
- **集成SubscriptionIndicator**: 当没有活跃订阅时显示订阅指示器

**使用方式：**
```tsx
import { SubscriptionPage } from './pages/subscription/SubscriptionPage';

// 在路由中使用
<Route path="/subscription" element={<SubscriptionPage />} />
```

### 2. SubscriptionIndicator
订阅状态指示器，有多种变体：
- `chip`: 显示为标签形式
- `icon`: 显示为图标按钮
- `text`: 显示为文本形式

**使用方式：**
```tsx
import { SubscriptionIndicator } from './components/subscription/SubscriptionIndicator';

// 基本使用
<SubscriptionIndicator />

// 带菜单的图标形式
<SubscriptionIndicator variant="icon" showMenu />

// 小尺寸标签
<SubscriptionIndicator variant="chip" size="small" />
```

**集成位置：**
- **导航栏**: 在Navigation组件中显示当前订阅状态
- **订阅页面**: 当没有活跃订阅时显示
- **设置页面**: 在订阅管理区域显示

### 3. UpgradePrompt
升级提示组件，用于在用户使用免费功能时提示升级。

**使用方式：**
```tsx
import { UpgradePrompt, WorkoutUpgradePrompt } from './components/subscription/UpgradePrompt';

// 通用升级提示
<UpgradePrompt />

// 专门的升级提示
<WorkoutUpgradePrompt />
<AnalyticsUpgradePrompt />
<NutritionUpgradePrompt />
<PlanUpgradePrompt />

// 自定义升级提示
<UpgradePrompt
  title="Custom Feature"
  description="Upgrade to access this feature"
  features={['Feature 1', 'Feature 2']}
  variant="banner"
/>
```

## Hooks

### useSubscription
主要的订阅状态管理Hook，提供：
- 当前订阅信息
- 订阅状态
- 刷新功能
- 活跃订阅检查

```tsx
import { useSubscription } from '../hooks/useSubscription';

const { subscription, status, refresh, hasActiveSubscription } = useSubscription();
```

### useUserSubscription
基于Redux的订阅管理Hook，提供：
- Redux中的订阅数据
- 订阅状态检查
- 订阅操作（取消、重新激活）

```tsx
import { useUserSubscription } from '../hooks/useUserSubscription';

const { subscription, isActive, isPro, refreshSubscription, cancelSubscription } = useUserSubscription();
```

## 服务层

### SubscriptionService
提供完整的订阅管理API：

```tsx
import { SubscriptionService } from '../services/subscriptionService';

// 获取当前订阅
const subscription = await SubscriptionService.getCurrentSubscription();

// 创建订阅
const response = await SubscriptionService.createSubscription({ priceId: 'price_123' });

// 取消订阅
const success = await SubscriptionService.cancelSubscription('sub_123');

// 检查是否有活跃订阅
const hasActive = await SubscriptionService.hasActiveSubscription();

// 获取订阅状态
const status = await SubscriptionService.getSubscriptionStatus();
```

## 功能门控

### FeatureGate
用于控制Pro功能的访问。

**使用方式：**
```tsx
import { FeatureGate } from './components/subscription/SubscriptionUsageExample';

const MyComponent = () => {
  return (
    <FeatureGate feature="analytics">
      <AdvancedAnalytics />
    </FeatureGate>
  );
};

// 或者使用自定义fallback
<FeatureGate 
  feature="unlimited_workouts" 
  fallback={<CustomUpgradeMessage />}
>
  <UnlimitedWorkouts />
</FeatureGate>
```

## 集成到现有页面

### 1. 在导航栏中添加订阅指示器 ✅
```tsx
import { SubscriptionIndicator } from './components/subscription/SubscriptionIndicator';

const Header = () => {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">My App</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <SubscriptionIndicator variant="icon" showMenu />
      </Toolbar>
    </AppBar>
  );
};
```

### 2. 在功能页面中添加升级提示
```tsx
import { useProAccess } from '../hooks/useSubscription';
import { WorkoutUpgradePrompt } from './components/subscription/UpgradePrompt';

const WorkoutPage = () => {
  const { canAccessPro } = useProAccess();
  
  return (
    <div>
      <h1>Workouts</h1>
      
      {!canAccessPro && <WorkoutUpgradePrompt />}
      
      {canAccessPro ? (
        <UnlimitedWorkoutFeatures />
      ) : (
        <LimitedWorkoutFeatures />
      )}
    </div>
  );
};
```

### 3. 在设置页面中添加订阅管理
```tsx
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionIndicator } from './components/subscription/SubscriptionIndicator';

const SettingsPage = () => {
  const { subscription, status } = useSubscription();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Subscription status card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Subscription</Typography>
            <SubscriptionIndicator variant="chip" />
          </Box>
          
          {subscription ? (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Plan: {subscription.planName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status: {subscription.status}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No active subscription
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
```

## 最新改进

### 1. 智能数据加载
- SubscriptionPage现在优先使用Redux中的订阅数据
- 如果Redux中没有数据，则从API获取
- 提供更快的页面加载体验

### 2. 导航栏集成
- SubscriptionIndicator已集成到Navigation组件
- 用户可以在导航栏中看到当前订阅状态
- 支持菜单交互，快速访问订阅管理

### 3. 改进的用户体验
- 当没有活跃订阅时，显示SubscriptionIndicator而不是空白状态
- 提供更清晰的升级路径
- 减少用户困惑，提高转化率

## 样式定制

所有组件都支持Material-UI的主题定制：

```tsx
<SubscriptionIndicator 
  sx={{ 
    backgroundColor: 'primary.main',
    color: 'white'
  }} 
/>

<UpgradePrompt 
  sx={{
    border: '2px solid',
    borderColor: 'primary.main'
  }}
/>
``` 