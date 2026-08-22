# 链接追踪清理器

本仓库依赖vibe coding

A Chrome extension that automatically removes tracking parameters (such as spm, trackid) from web page links.

一个轻量的 Chrome 扩展，自动移除网页链接及当前页面地址栏中的常见追踪参数（支持淘宝/天猫/B站/社交平台等），保护您的隐私。

## 功能
- **打开即净化（地址栏清理）**：网页打开时立即自动清理当前地址栏的追踪参数（使用 `history.replaceState` 无感替换，不影响页面状态）。
- **页面链接自动清理**：页面加载后自动删除所有 `<a>` 标签中的追踪参数。
- **实时防御**：通过 `MutationObserver` 监听 DOM 变化和属性修改，防止页面脚本动态追加追踪参数。
- **电商专有精简优化**：针对淘宝/天猫商品详情页自动仅保留核心商品及规格参数（如 `id`、`skuId`、`sku_properties`），彻底过滤 `mi_id`、`spm`、`upStreamPrice` 等垃圾/追踪参数。

## 支持的追踪参数与规则
1. **淘宝 / 天猫商品页 (`item.htm` / `detail.htm`)**：
   - 白名单保留：`id`、`skuId`、`sku_properties`
   - 自动移除：`spm`、`mi_id`、`upStreamPrice`、`scm`、`pvid` 等所有其他多余参数。
2. **通用黑名单参数**：
   - 广告/分析：`utm_*`、`fbclid`、`gclid`、`ttclid`、`twclid`、`msclkid`、`_hsenc`、`_hsmi`、`hsa_cam`、`mc_cid`、`mc_eid`、`mkt_tok` 等
   - 社交/分享：`trackid`、`from`、`from_source`、`sec_uid`、`traffic_source`、`share_source`、`xhsshare`、`ref`、`referrer` 等
   - 阿里/B站等平台参数：`spm`、`spm_id_from`、`scm`、`pvid`、`suid`、`bxsign` 等

## 安装方法
```bash
git clone https://github.com/wufe8/clean-urls.git
```
或者直接下载 ZIP 并解压。

### 加载到 Chrome
1. 打开 Chrome，在地址栏输入 `chrome://extensions/` 并回车。
2. 打开右上角的 **开发者模式**。
3. 点击左上角的 **加载已解压的扩展程序**。
4. 选择包含 `manifest.json` 和 `content.js` 的项目文件夹。
5. 扩展即安装成功，无需额外配置。

## 注意事项
- 扩展默认会在所有网站运行。
- 删除所有参数可能影响某些网站的正常跳转。本扩展采用针对性规则与黑名单过滤，确保功能正常运行。
- 扩展不需要任何额外网络权限，也不会收集任何用户数据。

## 许可证
MIT
