{
    const PENDING='pending'
    const FULLFILLED='fulfilled'
    const REJECTED='rejected'
    function isThenable(x){
        return (((typeof x==='object'&& x!==null)||typeof x==='function')&&typeof x.then ==='function')
    }
   class MyPromise{
       #state=PENDING
       #result=null
       #handlerQueen=[]
       constructor(exec){
           if(typeof exec !=='function'){
               throw new TypeError(` Promise resolver ${exec} is not a function`);
           }
           try {
               exec(this.#resolve.bind(this),this.#reject.bind(this));
           }catch (err){
               console.error(err)
           }
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
           this.#state=state
           this.#result=value;
           this.#runHandlers()
       }
       then(onFulfill,onReject){
            return new MyPromise((resolve,reject)=>{
                this.#handlerQueen.push({exec:onFulfill,state:FULLFILLED,resolve,reject})
                this.#handlerQueen.push({exec:onReject, state:REJECTED,resolve,reject})
                this.#runHandlers()
            })
       }
       #runHandlers(){
           if(this.#state === PENDING){
               return
           }else if(this.#handlerQueen[0]){
               this.#runOneHandler(this.#handlerQueen[0])
               this.#handlerQueen.shift()
           }
       }
       #runOneHandler({exec,state,resolve,reject}){
           if(state!==this.#state){
               return
           }else if(typeof exec !== 'function'){
               this.#state=FULLFILLED?resolve(this.#result):reject(this.#result)
           }else {
               try {
                   const x=exec(this.#result)
                   if(isThenable(x)){
                       x.then(resolve,reject)
                   }else {
                       resolve(x)
                   }
               }catch (err){
                   console.error(err)
               }
           }
       }
   }
}