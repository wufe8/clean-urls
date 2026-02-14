// === 链接追踪参数清理器===
if (window.self === window.top) {
  console.log('链接追踪参数清理器 -- 已启动');

  // ===== 配置区：在此添加你要删除的追踪参数 =====
  const REMOVE_KEYS = [
  'fbclid', 'ttclid', 'twclid', 'gclid', 'gad_source', 'msclkid',
  'soc_src', 'soc_trk', 'yclid',
  'spm_id_from', 'trackid', 'from_source', 'from', 'sec_uid',
  'traffic_source', 'share_source', 'xhsshare',
  '_hsenc', '_hsmi', 'hsa_cam', 'mc_cid', 'mc_eid', 'mkt_tok',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'ref', 'referrer', 'channel', 'source', 'medium'
  ];
  // =============================================

  // ---------- 清理函数（只删除指定参数）----------
  function cleanUrl(href) {
    try {
      const url = new URL(href, document.baseURI);
      if (!url.protocol.startsWith('http')) return href;

      const params = new URLSearchParams(url.search);
      let changed = false;
      REMOVE_KEYS.forEach(key => {
        if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      });

      if (!changed) return href;
      const newSearch = params.toString();
      url.search = newSearch ? `?${newSearch}` : '';
      return url.toString();
    } catch {
      return href;
    }
  }

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
    document.querySelectorAll('a[href]').forEach(cleanLink);
  }

  // ---------- 首次清理（DOM 就绪后）----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanAllLinks);
  } else {
    cleanAllLinks();
  }

  // ---------- 可选：一次延迟清理（防御早期重写，默认3秒）----------
  setTimeout(cleanAllLinks, 3000);

  // ---------- 可选：每3秒扫描一次（防御多次重写, 默认关闭）----------
  //setInterval(cleanAllLinks, 3000);

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
    childObserver.observe(document.body, { childList: true, subtree: true });
    attrObserver.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
    console.log('链接追踪参数清理器 -- 监听启用中');
  }

  if (document.body) {
    startObservers();
  } else {
    document.addEventListener('DOMContentLoaded', startObservers);
  }

// ---------- 点击拦截（捕获阶段，仅处理普通左键，保留修饰键和中键的默认行为, 默认不启动）----------
// document.addEventListener('click', function(e) {
//   const link = e.target.closest('a[href]');
//   if (!link) return;
// 
//   // 如果有修饰键（Ctrl/Shift/Meta）或者不是左键（中键等），不拦截，让浏览器默认处理
//   if (e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) {
//     // 虽然不拦截，但链接的 href 已经被我们净化，默认行为会使用干净 URL
//     return;
//   }
// 
//   const rawHref = link.getAttribute('href');
//   if (!rawHref) return;
//   const cleanHref = cleanUrl(rawHref);
//   if (cleanHref && cleanHref.startsWith('http')) {
//     e.preventDefault();      // 阻止网站自己的路由逻辑
//     e.stopPropagation();     // 可选
//     console.log('点击跳转（已净化）:', cleanHref);
//     window.location.href = cleanHref; // 当前页跳转
//   }
// }, true);

  // ---------- 挂载全局（仅用于扩展内部，控制台无法访问，属于正常隔离）----------
  // （此处的挂载并非必需，但保留以供扩展内部使用；控制台无法访问是Chrome的安全机制）
  try {
    window.cleanUrl = cleanUrl;
  } catch (e) {}
} else {
  console.log('⏭️ iframe 内跳过');
}