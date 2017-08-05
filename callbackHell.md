> 记于阿里校招电话面 对callback hell理解的后续学习

面试官问我，异步编程的回调地狱你了解吗，知道如何去避免吗？然后我就懵逼了，隐约记得promise好像可以减少回调，但是不清楚具体的操作方式，就回了个promise可以解决，面试官追问，知道 generator吗，了解es7 中的aync，await吗，由于对es6都不是特别清楚，直接无言，面试完，花了点时间学习整理了下 callback hell 的一些内容

#### 什么是回调地狱

当代码中写出嵌套的 })， 这样嵌套的 }) 就被亲切的称呼为回调地狱，为什么会叫它地狱，在个人看来有两个方面，

	1. 代码难以阅读，
	2.  难以修改，如果要删除或者修改其中的某个回调，单单是去寻找 }) 就会让人头大，而且修改很容易错

在这里有具体详细的解释 [callback hell](https://www.callbackhell.com/)

#### 逃离回调地狱

##### 扁平化代码

最简单的方法就是给每个函数命名，回调函数处用函数名去替代，而具体的函数体写在外面，通过扁平化核心代码的方法可以解决回调地狱

##### 使用promise

详细的promise用法，这里不介绍，可以查考[es6 入门](http://es6.ruanyifeng.com/#docs/generator-async)

使用promise避免大量回调的主要思想是通过将嵌套的回调函数写成级联性质的回调

##### 使用generator

generator 提供了一种于有限状态机类似的方法来避免回调，在generator内部，通过yield关键字可以控制函数的执行情况，具体表现为generator函数可以在yield关键字处暂停运行。使用generator来避免回调的主要思想是通过交换生成器生成的迭代器内外的执行权来控制迭代器内部的任务运行状态。具体的情况可以理解为生成器内执行第一个任务，并将结果以及执行权交给生成器外，生成器外根据第一次任务执行的结果以及状态来确定是否将数据交还给生成器内。实现方式有两种，分别是基于Thunk函数和基于promise的运行

###### 基于Thuck函数的generator流程控制

Thuck 起源于类c语言函数调用时的传参引用，表现为给参数表达式加上一个指向函数，而这里的thuck函数是将一个多参函数转化为一种单参函数，并且单个参数值为回调函数，简单的thuck函数模拟

```Javascript
var thuck = function(fn){
    return function(...args){
        return function(callback){
            return fn.call(this, ...args, callback); 
        }
    }
}
```

是用thuck函数的目的是为了自动控制generator的运行，本质上讲也是一种回调

```javascript
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
```

###### 基于promise的generator流程控制

基于promise的generator流程控制的主要想法是通过promise的then方法将执行权交还给迭代器

```javascript
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
```

##### 使用async/await

使用await/async来实现函数的异步，在es7中提供 具体表现为先声明一个异步的函数，在异步函数中确定需要去等待的函数

```Javascript
async function b(){
    await a();
    console.log('b');
}

function a(){
    console.log('a');
}
```

