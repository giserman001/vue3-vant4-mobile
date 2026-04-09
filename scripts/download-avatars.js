import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const START_NUM = 351
const COUNT = 10
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images/avatar')

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  console.log(`创建目录: ${OUTPUT_DIR}`)
}

// 下载单张图片
function downloadImage(id) {
  const url = `https://picsum.photos/id/${id}/125/125`
  const outputPath = path.join(OUTPUT_DIR, `avatar-${String(id)}.jpg`)

  // 检查文件是否已存在
  if (fs.existsSync(outputPath)) {
    console.log(`跳过: avatar-${String(id).padStart(3, '0')}.jpg (已存在)`)
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    console.log(`下载: ${url}`)

    const request = https.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location
        console.log(`  重定向到: ${redirectUrl}`)
        https.get(redirectUrl, (redirectResponse) => {
          saveImage(redirectResponse, outputPath, id, { resolve, reject })
        }).on('error', reject)
        return
      }

      saveImage(response, outputPath, id, { resolve, reject })
    })

    request.on('error', (err) => {
      console.error(`  下载失败 (ID: ${id}):`, err.message)
      reject(err)
    })

    // 设置超时
    request.setTimeout(30000, () => {
      request.destroy()
      console.error(`  下载超时 (ID: ${id})`)
      reject(new Error('Timeout'))
    })
  })
}

// 保存图片到文件
function saveImage(response, outputPath, id, callbacks) {
  if (response.statusCode !== 200) {
    console.error(`  HTTP错误 (ID: ${id}): ${response.statusCode}`)
    callbacks.reject(new Error(`HTTP ${response.statusCode}`))
    return
  }

  const fileStream = fs.createWriteStream(outputPath)
  response.pipe(fileStream)

  fileStream.on('finish', () => {
    fileStream.close()
    console.log(`  完成: avatar-${String(id).padStart(3, '0')}.jpg`)
    callbacks.resolve()
  })

  fileStream.on('error', (err) => {
    fs.unlink(outputPath, () => {}) // 删除失败的文件
    console.error(`  保存失败 (ID: ${id}):`, err.message)
    callbacks.reject(err)
  })
}

// 主函数
async function main() {
  console.log('开始下载头像图片...')
  console.log(`输出目录: ${OUTPUT_DIR}`)
  console.log(`下载数量: ${COUNT} 张`)
  console.log('')

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < COUNT; i++) {
    const id = START_NUM + i
    try {
      await downloadImage(id)
      successCount++
    }
    catch {
      failCount++
    }

    // 添加延迟，避免请求过快
    if (i < COUNT - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log('')
  console.log('下载完成!')
  console.log(`成功: ${successCount} 张`)
  console.log(`失败: ${failCount} 张`)
}

main().catch(console.error)
