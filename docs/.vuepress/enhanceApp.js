// 对 vuepress 进行应用级别的配置

// 对当页面应用进行监听统计数据
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (typeof _hmt !== "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }

    next();
  });
};
