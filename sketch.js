let spriteSheet; // 儲存載入的角色圖片精靈。
let actionSpriteSheet; // 儲存上鍵觸發的動作圖片精靈。
let spriteFrameWidth; // 儲存單張動畫影格的寬度。
let spriteFrameHeight; // 儲存單張動畫影格的高度。
let originalFrameAspect; // 儲存原始影格比例，避免調整精靈尺寸後角色變形。
let actionFrameWidth; // 儲存動作精靈單張影格的寬度。
let actionFrameHeight; // 儲存動作精靈單張影格的高度。
let actionFrameAspect; // 儲存動作精靈單張影格的比例。
let playerX; // 儲存角色目前的水平位置。
let playerY; // 儲存角色目前的垂直位置。
let actionStartTime = null; // 儲存動作動畫的開始時間，空值代表沒有播放動作。
let facing = 1; // 設定角色初始朝右。
const spriteFrameCount = 11; // 設定橫向精靈圖的影格數量。
const actionSpriteFrameCount = 6; // 設定上鍵動作精靈圖的影格數量。
const actionFrameDuration = 100; // 設定動作精靈每格播放的毫秒數。
const spriteSheetWidth = 1019; // 設定整張精靈圖的目標寬度。
const spriteSheetHeight = 195; // 設定整張精靈圖的目標高度。
const playerDisplayWidth = 160; // 設定角色在畫布上的顯示寬度。
const playerSpeed = 240; // 設定角色每秒移動的像素數。

function preload() { // 在畫布建立前載入角色精靈圖。
  spriteSheet = loadImage("1/星星/all.png"); // 載入指定路徑的橫向精靈圖。
  actionSpriteSheet = loadImage("1/星星2/ALL2.png"); // 載入上鍵觸發的六格動作精靈圖。
}

function setup() { // 初始化全螢幕畫布與角色資料。
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布。
  imageMode(CENTER); // 讓角色圖片以指定位置為中心繪製。
  spriteFrameWidth = spriteSheet.width / spriteFrameCount; // 根據原始圖片寬度計算單格寬度。
  spriteFrameHeight = spriteSheet.height; // 使用原始圖片高度作為單格高度。
  originalFrameAspect = spriteFrameWidth / spriteFrameHeight; // 記錄原始單格比例以保持角色外觀。
  spriteSheet.resize(spriteSheetWidth, spriteSheetHeight); // 將載入的精靈圖調整為指定的 1019×195。
  spriteFrameWidth = spriteSheet.width / spriteFrameCount; // 依調整後的精靈圖重新計算單格寬度。
  spriteFrameHeight = spriteSheet.height; // 依調整後的精靈圖重新計算單格高度。
  actionFrameWidth = actionSpriteSheet.width / actionSpriteFrameCount; // 依動作精靈圖寬度計算單格寬度。
  actionFrameHeight = actionSpriteSheet.height; // 使用動作精靈圖高度作為單格高度。
  actionFrameAspect = actionFrameWidth / actionFrameHeight; // 計算動作精靈單格比例以保持角色外觀。
  playerX = width / 2; // 將角色放在畫布水平中央。
  playerY = height / 2; // 將角色放在畫布垂直中央。
}

function draw() { // 每一影格更新背景、移動與角色動畫。
  background("#f2e8cf"); // 使用指定的淡米色作為背景。

  if (keyIsDown(LEFT_ARROW)) { // 檢查是否按住鍵盤左方向鍵。
    facing = -1; // 讓角色轉向左方。
    playerX -= playerSpeed * deltaTime / 1000; // 依經過時間讓角色向左移動。
  } else if (keyIsDown(RIGHT_ARROW)) { // 檢查是否按住鍵盤右方向鍵。
    facing = 1; // 讓角色轉向右方。
    playerX += playerSpeed * deltaTime / 1000; // 依經過時間讓角色向右移動。
  }

  playerX = constrain(playerX, min(playerDisplayWidth / 2, width / 2), max(width - playerDisplayWidth / 2, width / 2)); // 將角色限制在畫布水平範圍內。

  let currentSpriteSheet = spriteSheet; // 預設使用原始角色精靈圖。
  let currentFrameWidth = spriteFrameWidth; // 預設使用原始精靈單格寬度。
  let currentFrameHeight = spriteFrameHeight; // 預設使用原始精靈單格高度。
  let currentFrameAspect = originalFrameAspect; // 預設使用原始精靈單格比例。
  let animationFrame = floor(frameCount / 6) % spriteFrameCount; // 預設播放原始動作的循環影格。

  if (actionStartTime !== null) { // 檢查上鍵觸發的動作是否正在播放。
    const elapsedActionFrames = floor((millis() - actionStartTime) / actionFrameDuration); // 計算動作已播放的影格數。

    if (elapsedActionFrames < actionSpriteFrameCount) { // 確認六格動作尚未播放完畢。
      currentSpriteSheet = actionSpriteSheet; // 改用上鍵觸發的動作精靈圖。
      currentFrameWidth = actionFrameWidth; // 使用動作精靈單格寬度。
      currentFrameHeight = actionFrameHeight; // 使用動作精靈單格高度。
      currentFrameAspect = actionFrameAspect; // 使用動作精靈單格比例。
      animationFrame = elapsedActionFrames; // 按順序播放六格動作且不循環。
    } else { // 六格動作播放完成後執行。
      actionStartTime = null; // 清除動作狀態並回到原始循環動作。
    }
  }

  const playerDisplayHeight = playerDisplayWidth / currentFrameAspect; // 依目前動作的影格比例計算角色顯示高度。

  push(); // 暫存畫布的繪圖狀態。
  translate(playerX, playerY); // 將繪圖原點移到角色位置。
  scale(facing, 1); // 依角色方向水平翻轉圖片。
  image(currentSpriteSheet, 0, 0, playerDisplayWidth, playerDisplayHeight, animationFrame * currentFrameWidth, 0, currentFrameWidth, currentFrameHeight); // 繪製目前動作的動畫影格。
  pop(); // 還原畫布的繪圖狀態。
}

function keyPressed() { // 按下上鍵時開始播放一次動作動畫。
  if (keyCode === UP_ARROW && actionStartTime === null) { // 只在上鍵按下且沒有動作播放時觸發。
    actionStartTime = millis(); // 記錄動作開始時間以播放完整六格。
  }
}

function windowResized() { // 視窗尺寸改變時同步調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗。
}
