// 基于promise解决callback hell 

// 基于generator 解决callback hell

// 基于generator 的thuck函数使用解决callback hell
var thuck = function(fn){
    return function(...args){
        return function(callback){
            return fn.call(this, ...args, callback); 
        }
    }
}

// 这里使用递归实现了将上一步的操作结果给了下一步
// 但是具体的数据操作还是需要放在具体的generator内部的field语句内
var run = function(generatot){
    var gen = generator(); 
    function next(err, data){
       var nextObj = gen.next(data); 
       if(nextObj.done)
            return; 
       nextObj.value(next);
    }
}
// 基于generator 的promise函数解决callback hell

var co = function(generator){
    var gen = generator();
    function next(){
        var nextObj = gen.next(data); 
        if(nextObj.done) return; 
        nextObj.value.then(function(data){
            next(data);
        })
    }
}

// 使用await/async来实现函数的异步，在es7中提供
// 具体表现为先声明一个异步的函数，在异步函数中确定需要去等待的函数
async function b(){
    await a();
    console.log('b');
}

function a(){
    console.log('a');
}