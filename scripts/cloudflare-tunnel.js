import { Tunnel } from 'cloudflared'

console.log('启动 Cloudflare Tunnel...')

// 创建指向本地 9999 端口的 tunnel
const tunnel = new Tunnel({
  '--url': 'https://localhost:9999',
})

// 显示 URL
tunnel.once('url', (url) => {
  console.log('\n✅ Tunnel 已启动!')
  console.log('📱 手机访问:', url)
  console.log('\n按 Ctrl+C 停止\n')
})

// 连接信息
tunnel.once('connected', (conn) => {
  console.log('🔗 已连接到:', conn.location)
})

// 错误处理
tunnel.on('error', (err) => {
  console.error('❌ 错误:', err)
})

// 退出处理
tunnel.on('exit', (code) => {
  console.log('Tunnel 已退出，代码:', code)
  process.exit(code)
})

// Ctrl+C 处理
process.on('SIGINT', () => {
  console.log('\n正在停止 Tunnel...')
  tunnel.stop()
})
