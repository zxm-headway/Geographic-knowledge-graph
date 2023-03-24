import React,{useRef,useEffect} from 'react'
import {  WordCloud } from '@antv/g2plot';

export default function WordClouds() {
  const wordcloundRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{

    // const chart = new Chart({
    //   container: 'container',
    //   autoFit: true,
    //   padding: 0,
    // });
        //发起axios请求获取数据
        // let legendType  =  [
        //   "类型",
        //   "学校性质",
        //   "主管部门",
        //   "办学类型",
        //   "高校名称",
        //   "数据来源",
        //   "归属",
        // ];
    const data =  // 定义词云数据
    [
      {"value":11.739204307083542,"text":"水是","name":"类型"},
    {"value":9.23723855786,"text":"之源","name":"学校性质"},
    {"value":7.75434839431,"text":"万物","name":"主管部门"},
    {"value":11.3865516372,"text":"物质","name":"办学类型"},
    {"value":7.75434839431,"text":"万物","name":"高校名称"},
    {"value":5.83541244308,"text":"创造","name":"数据来源"},
    {"value":4.27215339948,"text":"形成","name": "归属"},

];
const wordCloud = new WordCloud(wordcloundRef.current, {
  data,
  wordField: 'name',
  weightField: 'value',
  colorField: 'name',
  wordStyle: {
    fontFamily: 'Verdana',
    fontSize: [8, 32],
    rotation: 0,
  },
  onWordClick: (name:any) => {
    console.log(`You clicked on "${name.text}" with weight ${name.value}`);
  },
  // 返回值设置成一个 [0, 1) 区间内的值，
  // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
  random: () => 0.5,
});
// 绑定事件
// plot.on('eventName', callback);
wordCloud.on('click',(event:any)=>{
  console.log(event.data.data.text)
})

wordCloud.render();
    // 添加事件监听器
    // wordcloundRef.current?.addEventListener('click', (event) => {
    //   // 获取点击位置相对于词云容器的坐标
    //   const { offsetX, offsetY } = event;

    //   // 获取点击位置上的词
    //   const word = wordCloud.getWordOfPoint(offsetX, offsetY);

    //   // 如果点击位置上存在词，则执行回调函数
    //   if (word) {
    //     console.log(`You clicked on "${word.text}" with weight ${word.value}`);
    //   }
    // });

  })

  return (
    <div ref={wordcloundRef} style={{width:'100%',height:'30vh'}}>
      
    </div>
  )
}
