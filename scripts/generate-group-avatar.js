import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const AVATAR_DIR = path.join(__dirname, '../src/assets/images/avatar')
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images/group-avatar')
const OUTPUT_SIZE = 125 // 输出图片尺寸

// 确保输出目录存在，并清空旧文件
if (fs.existsSync(OUTPUT_DIR)) {
  // 删除目录下所有文件
  const files = fs.readdirSync(OUTPUT_DIR)
  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file)
    fs.unlinkSync(filePath)
  }
  console.log(`已清空: ${OUTPUT_DIR}`)
}
else {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 获取所有头像文件
function getAvatarFiles() {
  if (!fs.existsSync(AVATAR_DIR)) {
    console.error(`头像目录不存在: ${AVATAR_DIR}`)
    return []
  }

  return fs.readdirSync(AVATAR_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => path.join(AVATAR_DIR, file))
}

// 计算宫格布局 - 根据微信截图的规则
function getGridLayout(count) {
  // 根据截图：
  // 2人：1行2列，左右排列
  // 3人：1行3列，头像较小，水平排列在中间
  // 4人：2x2，填满
  // 5人：2行，第一行2个，第二行3个，整体居中
  // 6人：2x3 或 3x2，根据截图是 2行3列
  // 7人：3行，第一行2个，第二行3个，第三行2个，整体居中
  // 8人：3行，第一行3个，第二行2个，第三行3个，整体居中
  // 9人：3x3，填满

  const layouts = {
    // 2人：1行2列，左右排列
    2: { rows: 1, cols: 2, size: 58, gap: 3 },
    // 3人：第一行1个，第二行2个，头像一样大
    3: { rows: 2, cols: [1, 2], size: 56, gap: 3 },
    // 4人：2x2
    4: { rows: 2, cols: 2, size: 58, gap: 3 },
    // 5人：2行，2+3
    5: { rows: 2, cols: [2, 3], size: 36, gap: 3 },
    // 6人：2x3
    6: { rows: 2, cols: 3, size: 36, gap: 3 },
    // 7人：3行，1+3+3，第一行1个居中，第二三行各3个
    7: { rows: 3, cols: [1, 3, 3], size: 36, gap: 3 },
    // 8人：3行，2+3+3，第一行2个居中，第二三行各3个
    8: { rows: 3, cols: [2, 3, 3], size: 36, gap: 3 },
    // 9人：3x3
    9: { rows: 3, cols: 3, size: 38, gap: 3 },
  }

  return layouts[count] || layouts[9]
}

// 生成单个群头像
async function generateGroupAvatar(avatarFiles, memberCount, countIndex) {
  const selectedAvatars = avatarFiles
    .sort(() => Math.random() - 0.5)
    .slice(0, memberCount)

  const layout = getGridLayout(memberCount)

  // 创建空白画布 - 浅灰色背景
  const canvas = sharp({
    create: {
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
      channels: 3,
      background: { r: 240, g: 240, b: 240 },
    },
  }).jpeg({ quality: 90 })

  // 计算整体居中偏移
  const { rows, cols, size, sizes, gap } = layout

  // 合成每个头像
  const composites = []
  let avatarIndex = 0

  // 预计算每行的高度（用于3人布局不同大小）
  const rowHeights = []
  for (let row = 0; row < rows; row++) {
    if (sizes) {
      rowHeights.push(sizes[row] || sizes[sizes.length - 1])
    }
    else {
      rowHeights.push(size)
    }
  }

  // 计算总高度用于垂直居中
  const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0) + (rows - 1) * gap
  let currentY = (OUTPUT_SIZE - totalHeight) / 2

  for (let row = 0; row < rows; row++) {
    // 获取当前行的列数和大小
    const rowCols = Array.isArray(cols) ? cols[row] : cols
    const rowSize = sizes ? (sizes[row] || sizes[sizes.length - 1]) : size

    // 计算当前行的总宽度，用于居中
    const rowWidth = rowCols * rowSize + (rowCols - 1) * gap
    const startX = (OUTPUT_SIZE - rowWidth) / 2

    for (let col = 0; col < rowCols; col++) {
      if (avatarIndex >= selectedAvatars.length) {
        break
      }

      const x = Math.floor(startX + col * (rowSize + gap))
      const y = Math.floor(currentY)

      try {
        const resizedBuffer = await sharp(selectedAvatars[avatarIndex])
          .resize(rowSize, rowSize, { fit: 'cover' })
          .toBuffer()

        composites.push({
          input: resizedBuffer,
          left: x,
          top: y,
        })
      }
      catch (err) {
        console.error(`  处理图片失败: ${selectedAvatars[avatarIndex]}`, err.message)
      }

      avatarIndex++
    }

    currentY += rowSize + gap
  }

  // 合成图片 - 命名包含头像数量（不补0）
  const outputPath = path.join(OUTPUT_DIR, `group-${memberCount}-${countIndex}.jpg`)
  await canvas.composite(composites).toFile(outputPath)

  console.log(`  生成: group-${memberCount}-${countIndex}.jpg (${memberCount}人)`)
}

// 主函数
async function main() {
  console.log('开始生成群头像...')

  const avatarFiles = getAvatarFiles()
  if (avatarFiles.length < 2) {
    console.error(`头像数量不足，需要至少2个头像，当前只有${avatarFiles.length}个`)
    console.log(`请先运行: pnpm download:avatars`)
    return
  }

  console.log(`找到 ${avatarFiles.length} 个头像`)
  console.log(`输出目录: ${OUTPUT_DIR}`)
  console.log('')

  // 每种人数的计数器
  const countByMember = {}

  // 生成50个不同的群头像
  const GROUP_COUNT = 100
  for (let i = 0; i < GROUP_COUNT; i++) {
    // 随机选择2-9个头像（包含2和9）
    const memberCount = Math.min(avatarFiles.length, Math.floor(Math.random() * 8) + 2)

    // 初始化该人数的计数器
    if (!countByMember[memberCount]) {
      countByMember[memberCount] = 0
    }
    countByMember[memberCount]++

    await generateGroupAvatar(avatarFiles, memberCount, countByMember[memberCount])
  }

  console.log(`完成! 共生成 ${GROUP_COUNT} 个群头像`)
}

main().catch(console.error)
