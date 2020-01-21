// This is a helper script to cleanup old commands since it gets crazy to look at db

let fb = new (require('../firebase'))
fs = require('fs')

// let tenToday = new Date("11/21/2018 10:00 PST")
// let sixPMToday = new Date("11/21/2018 18:00 PST")
// fb.db.ref('operations').once("value", function(snapshot) {
//     let ops = snapshot.val()
//     let keys = Object.keys(ops)
//     let count = 0;

//     for(var i=0; i<keys.length; i++) {
//         let op = ops[keys[i]];

//         let cr = op.created;
//         if (cr > tenToday && cr< sixPMToday) {
//             console.log(`${op.command} - ${op.completed}`)
//         }
    
//     }

//     console.log('done')
// });

console.log('Looking for runs...')
fb.db.ref('museum/runs').orderByChild('timestamp').limitToLast(2000).on('value', (snapshot) => {
    
    snapshot.forEach(function(runSnap) {
        let run = runSnap.val()
        let key = runSnap.key
        console.log(`key: ${key} => ${run.started}`)
    });
    // for (const [date, run] of Object.entries(snapshot.val())) {
    //     console.log(`${date}`)
    // }

    process.exit();
});
// fb.db.ref('museum/runs').once("value", function(snapshot) {
//     let runs = snapshot.val()
//     let keys = Object.keys(runs)
//     for(var i=0; i<keys.length; i++) {
//         let run = runs[keys[i]];
//         let started = run['started'];
//         let ds = new Date(started);
//         let ts = ds.getTime();
//         console.log(`${keys[i]} ${ts}`);
//         //console.log(`${keys[i]}`);

//         fb.db.ref('museum/runs').child(keys[i]).update({timestamp: ts});
//     }
//     //console.log(`runs: ${JSON.stringify(runs)}`);
//     // for(var i=0; i<run.length; i++) {
//     //     let log = logs[keys[i]];

//     //     let cr = new Date(log.timestamp);
//     //     if (cr > tenToday && cr< sixPMToday) {
//     //         //console.log(`${cr} ${log.data}`)

//     //         // filter ot paint events
//     //         if (/.* paint.*/i.test(log.data)) {
//     //             console.log(`${cr} ${log.data}`)
//     //         }
//     //     }
//     // }

//     console.log('done')


//     // process.exit();
// });

//fb.db.ref('museum/runs').child("12-31-2019 16:59:24").update({timestamp: 1577840364000});