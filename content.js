// === 链接追踪参数清理器===
if (window.self === window.top) {
  console.log('链接追踪参数清理器 -- 已启动');

  // ===== 通用追踪参数黑名单 =====
  const GENERAL_REMOVE_KEYS = new Set([
    // 通用广告与社交平台追踪
    'fbclid', 'ttclid', 'twclid', 'gclid', 'gad_source', 'msclkid',
    'soc_src', 'soc_trk', 'yclid',
    'trackid', 'from_source', 'from', 'sec_uid',
    'traffic_source', 'share_source', 'xhsshare',
    '_hsenc', '_hsmi', 'hsa_cam', 'mc_cid', 'mc_eid', 'mkt_tok',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'ref', 'referrer', 'channel', 'source', 'medium',
    // 阿里 / 淘宝 / 天猫 / B站等常见追踪参数
    'spm', 'spm_id_from', 'scm', 'pvid', 'mi_id', 'upStreamPrice',
    'sourceType', 'suid', 'share_crt_v', 'un', 'shareurl', 'short_name',
    'app', 'bxsign', '_sub_ts'
  ]);

  // ===== 淘宝/天猫等电商白名单保留规则（对特定商品页更精准保留核心参数） =====
  function isTaobaoOrTmall(hostname) {
    return /(^|\.)(taobao\.com|tmall\.com|tmall\.hk|etao\.com)$/i.test(hostname);
  }

  // ---------- 清理函数 ----------
  function cleanUrl(href) {
    try {
      const url = new URL(href, document.baseURI);
      if (!url.protocol.startsWith('http')) return href;

      const params = new URLSearchParams(url.search);
      let changed = false;

      // 针对淘宝/天猫商品详情页做针对性处理
      if (isTaobaoOrTmall(url.hostname) && (url.pathname.includes('/item.htm') || url.pathname.includes('/detail.htm'))) {
        // 商品页核心白名单参数：id（商品ID）、skuId（规格ID）、sku_properties（规格属性）等
        const KEEP_KEYS = new Set(['id', 'skuId', 'sku_properties']);
        const currentKeys = Array.from(params.keys());
        for (const key of currentKeys) {
          if (!KEEP_KEYS.has(key)) {
            params.delete(key);
            changed = true;
          }
        }
      } else {
        // 通用黑名单过滤
        for (const key of GENERAL_REMOVE_KEYS) {
          if (params.has(key)) {
            params.delete(key);
            changed = true;
          }
        }
      }

      if (!changed) return href;
      const newSearch = params.toString();
      url.search = newSearch ? `?${newSearch}` : '';
      return url.toString();
    } catch {
      return href;
    }
  }

  // ---------- 清理当前页面地址栏 URL（无感 replaceState，不刷新页面） ----------
  function cleanCurrentLocation() {
    try {
      const currentUrl = window.location.href;
      const cleanedUrl = cleanUrl(currentUrl);
      if (cleanedUrl && cleanedUrl !== currentUrl) {
        window.history.replaceState(window.history.state, '', cleanedUrl);
        console.debug('已净化当前地址栏 URL:', currentUrl, '→', cleanedUrl);
      }
    } catch (e) {
      console.debug('净化当前地址栏失败:', e);
    }
  }

  // 立即在 document_start 执行一次地址栏净化
  cleanCurrentLocation();

  // ---------- 强制净化单个链接 ----------
  function cleanLink(link) {
    const original = link.getAttribute('href');
    if (!original) return;
    const cleaned = cleanUrl(original);
    if (cleaned !== original) {
      link.setAttribute('href', cleaned);
      console.debug('已净化链接:', original, '→', cleaned);
    }
  }

  // ---------- 强制净化所有链接 ----------
  function cleanAllLinks() {
    cleanCurrentLocation();
    document.querySelectorAll('a[href]').forEach(cleanLink);
  }

  // ---------- 首次清理（DOM 就绪后）----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanAllLinks);
  } else {
    cleanAllLinks();
  }

  // ---------- 延迟清理（防御页面脚本在加载完成后二次向 URL 或 DOM 追加参数）----------
  setTimeout(cleanAllLinks, 1000);
  setTimeout(cleanAllLinks, 3000);

  // ---------- 监听动态添加的节点 ----------
  const childObserver = new MutationObserver((mutations) => {
    mutations.forEach(mut => {
      mut.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches?.('a[href]')) cleanLink(node);
          node.querySelectorAll?.('a[href]').forEach(cleanLink);
        }
      });
    });
  });

  // ---------- 监听 href 属性变化（防御页面脚本直接修改现有链接）----------
  const attrObserver = new MutationObserver((mutations) => {
    mutations.forEach(mut => {
      if (mut.type === 'attributes' && mut.attributeName === 'href') {
        cleanLink(mut.target);
      }
    });
  });

  // ---------- 启动观察者 ----------
  function startObservers() {
    if (document.body) {
      childObserver.observe(document.body, { childList: true, subtree: true });
      attrObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
      });
      console.log('链接追踪参数清理器 -- 监听启用中');
    }
  }

  if (document.body) {
    startObservers();
  } else {
    document.addEventListener('DOMContentLoaded', startObservers);
  }

  // ---------- 挂载全局 ----------
  try {
    window.cleanUrl = cleanUrl;
  } catch (e) {}
} else {
  console.log('⏭️ iframe 内跳过');
}