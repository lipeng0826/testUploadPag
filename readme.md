# 业务组件库

## 关键配置

    ```js
        externals: [
        'react',
        ],
    ```
    externals: 将依赖的模块排除,比如使用CDN的方式引入jquery,那么把它排除掉,
    在打包的时候就不会打包jquery;
    官网: https://webpack.docschina.org/configuration/externals#root

## 如何调试业务组件

    使用 npm link
    官网: https://docs.npmjs.com/cli/v8/commands/npm-link

## 其他

    1.使用一个类似antd的文档工具增加入口页面(storybook,dumi)

## 优化

    支持多入口打包,可以方便多次调试
