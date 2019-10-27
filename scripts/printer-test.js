
this.printer = new (require('../printer'))({ logger: { log: console.log } } )

setTimeout(()=>
{
    this.printer.print(()=> {
            console.log(`print finished`)
        })
}, 3000)