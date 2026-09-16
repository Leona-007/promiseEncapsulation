{
    const PENDING='pending'
    const FULLFILLED='fulfilled'
    const REJECTED='rejected'
    function isThenable(x){
        return (((typeof x === 'object' && x=== 'null' )|| typeof x=== 'function')&&typeof x.then==='function')
    }
    // 放到微任务队列中
    function runMicroTask(callback){
        if(globalThis.queueMicrotask){
            globalThis.queueMicrotask(callback)
        }else if(globalThis.MutationObserver){
            const ob=new MutationObserver(callback)
            const p=document.createElement('p')
            ob.observe(p,{
                childList:true,
            })
            p.innerHTML='abc'
        }else if(globalThis.process){
            globalThis.process.nextTick(callback)
        }else{
            setTimeout(callback,0)
        }
    }
    class MyPromise{
        #state=PENDING
        #result=undefined
        #handlerQueen=[]
        constructor(exec){
            if(typeof exec !== 'function'){
                throw new TypeError(` Promise resolver ${exec} is not a function`);
            }
            try {
                exec(this.#resolve.bind(this),this.#reject.bind(this));
            }catch (err){
                console.error(err)
            }
        }
        then(onFulfill, onReject){
            return new MyPromise((resolve, reject)=>{
                this.#handlerQueen.push({exec:onFulfill, state:FULLFILLED,resolve,reject})
                this.#handlerQueen.push({exec:onReject, state:REJECTED,resolve,reject})
                this.#runHandlers()
            })
        }
        #resolve(value){
            this.#changeState(FULLFILLED,value)
        }
        #reject(reason){
            this.#changeState(REJECTED,reason)
        }
        #changeState(state,value){
            if(this.#state !== PENDING){
                return
            }
            this.#state=state;
            this.#result=value;
            this.#runHandlers()
        }
        #runHandlers(){
            if(this.#state===PENDING){
                return;
            }
            while(this.#handlerQueen[0]){
                this.#runOneHandler(this.#handlerQueen[0])
                this.#handlerQueen.shift()
            }
        }
        #runOneHandler({exec,state,resolve,reject}){
            runMicroTask( ()=>{
                if(state !== this.#state){
                    return;
                }else {
                    if(typeof exec !== 'function'){
                        this.#state===FULLFILLED?resolve(this.#result):reject(this.#result)
                    }else{
                        try {
                            const x=exec(this.#result)
                            if(isThenable(x)){
                                x.then(resolve,reject)
                            }else{
                                resolve(x)
                            }
                        }catch (err){
                            console.error(err)
                            reject(err)
                        }
                    }
                }
            })
        }
        catch(onReject){
            return this.then(null,onReject)
        }
        static resolve(value){
            return new MyPromise(function (resolve,reject){
                resolve(value)
            })
        }
        static reject(value){
            return new MyPromise(function (resolve,reject){
                reject(value)
            })
        }
        static all(it){
            return new MyPromise(function (resolve,reject){
                let i=0
                let index=0
                let res=[]
                for(let i of it){
                    i++;
                    MyPromise.resolve(resolve(i)).then(function (value) {
                        index++;
                        res[i]=value
                        if(i===value){
                            resolve(res)
                        }
                    },reject)
                }
            })
        }
        static race(it){
            return new MyPromise(function (resolve,reject){
                for(let i of it){
                    MyPromise.resolve(i).then(resolve,reject)
                }
            })
        }

}
    window.MyPromise=MyPromise

}