<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>黑客空间站</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
        }
        
        body {
            background: #000;
            color: #0f0;
            height: 100vh;
            overflow: hidden;
            position: relative;
        }
        
        /* 粒子背景效果 */
        #particles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        /* 黑客终端界面 */
        .container {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            height: 100vh;
            padding: 20px;
        }
        
        .terminal {
            border: 2px solid #0f0;
            border-radius: 5px;
            padding: 20px;
            flex-grow: 1;
            overflow-y: auto;
            background: rgba(10, 15, 10, 0.7);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }
        
        .output {
            margin-bottom: 15px;
        }
        
        .input-line {
            display: flex;
            align-items: center;
        }
        
        .prompt {
            color: #0f0;
            margin-right: 10px;
        }
        
        .cursor {
            display: inline-block;
            width: 8px;
            height: 20px;
            background: #0f0;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            50% { opacity: 0; }
        }
        
        /* 悬浮卡片效果 */
        .weather-card {
            position: absolute;
            right: 30px;
            bottom: 30px;
            width: 250px;
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            border-radius: 15px;
            padding: 20px;
            z-index: 3;
            transition: all 0.4s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .weather-card:hover {
            transform: translateY(-10px) scale(1.05);
            background: #FFE87C;
        }
        
        /* 打字机标题 */
        .typing-title {
            text-align: center;
            margin-bottom: 20px;
            font-size: 2.5em;
            position: relative;
        }
        
        .typing {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-right: .15em solid orange;
            animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
        }
        
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
    </style>
</head>
<body>
    <!-- 动态粒子背景 -->
    <canvas id="particles"></canvas>
    
    <div class="container">
        <!-- 打字机效果标题 -->
        <h1 class="typing-title">
            <span class="typing">系统初始化完成</span>
        </h1>
        
        <!-- 黑客终端界面 -->
        <div class="terminal">
            <div class="output">
                <p><span class="prompt">root@hack-system:~$</span> whoami</p>
                <p>超级用户访问权限已激活</p>
                <p><span class="prompt">root@hack-system:~$</span> scan network --full</p>
                <p>> 发现3个未受保护节点</p>
                <p>> 安全协议：HTTPS/SSL (加密强度：256位)</p>
                <p>> 防火墙状态：活动状态</p>
                <br>
                <p>⚠️ 警告：检测到未授权访问尝试</p>
                <p>🔒 已启动反入侵协议</p>
            </div>
            
            <div class="input-line">
                <span class="prompt">root@hack-system:~$</span>
                <span class="cursor"></span>
            </div>
        </div>
    </div>
    
    <!-- 交互式天气卡片 -->
    <div class="weather-card">
        <h3>当前位置天气</h3>
        <p>🌤️ 晴天 26°C</p>
        <p>💧 湿度: 42%</p>
        <p>💨 风速: 5km/h</p>
        <p>🌡️ 体感温度: 28°C</p>
    </div>
    
    <script>
        // 粒子背景系统
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 150;
        
        // 创建粒子
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `hsl(${Math.random() * 120 + 100}, 70%, 60%)`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // 粒子间连线
                particles.forEach(particle => {
                    const dx = this.x - particle.x;
                    const dy = this.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 0, ${0.2 - distance/500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(particle.x, particle.y);
                        ctx.stroke();
                    }
                });
            }
        }
        
        // 初始化粒子
        function init() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        init();
        animate();
        
        // 窗口大小调整响应
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    </script>
</body>
</html>
