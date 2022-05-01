/**
 * 检查必需的参数
 * @param {Object} params 需要检查的参数对象
 * @returns {string} 返回未定义的参数名称字符串
 */
export default (params: any) => {
    return Object.keys(params)
        .filter(field => params[field] === undefined)
        .join(' ')
}
