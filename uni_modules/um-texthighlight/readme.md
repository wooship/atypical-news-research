<h3 align="center" style="margin: 30px 0 30px;font-weight: bold;font-size:40px;">um-texthighlight</h3>
<h3 align="center">关键字文本高亮</h3>

## 说明
um-texthighlight 是基于[uni-app](https://uniapp.dcloud.io/)生态的一款可自动将关键字文本高亮的组件，传入文本和关键字，组件会自动高亮显示关键字内容。

## 使用方法
 符合[uni-app](https://uniapp.dcloud.io/)的插件模块化规范配置，直接引用即可。

```html
<view>

	<!-- 使用方法：传入文本和关键字，组件会自动高亮显示关键字 -->
	<um-texthighlight :text="item" :keyword="keyword" color="red"></um-texthighlight>		

</view>
```
## API

Props

|  属性名  |  说明  |  类型  |
|  ----  |  ----  |  ----  |
| text  | 需要显示的完整文本内容 | String |
| keyword  | keyword| String |
| color  | 高亮的颜色(默认值'red') | String |


## 交流反馈

留言信息无法实时查看，如需及时交流和反馈可加入QQ群：368365360