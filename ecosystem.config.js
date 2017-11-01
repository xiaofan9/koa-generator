module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: 'topstar-api', // 名称
        script: './bin/www', // 脚本地址
        env: { // env 配置
            NODE_ENV: "production"
        },
        env_development: { // --env development 配置
            NODE_ENV: 'development'
        },
        exec_mode: "cluster", // 模式 “cluster”或“fork” 默认fork 
        interpreter_args: "--trace-sync-io", // node 后缀
        "watch": [ // 监听目录
            "app",
            "config"
        ],
        "instances": 0, // 意味着PM2将根据CPU的数量（集群模式）启动可能的最大进程
        "error_file": "logs/error.log", // 错误日志路径
        "out_file": "logs/app.log", // 普通日志路径
        "max_memory_restart": "500M", // 内存超过，重启
        "max_restarts": 10, // 连续不稳定重启次数（小于1秒间隔或通过min_uptime的自定义时间）
        "listen_timeout": 10000 // 监听超时时间
    }]
};