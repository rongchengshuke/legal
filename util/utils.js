// utils.js
export default {
  // 时间戳转化为年月日
  convertTimestamp(time) {
    const dateObj = new Date(time);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; 
    const day = dateObj.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  },
  calculateRowSpansByFields(data, fields) {
    // 创建一个映射来存储每个字段的组ID和它们的计数  
    const groupCountMaps = fields.reduce((acc, field) => {  
      acc[field] = {};  
      return acc;  
    }, {});  
    // 遍历数据并计算每个字段的组ID的出现次数  
    data.forEach(item => {  
      fields.forEach(field => {  
        const groupId = item[field];  
        groupCountMaps[field][groupId] = (groupCountMaps[field][groupId] || 0) + 1;  
      });  
    });  
    // 创建一个新数组，其中每个对象都有额外的rowspan字段，对应每个传入的字段  
    let num = 1;
    const newData = data.map((item, index, array) => {  
      const rowSpans = {};  
      fields.forEach(field => {  
          const groupId = item[field];  
          // 检查当前项是否是具有相同字段值的组中的第一个项  
          const isFirstInGroup = index === 0 || array[index - 1][field] !== groupId;  
          rowSpans[field + 'Rowspan'] = isFirstInGroup ? groupCountMaps[field][groupId] : 0; // 为每个字段设置rowspan值  
      });  
      item.num = num
      if(rowSpans.nameRowspan > 0){
        num++
      }
      return {  
        ...item, // 保持原始对象的所有字段  
        ...rowSpans // 添加计算得到的rowspan字段  
      };  
    });  
    return newData;  
  },
}