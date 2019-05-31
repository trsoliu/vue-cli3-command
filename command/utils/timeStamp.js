
/***
 * trsoliu 20190528
 * 用于生产 年月日时分秒 的时间戳
 * */


const timeStamp = () => {
	let date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	const formatNumber = n => {
		n = n.toString()
		return n[1] ? n : '0' + n
	}
	return [year, month, day, hour, minute, second].map(formatNumber).join('')
}

module.exports = {
	timeStamp
}