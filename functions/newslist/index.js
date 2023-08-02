const got = require('got')
const qs = require('querystring')

// 云函数入口函数
exports.main = async (event, context) => {
	// let question = qs.escape(event.q)
	// const response = await got(`https://chat.wxwxwxwx.top/api/askquestion?q=${question}`)
	const response = await got.post('https://news.wxwxwxwx.top/api/newslist', {
		json: {
			"pageNum": event.pageNo,
			"pageSize": event.pageSize,
			"tabIndex": event.tabIndex,
		}
	})
	return response.body
}