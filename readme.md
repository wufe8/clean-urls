# 链接追踪清理器

一个轻量的 Chrome 扩展，自动移除网页链接中的常见追踪参数，保护您的隐私。支持多个平台, 默认对所有网站运行。 具体支持哪些不知道, 包括这个readme在内的所有内容全部都是聊天ai输出结合人工简单改编的。

## 功能
- 自动清理：页面加载后自动删除链接中的追踪参数，无需任何操作。

- 实时防御：监听 DOM 变化和属性修改，防止页面脚本将链接改回。

- **(默认关闭)** 点击拦截：左键点击链接时重复净化后再使用 URL 跳转。

- 自定义参数：可轻松增删要删除的追踪参数（见下方配置说明）。

## 支持的追踪参数
扩展默认删除以下参数（可自行修改, 位于content.js的第六行）：

```js
  const REMOVE_KEYS = [
  'fbclid', 'ttclid', 'twclid', 'gclid', 'gad_source', 'msclkid',
  'soc_src', 'soc_trk', 'yclid',
  'spm_id_from', 'trackid', 'from_source', 'from', 'sec_uid',
  'traffic_source', 'share_source', 'xhsshare',
  '_hsenc', '_hsmi', 'hsa_cam', 'mc_cid', 'mc_eid', 'mkt_tok',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'ref', 'referrer', 'channel', 'source', 'medium'
  ];
```

## 安装方法
```bash
git clone https://github.com/wufe8/clean-urls.git
```
或者直接下载 ZIP 并解压。

加载到 Chrome
打开 Chrome，在地址栏输入 chrome://extensions/ 并回车。

打开右上角的 开发者模式。

点击左上角的 加载已解压的扩展程序。

选择刚才clone或解压的文件夹（包含 manifest.json 和 content.js）。

扩展即安装成功，无需额外配置。

## 注意事项
扩展默认会在所有网站运行 有限制需求可通过浏览器的"扩展程序->详情->有权访问的网站"添加白名单

删除所有参数可能影响某些网站的正常跳转（如搜索分页参数）。本扩展默认只删除指定的追踪参数，保留其他参数。

扩展不需要任何额外权限，也不会收集任何用户数据。

## 贡献
我不知道啊 全是ai输出的 我就复制粘贴看着能用 你提issue我也看不懂js

许可证
MIT
