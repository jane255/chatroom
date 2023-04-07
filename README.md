# chatroom

# websocket-quick-start

[js-client](https://socket.io/docs/v4/client-api/ '')

[py-server](https://flask-socketio.readthedocs.io/en/latest/getting_started.html#initialization '')

[py-client](https://python-socketio.readthedocs.io/en/latest/client.html '') 


这个例子展示了 python 创建 websocket 服务端的方法，以及: 

- 使用 js 连接服务端
- 使用 python 连接服务端
- 使用 postman 连接服务端

解压后请先安装依赖

pip3 install -r requirements.txt --trusted-host pypi.douban.com -i https://pypi.douban.com/simple


2023-04-07
- 1，优化 Model 房间命名方式
- 2，去掉注册过程，简化登录流程
- 3，根据 chat 页面房间 id 自动加入或离开该房间
- 4，自动化群成员上下线

