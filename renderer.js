// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var game = new ex.Engine({
  width: 800,
  height: 600,
})

var paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20)
paddle.color = ex.Color.Chartreuse
paddle.collisionType = ex.CollisionType.Fixed
game.add(paddle)

game.input.pointers.primary.on('move', function (evt) {
  paddle.pos.x = evt.target.lastWorldPos.x
})

var ball = new ex.Actor(100, 300, 20, 20)
ball.color = ex.Color.Red
ball.draw = function (ctx, delta) {
  ctx.fillStyle = this.color.toString()
  ctx.beginPath()
  ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
ball.vel.setTo(200, 200)
ball.collisionType = ex.CollisionType.Passive
ball.on('precollision', function (ev) {
  if (bricks.indexOf(ev.other) > -1) {
    ev.other.kill()
  }
  var intersection = ev.intersection.normalize()
  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    ball.vel.x *= -1
  } else {
    ball.vel.y *= -1
  }
})
ball.on('postupdate', function () {
  if (this.pos.x < this.width / 2) {
    this.vel.x *= -1
  }
  if (this.pos.x + this.width / 2 > game.drawWidth) {
    this.vel.x *= -1
  }
  if (this.pos.y < this.height / 2) {
    this.vel.y *= -1
  }
})
ball.on('exitviewport', function () {
  alert('You lose!')
})
game.add(ball)

var padding = 20 // px
var xoffset = 65 // x-offset
var yoffset = 20 // y-offset
var columns = 5
var rows = 3

var brickColor = [ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow]
var brickWidth = game.drawWidth / columns - padding - padding / columns // px
var brickHeight = 30 // px
var bricks = []
for (var j = 0; j < rows; j++) {
  for (var i = 0; i < columns; i++) {
    bricks.push(
      new ex.Actor(
        xoffset + i * (brickWidth + padding) + padding,
        yoffset + j * (brickHeight + padding) + padding,
        brickWidth,
        brickHeight,
        brickColor[j % brickColor.length]
      )
    )
  }
}

bricks.forEach(function (brick) {
  brick.collisionType = ex.CollisionType.Active
  game.add(brick)
})

// Start the engine to begin the game.
game.start()