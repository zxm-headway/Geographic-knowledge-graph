import data from "./realdata.json"


// // let data = JSON.stringify(data)

// // console.log(data)

// data['nodes'].froEach()

data.nodes.forEach((node,index)=>{
  node.id = index
})

console.log(data)