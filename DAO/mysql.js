const mysql = require('mysql');
const databaseConf = require('../config/database').mysql;
/**
 * 功能：创建一个全局的mysql连接池
 */

let exportOBJ = {};

if (databaseConf.switch === true) {
    let pool = mysql.createPool(databaseConf);

    // 查询的异步写法
    function Query(sql, args, cb) {
        try {
            this.pool.query(sql, args, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return cb(null);
                }
                cb(results, fields);
            })
        }
        catch (e) {
            console.log(e);
            // 这里需要写入err日志
        }
    }

    // 查询的同步写法    
    function QuerySyncFunc(sql, args, that) {
        return new Promise((resolve, reject) => {
            if(that == null) {
                return resolve(null);
            }
            that.pool.query(sql, args, function (err, results, fields) {
                if (err)
                    return reject(err);
                let result = {
                    results: results,
                    fields: fields
                }
                return resolve(result);
            })

        })
    }

    // 在外面包裹一层错误处理，如果出错返回null，否则返回对应值。（其他的操作也可以参照这个来写）
    let QuerySync = async function (sql, args) {
        try {
            let result = await QuerySyncFunc(sql, args, this);
            return Promise.resolve(result);
        }
        catch (e) {
            console.log(e);
            return Promise.resolve(null);
            // 这里需要写入err日志
        }
    };

    exportOBJ.pool = pool;
    exportOBJ.Query = Query;
    exportOBJ.QuerySync = QuerySync;
}

module.exports = exportOBJ;